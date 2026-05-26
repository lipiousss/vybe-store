import { prisma } from '../config/prisma.js';
import { slugify } from '../utils/slugify.js';

const categoryInclude = {
  parent: true,
  children: {
    orderBy: { name: 'asc' },
  },
  _count: {
    select: {
      products: true,
      children: true,
    },
  },
};

async function createUniqueSlug(name, currentId = null) {
  const baseSlug = slugify(name);
  let candidate = baseSlug || 'category';
  let suffix = 1;

  while (true) {
    const existing = await prisma.category.findUnique({ where: { slug: candidate } });

    if (!existing || existing.id === currentId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

export async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      include: categoryInclude,
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' },
      ],
    });

    return res.json({ categories });
  } catch (error) {
    return next(error);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        ...categoryInclude,
        products: {
          where: { status: 'ACTIVE' },
          include: {
            images: { orderBy: { order: 'asc' } },
            variants: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    return res.json({ category });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      include: categoryInclude,
      orderBy: [
        { parentId: 'asc' },
        { name: 'asc' },
      ],
    });

    return res.json({ categories });
  } catch (error) {
    return next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, description, image, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required.' });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: await createUniqueSlug(name),
        description: description || null,
        image: image || null,
        parentId: parentId || null,
      },
      include: categoryInclude,
    });

    return res.status(201).json({ category });
  } catch (error) {
    return next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { name, description, image, parentId } = req.body;
    const current = await prisma.category.findUnique({ where: { id: req.params.id } });

    if (!current) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const data = {
      description: description === undefined ? undefined : description || null,
      image: image === undefined ? undefined : image || null,
      parentId: parentId === undefined ? undefined : parentId || null,
    };

    if (name !== undefined) {
      data.name = name.trim();
      data.slug = await createUniqueSlug(name, current.id);
    }

    const category = await prisma.category.update({
      where: { id: current.id },
      data,
      include: categoryInclude,
    });

    return res.json({ category });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    if (category._count.products > 0 || category._count.children > 0) {
      return res.status(409).json({
        message: 'Category cannot be deleted because products or child categories are linked to it.',
      });
    }

    await prisma.category.delete({
      where: { id: req.params.id },
    });

    return res.json({ message: 'Category deleted.' });
  } catch (error) {
    return next(error);
  }
}
