import { prisma } from '../config/prisma.js';

export async function getSiteAssets(req, res, next) {
  try {
    const assets = await prisma.siteAsset.findMany({
      orderBy: { key: 'asc' },
    });

    return res.json({ assets });
  } catch (error) {
    return next(error);
  }
}

export async function getSiteAssetByKey(req, res, next) {
  try {
    const asset = await prisma.siteAsset.findUnique({
      where: { key: req.params.key },
    });

    if (!asset) {
      return res.status(404).json({ message: 'Site asset not found.' });
    }

    return res.json({ asset });
  } catch (error) {
    return next(error);
  }
}

export async function updateSiteAsset(req, res, next) {
  try {
    const asset = await prisma.siteAsset.upsert({
      where: { key: req.params.key },
      update: {
        title: req.body.title,
        url: req.body.url,
        description: req.body.description,
      },
      create: {
        key: req.params.key,
        title: req.body.title || req.params.key,
        url: req.body.url,
        description: req.body.description || null,
      },
    });

    return res.json({ asset });
  } catch (error) {
    return next(error);
  }
}

export async function uploadSiteAssetImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    return res.status(201).json({
      url: `/uploads/site/${req.file.filename}`,
    });
  } catch (error) {
    return next(error);
  }
}
