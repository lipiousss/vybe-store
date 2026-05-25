import { prisma } from '../config/prisma.js';
import { slugify } from '../utils/slugify.js';

const productInclude = {
  category: true,
  collection: true,
  images: {
    orderBy: { order: 'asc' },
  },
  variants: {
    orderBy: { sku: 'asc' },
  },
};

const productStatuses = ['ACTIVE', 'DRAFT', 'ARCHIVED', 'OUT_OF_STOCK'];
const discountTypes = ['NONE', 'PERCENT', 'FIXED'];

function parseBoolean(value) {
  if (value === undefined) {
    return undefined;
  }

  return value === true || value === 'true';
}

function normalizeNullableDecimal(value) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null || value === '') {
    return null;
  }

  return String(Number(value).toFixed(2));
}

function calculateFinalPrice(price, discountType = 'NONE', discountValue = 0) {
  const numericPrice = Number(price);
  const numericDiscount = Number(discountValue || 0);

  if (!Number.isFinite(numericPrice) || numericPrice < 0) {
    throw Object.assign(new Error('Product price is invalid.'), { statusCode: 400 });
  }

  let finalPrice = numericPrice;

  if (discountType === 'PERCENT') {
    finalPrice = numericPrice - (numericPrice * numericDiscount) / 100;
  }

  if (discountType === 'FIXED') {
    finalPrice = numericPrice - numericDiscount;
  }

  return Math.max(0, finalPrice).toFixed(2);
}

async function createUniqueSlug(name, currentId = null) {
  const baseSlug = slugify(name);
  let candidate = baseSlug || 'product';
  let suffix = 1;

  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug: candidate } });

    if (!existing || existing.id === currentId) {
      return candidate;
    }

    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

function mapImages(images = []) {
  return images.map((image, index) => {
    if (typeof image === 'string') {
      return {
        url: image,
        alt: null,
        order: index,
      };
    }

    return {
      url: image.url,
      alt: image.alt || null,
      order: image.order ?? index,
    };
  }).filter((image) => image.url);
}

function mapVariants(variants = []) {
  return variants.map((variant) => ({
    id: variant.id || undefined,
    size: variant.size || null,
    color: variant.color || null,
    sku: variant.sku,
    stock: Number(variant.stock || 0),
  })).filter((variant) => variant.sku);
}

function buildProductData(body, currentProduct = null) {
  const price = body.price === undefined ? currentProduct?.price : body.price;
  const discountType = body.discountType === undefined
    ? currentProduct?.discountType || 'NONE'
    : body.discountType;
  const discountValue = body.discountValue === undefined
    ? currentProduct?.discountValue || 0
    : body.discountValue || 0;

  if (!discountTypes.includes(discountType)) {
    throw Object.assign(new Error('Discount type is invalid.'), { statusCode: 400 });
  }

  if (body.status !== undefined && !productStatuses.includes(body.status)) {
    throw Object.assign(new Error('Product status is invalid.'), { statusCode: 400 });
  }

  return {
    description: body.description === undefined ? undefined : body.description || null,
    price: price === undefined ? undefined : String(Number(price).toFixed(2)),
    oldPrice: normalizeNullableDecimal(body.oldPrice),
    discountType,
    discountValue: String(Number(discountValue).toFixed(2)),
    finalPrice: calculateFinalPrice(price, discountType, discountValue),
    status: body.status,
    brand: body.brand === undefined ? undefined : body.brand || null,
    designer: body.designer === undefined ? undefined : body.designer || null,
    material: body.material === undefined ? undefined : body.material || null,
    color: body.color === undefined ? undefined : body.color || null,
    isNew: body.isNew,
    isLimited: body.isLimited,
    isFeatured: body.isFeatured,
    isCollectible: body.isCollectible,
    characteristics: body.characteristics === undefined ? undefined : body.characteristics || null,
    categoryId: body.categoryId,
    collectionId: body.collectionId === undefined ? undefined : body.collectionId || null,
  };
}

function buildProductWhere(query) {
  const {
    search,
    category,
    collection,
    minPrice,
    maxPrice,
    status,
  } = query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { brand: { contains: search, mode: 'insensitive' } },
      { designer: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (category) {
    where.category = {
      OR: [
        { id: category },
        { slug: category },
      ],
    };
  }

  if (collection) {
    where.collection = {
      OR: [
        { id: collection },
        { slug: collection },
      ],
    };
  }

  if (minPrice || maxPrice) {
    where.finalPrice = {};

    if (minPrice) {
      where.finalPrice.gte = String(Number(minPrice).toFixed(2));
    }

    if (maxPrice) {
      where.finalPrice.lte = String(Number(maxPrice).toFixed(2));
    }
  }

  for (const field of ['isNew', 'isLimited', 'isFeatured', 'isCollectible']) {
    const value = parseBoolean(query[field]);

    if (value !== undefined) {
      where[field] = value;
    }
  }

  if (status) {
    where.status = status;
  }

  return where;
}

async function normalizeProductRelations(data) {
  if (data.categoryId !== undefined) {
    const categoryIdentifier = String(data.categoryId || '').trim();
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { id: categoryIdentifier },
          { slug: categoryIdentifier },
          { name: categoryIdentifier },
        ],
      },
      select: { id: true },
    });

    if (!category) {
      throw Object.assign(new Error('Category not found. Use a real categoryId from GET /api/categories.'), {
        statusCode: 400,
      });
    }

    data.categoryId = category.id;
  }

  if (data.collectionId !== undefined && data.collectionId !== null) {
    const collectionIdentifier = String(data.collectionId || '').trim();

    if (!collectionIdentifier) {
      data.collectionId = null;
      return data;
    }

    const collection = await prisma.collection.findFirst({
      where: {
        OR: [
          { id: collectionIdentifier },
          { slug: collectionIdentifier },
          { name: collectionIdentifier },
        ],
      },
      select: { id: true },
    });

    if (!collection) {
      throw Object.assign(new Error('Collection not found. Use a real collectionId from GET /api/collections.'), {
        statusCode: 400,
      });
    }

    data.collectionId = collection.id;
  }

  return data;
}

