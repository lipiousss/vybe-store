import * as XLSX from 'xlsx';
import { prisma } from '../config/prisma.js';

const stockInclude = {
  category: true,
  collection: true,
  images: {
    orderBy: { order: 'asc' },
  },
  variants: {
    orderBy: { sku: 'asc' },
  },
};

export async function getStock(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      include: stockInclude,
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ stockItems: products });
  } catch (error) {
    return next(error);
  }
}

export async function updateVariantStock(req, res, next) {
  try {
    const stock = Number(req.body.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      return res.status(400).json({ message: 'Stock must be a non-negative integer.' });
    }

    const current = await prisma.productVariant.findUnique({
      where: { id: req.params.variantId },
    });

    if (!current) {
      return res.status(404).json({ message: 'Variant not found.' });
    }

    const difference = stock - current.stock;

    const variant = await prisma.$transaction(async (tx) => {
      const updated = await tx.productVariant.update({
        where: { id: current.id },
        data: { stock },
      });

      if (difference !== 0) {
        await tx.stockMovement.create({
          data: {
            productVariantId: current.id,
            type: 'MANUAL',
            quantity: difference,
            comment: req.body.comment || null,
            createdById: req.user.id,
          },
        });
      }

      return updated;
    });

    return res.json({ variant });
  } catch (error) {
    return next(error);
  }
}

export async function exportStock(req, res, next) {
  try {
    const products = await prisma.product.findMany({
      include: stockInclude,
      orderBy: { createdAt: 'desc' },
    });

    const rows = products.flatMap((product) => product.variants.map((variant) => ({
      Product: product.name,
      Category: product.category?.name || '',
      Collection: product.collection?.name || '',
      'Variant Size': variant.size || '',
      'Variant Color': variant.color || '',
      SKU: variant.sku,
      Stock: variant.stock,
      Status: product.status,
      Price: Number(product.price || 0),
      'Final Price': Number(product.finalPrice || product.price || 0),
    })));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="vybe-stock.xlsx"');
    return res.send(buffer);
  } catch (error) {
    return next(error);
  }
}
