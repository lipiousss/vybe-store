import { prisma } from '../config/prisma.js';
import { slugify } from '../utils/slugify.js';

function parseBoolean(value) {
  if (value === undefined) {
    return undefined;
  }

  return value === true || value === 'true';
}

function buildArtworkWhere(query) {
  const { category, search } = query;
  const isActive = parseBoolean(query.isActive);

  const where = {
    isActive: isActive === undefined ? true : isActive,
  };

  if (category) {
    where.category = {
      contains: category,
      mode: 'insensitive',
    };
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { contains: search, mode: 'insensitive' } },
    ];
  }

  return where;
}

export async function getArtworks(req, res, next) {
  try {
    const artworks = await prisma.artwork.findMany({
      where: buildArtworkWhere(req.query),
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return res.json({ artworks });
  } catch (error) {
    return next(error);
  }
}

export async function getArtworkBySlug(req, res, next) {
  try {
    const artwork = await prisma.artwork.findFirst({
      where: {
        slug: req.params.slug,
        isActive: true,
      },
    });

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found.' });
    }

    return res.json({ artwork });
  } catch (error) {
    return next(error);
  }
}

async function createUniqueArtworkSlug(title, currentId = null) {
  const baseSlug = slugify(title) || 'artwork';
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const existing = await prisma.artwork.findUnique({ where: { slug: candidate } });

    if (!existing || existing.id === currentId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

function normalizeArtworkData(body, currentArtwork = null) {
  if (body.tags !== undefined && !Array.isArray(body.tags)) {
    throw Object.assign(new Error('Tags must be an array.'), { statusCode: 400 });
  }

  return {
    description: body.description === undefined ? undefined : body.description || null,
    image: body.image === undefined ? undefined : body.image,
    category: body.category === undefined ? undefined : body.category || null,
    tags: body.tags === undefined ? undefined : body.tags.map((tag) => String(tag).trim()).filter(Boolean),
    order: body.order === undefined ? undefined : Number(body.order || 0),
    isActive: body.isActive === undefined ? undefined : Boolean(body.isActive),
    title: currentArtwork ? undefined : body.title,
  };
}

export async function getAdminArtworks(req, res, next) {
  try {
    const artworks = await prisma.artwork.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return res.json({ artworks });
  } catch (error) {
    return next(error);
  }
}

export async function createArtwork(req, res, next) {
  try {
    if (!req.body.title || !req.body.image) {
      return res.status(400).json({ message: 'Artwork title and image are required.' });
    }

    const artwork = await prisma.artwork.create({
      data: {
        ...normalizeArtworkData(req.body),
        title: req.body.title.trim(),
        slug: await createUniqueArtworkSlug(req.body.title),
      },
    });

    return res.status(201).json({ artwork });
  } catch (error) {
    return next(error);
  }
}

export async function updateArtwork(req, res, next) {
  try {
    const currentArtwork = await prisma.artwork.findUnique({ where: { id: req.params.id } });

    if (!currentArtwork) {
      return res.status(404).json({ message: 'Artwork not found.' });
    }

    const data = normalizeArtworkData(req.body, currentArtwork);

    if (req.body.title !== undefined) {
      data.title = req.body.title.trim();
      data.slug = await createUniqueArtworkSlug(req.body.title, currentArtwork.id);
    }

    const artwork = await prisma.artwork.update({
      where: { id: currentArtwork.id },
      data,
    });

    return res.json({ artwork });
  } catch (error) {
    return next(error);
  }
}

export async function deleteArtwork(req, res, next) {
  try {
    await prisma.artwork.delete({ where: { id: req.params.id } });
    return res.json({ message: 'Artwork deleted.' });
  } catch (error) {
    return next(error);
  }
}

export async function uploadArtworkImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    return res.status(201).json({
      url: `/uploads/artworks/${req.file.filename}`,
    });
  } catch (error) {
    return next(error);
  }
}
