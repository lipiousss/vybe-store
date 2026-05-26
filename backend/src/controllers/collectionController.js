import { prisma } from '../config/prisma.js';
import { slugify } from '../utils/slugify.js';

const collectionInclude = {
  products: {
    where: { status: 'ACTIVE' },
    include: {
      images: { orderBy: { order: 'asc' } },
      variants: true,
    },
    orderBy: { createdAt: 'desc' },
  },
};

async function createUniqueSlug(name, currentId = null) {
  const baseSlug = slugify(name);
  let candidate = baseSlug || 'collection';
  let suffix = 1;

  while (true) {
    const existing = await prisma.collection.findUnique({ where: { slug: candidate } });

    if (!existing || existing.id === currentId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

export async function getCollections(req, res, next) {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ collections });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminCollections(req, res, next) {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ collections });
  } catch (error) {
    return next(error);
  }
}

export async function getCollectionBySlug(req, res, next) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { slug: req.params.slug },
      include: collectionInclude,
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    return res.json({ collection });
  } catch (error) {
    return next(error);
  }
}

export async function createCollection(req, res, next) {
  try {
    const { name, description, image, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Collection name is required.' });
    }

    const collection = await prisma.collection.create({
      data: {
        name: name.trim(),
        slug: await createUniqueSlug(name),
        description: description || null,
        image: image || null,
        isActive: isActive ?? true,
      },
    });

    return res.status(201).json({ collection });
  } catch (error) {
    return next(error);
  }
}

export async function updateCollection(req, res, next) {
  try {
    const { name, description, image, isActive } = req.body;
    const current = await prisma.collection.findUnique({ where: { id: req.params.id } });

    if (!current) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    const data = {
      description: description === undefined ? undefined : description || null,
      image: image === undefined ? undefined : image || null,
      isActive,
    };

    if (name !== undefined) {
      data.name = name.trim();
      data.slug = await createUniqueSlug(name, current.id);
    }

    const collection = await prisma.collection.update({
      where: { id: current.id },
      data,
    });

    return res.json({ collection });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCollection(req, res, next) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found.' });
    }

    if (collection._count.products > 0) {
      return res.status(409).json({
        message: 'Collection cannot be deleted because products are linked to it.',
      });
    }

    await prisma.collection.delete({
      where: { id: req.params.id },
    });

    return res.json({ message: 'Collection deleted.' });
  } catch (error) {
    return next(error);
  }
}
