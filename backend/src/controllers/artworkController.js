import { prisma } from '../config/prisma.js';

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