export async function getProducts(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      where: buildProductWhere(req.query),
      include: productInclude,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ products });
  } catch (error) {
    return next(error);
  }
}

export async function getProductBySlug(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: productInclude,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ product });
  } catch (error) {
    return next(error);
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: productInclude,
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    return res.json({ product });
  } catch (error) {
    return next(error);
  }
}

export async function uploadProductImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required.' });
    }

    return res.status(201).json({
      url: `/uploads/products/${req.file.filename}`,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const { name, images, variants } = req.body;

    if (!name || req.body.price === undefined || !req.body.categoryId) {
      return res.status(400).json({ message: 'Product name, price, and categoryId are required.' });
    }

    const data = {
      name: name.trim(),
      slug: await createUniqueSlug(name),
      ...buildProductData(req.body),
    };

    await normalizeProductRelations(data);

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({ data });

      if (Array.isArray(images) && images.length > 0) {
        await tx.productImage.createMany({
          data: mapImages(images).map((image) => ({
            ...image,
            productId: created.id,
          })),
        });
      }

      if (Array.isArray(variants) && variants.length > 0) {
        const variantData = mapVariants(variants).map((variant) => ({
          ...variant,
          productId: created.id,
        }));

        await tx.productVariant.createMany({ data: variantData });

        const createdVariants = await tx.productVariant.findMany({
          where: { productId: created.id },
        });

        const initialMovements = createdVariants.map((variant) => ({
            productVariantId: variant.id,
            type: 'MANUAL',
            quantity: variant.stock,
            comment: 'Initial stock',
            createdById: req.user?.id || null,
          })).filter((movement) => movement.quantity !== 0);

        if (initialMovements.length > 0) {
          await tx.stockMovement.createMany({ data: initialMovements });
        }
      }

      return tx.product.findUnique({
        where: { id: created.id },
        include: productInclude,
      });
    });

    return res.status(201).json({ product });
  } catch (error) {
    return next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const current = await prisma.product.findUnique({
      where: { id: req.params.id },
    });

    if (!current) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const data = buildProductData(req.body, current);
    const currentVariants = await prisma.productVariant.findMany({
      where: { productId: current.id },
    });

    if (req.body.name !== undefined) {
      data.name = req.body.name.trim();
      data.slug = await createUniqueSlug(req.body.name, current.id);
    }

    await normalizeProductRelations(data);

    const product = await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: current.id },
        data,
      });

      if (Array.isArray(req.body.images)) {
        await tx.productImage.deleteMany({ where: { productId: current.id } });

        const imageData = mapImages(req.body.images).map((image) => ({
          ...image,
          productId: current.id,
        }));

        if (imageData.length > 0) {
          await tx.productImage.createMany({ data: imageData });
        }
      }

      if (Array.isArray(req.body.variants)) {
        await tx.productVariant.deleteMany({ where: { productId: current.id } });

        const variantData = mapVariants(req.body.variants).map((variant) => ({
          ...variant,
          productId: current.id,
        }));

        if (variantData.length > 0) {
          await tx.productVariant.createMany({ data: variantData });

          const nextVariants = await tx.productVariant.findMany({
            where: { productId: current.id },
          });

          const previousById = new Map(currentVariants.map((variant) => [variant.id, variant]));
          const previousBySku = new Map(currentVariants.map((variant) => [variant.sku, variant]));
          const stockMovements = [];

          for (const variant of nextVariants) {
            const previous = previousById.get(variant.id) || previousBySku.get(variant.sku);
            const previousStock = previous?.stock || 0;
            const difference = variant.stock - previousStock;

            if (difference !== 0) {
              stockMovements.push({
                productVariantId: variant.id,
                type: 'MANUAL',
                quantity: difference,
                comment: 'Product edit stock update',
                createdById: req.user?.id || null,
              });
            }
          }

          if (stockMovements.length > 0) {
            await tx.stockMovement.createMany({ data: stockMovements });
          }
        }
      }

      return tx.product.findUnique({
        where: { id: current.id },
        include: productInclude,
      });
    });

    return res.json({ product });
  } catch (error) {
    return next(error);
  }
}


export async function deleteProduct(req, res, next) {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    return res.json({ message: 'Product deleted.' });
  } catch (error) {
    return next(error);
  }
}
