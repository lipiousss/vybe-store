import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productPlaceholder = '/images/placeholders/product-placeholder.png';
const collectiblePlaceholder = '/images/placeholders/collectible-placeholder.png';
const artworkPlaceholder = '/images/placeholders/artwork-placeholder.png';

const parentCategories = [
  { name: 'Одежда', slug: 'clothing' },
  { name: 'Аксессуары', slug: 'accessories' },
  { name: 'Декор', slug: 'decor' },
  { name: 'Компьютерная периферия', slug: 'computer-peripherals' },
  { name: 'Коллекционные предметы', slug: 'collectibles' },
];

const childCategories = {
  clothing: [
    ['Головные уборы', 'headwear'],
    ['Куртки', 'jackets'],
    ['Зип-худи', 'zip-hoodies'],
    ['Кофты', 'sweaters'],
    ['Джинсы', 'jeans'],
    ['Штаны', 'pants'],
    ['Обувь', 'shoes'],
    ['Перчатки', 'gloves'],
    ['Сумки', 'bags'],
  ],
  accessories: [
    ['Подвески', 'pendants'],
    ['Браслеты', 'bracelets'],
    ['Серьги', 'earrings'],
  ],
  decor: [
    ['Постеры', 'posters'],
    ['Статуэтки', 'statues'],
    ['Манекены', 'mannequins'],
  ],
  'computer-peripherals': [
    ['Коврики для мыши', 'mouse-pads'],
    ['Стеклянные коврики', 'glass-mouse-pads'],
    ['Мышки', 'mice'],
    ['Клавиатуры', 'keyboards'],
    ['Кейкапы', 'keycaps'],
  ],
  collectibles: [
    ['Sticker Packs', 'sticker-packs'],
    ['Art Books', 'art-books'],
    ['Figures', 'figures'],
    ['Cards', 'cards'],
    ['Patches', 'patches'],
    ['Limited Boxes', 'limited-boxes'],
  ],
};

const collections = [
  ['Night Collection', 'night-collection'],
  ['Ash Relics', 'ash-relics'],
  ['Blue Eclipse', 'blue-eclipse'],
  ['Ancient Gold Drop', 'ancient-gold-drop'],
];

const collectionSlugs = collections.map(([, slug]) => slug);

const productGroups = [
  {
    categorySlug: 'headwear',
    material: 'Wool blend',
    color: 'Black',
    variants: ['S', 'M', 'L'],
    products: [
      ['Nocturne Hood', '79.00', null, 'NONE', '0', ['isNew', 'isFeatured']],
      ['Ash Veil Beanie', '49.00', '59.00', 'PERCENT', '10', ['isLimited']],
    ],
  },
  {
    categorySlug: 'jackets',
    material: 'Waxed cotton',
    color: 'Ash black',
    variants: ['S', 'M', 'L'],
    products: [
      ['Ashborn Jacket', '249.00', null, 'NONE', '0', ['isFeatured']],
      ['Obsidian Rider Coat', '299.00', '349.00', 'FIXED', '40', ['isNew', 'isLimited']],
    ],
  },
  {
    categorySlug: 'zip-hoodies',
    material: 'Heavy cotton fleece',
    color: 'Blue black',
    variants: ['S', 'M', 'L'],
    products: [
      ['Blue Eclipse Zip Hoodie', '139.00', null, 'NONE', '0', ['isNew', 'isFeatured']],
      ['Night Sigil Zip Hoodie', '129.00', '149.00', 'PERCENT', '15', ['isLimited']],
    ],
  },
  {
    categorySlug: 'sweaters',
    material: 'Knit cotton',
    color: 'Charcoal',
    variants: ['S', 'M', 'L'],
    products: [
      ['Ritual Knit Sweater', '119.00', null, 'NONE', '0', ['isFeatured']],
      ['Moonless Pullover', '109.00', '129.00', 'FIXED', '20', ['isNew']],
    ],
  },
  {
    categorySlug: 'jeans',
    material: 'Denim',
    color: 'Washed black',
    variants: ['S', 'M', 'L'],
    products: [
      ['Relic Denim', '129.00', null, 'NONE', '0', ['isFeatured']],
      ['Gravewash Jeans', '139.00', '159.00', 'PERCENT', '10', ['isLimited']],
    ],
  },
  {
    categorySlug: 'pants',
    material: 'Ripstop cotton',
    color: 'Black',
    variants: ['S', 'M', 'L'],
    products: [
      ['Nocturne Cargo Pants', '134.00', null, 'NONE', '0', ['isNew']],
      ['Ash Trail Trousers', '124.00', '144.00', 'FIXED', '15', ['isFeatured']],
    ],
  },
  {
    categorySlug: 'shoes',
    material: 'Leather',
    color: 'Black',
    variants: ['40', '41', '42', '43'],
    products: [
      ['Nightwalker Boots', '219.00', null, 'NONE', '0', ['isFeatured', 'isLimited']],
      ['Black Altar Sneakers', '179.00', '199.00', 'PERCENT', '10', ['isNew']],
    ],
  },
  {
    categorySlug: 'gloves',
    material: 'Synthetic leather',
    color: 'Black',
    variants: ['S', 'M', 'L'],
    products: [
      ['Eclipse Gloves', '64.00', null, 'NONE', '0', ['isFeatured']],
      ['Ash Ritual Gloves', '59.00', '69.00', 'FIXED', '8', ['isLimited']],
    ],
  },
  {
    categorySlug: 'bags',
    material: 'Canvas',
    color: 'Black',
    variants: ['One Size'],
    products: [
      ['Rune Carrier Bag', '98.00', null, 'NONE', '0', ['isFeatured']],
      ['Cathedral Sling Bag', '89.00', '109.00', 'PERCENT', '15', ['isNew']],
    ],
  },
  {
    categorySlug: 'pendants',
    material: 'Stainless steel',
    color: 'Ancient silver',
    variants: ['One Size'],
    products: [
      ['Ancient Chain Pendant', '54.00', null, 'NONE', '0', ['isFeatured']],
      ['Moon Shard Pendant', '58.00', '68.00', 'FIXED', '10', ['isNew']],
    ],
  },
  {
    categorySlug: 'bracelets',
    material: 'Steel and cord',
    color: 'Black / Gold',
    variants: ['One Size'],
    products: [
      ['Iron Oath Bracelet', '49.00', null, 'NONE', '0', ['isLimited']],
      ['Ash Relic Cuff', '52.00', '62.00', 'PERCENT', '10', ['isFeatured']],
    ],
  },
  {
    categorySlug: 'earrings',
    material: 'Steel',
    color: 'Silver',
    variants: ['One Size'],
    products: [
      ['Night Bell Earrings', '42.00', null, 'NONE', '0', ['isNew']],
      ['Blue Eclipse Ear Cuffs', '46.00', '56.00', 'FIXED', '8', ['isFeatured']],
    ],
  },
  {
    categorySlug: 'posters',
    material: 'Matte paper',
    color: 'Black / Blue',
    variants: ['A3', 'A2'],
    products: [
      ['Silent Cathedral Poster', '29.00', null, 'NONE', '0', ['isFeatured']],
      ['Ash Gate Poster', '32.00', '39.00', 'PERCENT', '10', ['isNew']],
    ],
  },
  {
    categorySlug: 'statues',
    material: 'Resin',
    color: 'Obsidian',
    variants: ['One Size'],
    products: [
      ['Ancient Idol Statue', '129.00', null, 'NONE', '0', ['isLimited']],
      ['Moonlit Gargoyle Statue', '119.00', '149.00', 'FIXED', '20', ['isFeatured']],
    ],
  },
  {
    categorySlug: 'mannequins',
    material: 'Resin composite',
    color: 'Ash white',
    variants: ['One Size'],
    products: [
      ['Ritual Display Mannequin', '199.00', null, 'NONE', '0', ['isFeatured']],
      ['Black Veil Bust', '159.00', '189.00', 'PERCENT', '10', ['isLimited']],
    ],
  },
  {
    categorySlug: 'mouse-pads',
    material: 'Cloth rubber',
    color: 'Blue black',
    variants: ['Standard', 'Pro'],
    products: [
      ['Moonlit Desk Mat', '39.00', null, 'NONE', '0', ['isNew', 'isFeatured']],
      ['Eclipse Mouse Pad', '34.00', '44.00', 'FIXED', '5', ['isLimited']],
    ],
  },
  {
    categorySlug: 'glass-mouse-pads',
    material: 'Tempered glass',
    color: 'Black glass',
    variants: ['Standard', 'Pro'],
    products: [
      ['Glass Moon Desk Slab', '89.00', null, 'NONE', '0', ['isFeatured']],
      ['Obsidian Glass Mat', '99.00', '119.00', 'PERCENT', '10', ['isNew']],
    ],
  },
  {
    categorySlug: 'mice',
    material: 'ABS plastic',
    color: 'Black',
    variants: ['Standard', 'Pro'],
    products: [
      ['Nightcrawler Mouse', '79.00', null, 'NONE', '0', ['isFeatured']],
      ['Blue Eclipse Mouse', '89.00', '109.00', 'FIXED', '15', ['isLimited']],
    ],
  },
  {
    categorySlug: 'keyboards',
    material: 'Aluminum',
    color: 'Black',
    variants: ['Standard', 'Pro'],
    products: [
      ['Cathedral Keyboard', '159.00', null, 'NONE', '0', ['isFeatured']],
      ['Ash Relic Keyboard', '179.00', '209.00', 'PERCENT', '10', ['isNew']],
    ],
  },
  {
    categorySlug: 'keycaps',
    material: 'PBT plastic',
    color: 'Black / Gold',
    variants: ['Standard', 'Pro'],
    products: [
      ['Ancient Rune Keycaps', '69.00', null, 'NONE', '0', ['isLimited']],
      ['Blue Eclipse Keycap Set', '74.00', '84.00', 'FIXED', '8', ['isFeatured']],
    ],
  },
  {
    categorySlug: 'sticker-packs',
    material: 'Vinyl',
    color: 'Mixed',
    variants: ['Standard', 'Limited'],
    isCollectible: true,
    products: [
      ['Ritual Sticker Pack', '19.00', null, 'NONE', '0', ['isNew']],
      ['Ash Relic Sticker Pack', '22.00', '29.00', 'PERCENT', '10', ['isLimited']],
    ],
  },
  {
    categorySlug: 'art-books',
    material: 'Printed book',
    color: 'Black',
    variants: ['Standard', 'Limited'],
    isCollectible: true,
    products: [
      ['Night Archive Art Book', '59.00', null, 'NONE', '0', ['isFeatured']],
      ['Blue Eclipse Codex', '69.00', '79.00', 'FIXED', '10', ['isLimited']],
    ],
  },
  {
    categorySlug: 'figures',
    material: 'Resin',
    color: 'Painted',
    variants: ['Standard', 'Limited'],
    isCollectible: true,
    products: [
      ['Archive Figure', '89.00', null, 'NONE', '0', ['isFeatured']],
      ['Blue Eclipse Figure', '99.00', '119.00', 'PERCENT', '10', ['isLimited']],
    ],
  },
  {
    categorySlug: 'cards',
    material: 'Cardstock',
    color: 'Mixed',
    variants: ['Standard', 'Limited'],
    isCollectible: true,
    products: [
      ['Ancient Gold Card Set', '29.00', null, 'NONE', '0', ['isNew']],
      ['Night Oracle Cards', '34.00', '44.00', 'FIXED', '5', ['isLimited']],
    ],
  },
  {
    categorySlug: 'patches',
    material: 'Embroidered fabric',
    color: 'Black / Gold',
    variants: ['Standard', 'Limited'],
    isCollectible: true,
    products: [
      ['Obsidian Patch Set', '24.00', null, 'NONE', '0', ['isFeatured']],
      ['Ash Sigil Patches', '27.00', '34.00', 'PERCENT', '10', ['isLimited']],
    ],
  },
  {
    categorySlug: 'limited-boxes',
    material: 'Mixed media',
    color: 'Black / Gold',
    variants: ['Standard', 'Limited'],
    isCollectible: true,
    products: [
      ['Limited Relic Box', '149.00', null, 'NONE', '0', ['isFeatured', 'isLimited']],
      ['Ancient Gold Mystery Box', '169.00', '199.00', 'FIXED', '20', ['isNew', 'isLimited']],
    ],
  },
];

const artworks = [
  ['Gate of Ash', 'gate-of-ash', 'Environment'],
  ['Blue Eclipse Saint', 'blue-eclipse-saint', 'Character'],
  ['Obsidian Market', 'obsidian-market', 'Environment'],
  ['Ancient Gold Idol', 'ancient-gold-idol', 'Relic'],
  ['Night Courier', 'night-courier', 'Character'],
  ['Relic Workshop', 'relic-workshop', 'Environment'],
  ['Glass Moon Ritual', 'glass-moon-ritual', 'Concept'],
  ['Silent Cathedral', 'silent-cathedral', 'Environment'],
];

const siteAssets = [
  ['enter_screen_image', 'Enter screen image', productPlaceholder],
  ['home_hero_image', 'Home hero image', productPlaceholder],
  ['about_main_image', 'About main image', productPlaceholder],
  ['collectibles_hero_image', 'Collectibles hero image', collectiblePlaceholder],
];

function toMoney(value) {
  return Number(value).toFixed(2);
}

function calculateFinalPrice(price, discountType, discountValue) {
  const numericPrice = Number(price);
  const numericDiscount = Number(discountValue || 0);

  if (discountType === 'PERCENT') {
    return toMoney(numericPrice - (numericPrice * numericDiscount) / 100);
  }

  if (discountType === 'FIXED') {
    return toMoney(numericPrice - numericDiscount);
  }

  return toMoney(numericPrice);
}

function slugFromName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function skuPrefixFromName(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 28);
}

function buildStock(productIndex, variantIndex, isLimited) {
  if (productIndex % 13 === 0 && variantIndex === 1) {
    return 0;
  }

  if (isLimited || productIndex % 5 === 0) {
    return variantIndex === 0 ? 5 : 2;
  }

  return variantIndex === 0 ? 24 : 12;
}

function buildProducts() {
  const products = [];
  let index = 0;

  for (const group of productGroups) {
    for (const [name, price, oldPrice, discountType, discountValue, flags] of group.products) {
      const isCollectible = group.isCollectible === true;
      const collectionSlug = collectionSlugs[index % collectionSlugs.length];
      const isLimited = flags.includes('isLimited');
      const skuPrefix = skuPrefixFromName(name);

      products.push({
        name,
        slug: slugFromName(name),
        description: `${name}: VYBE dark fantasy seed product.`,
        price: toMoney(price),
        oldPrice: oldPrice ? toMoney(oldPrice) : null,
        discountType,
        discountValue: toMoney(discountValue),
        finalPrice: calculateFinalPrice(price, discountType, discountValue),
        status: 'ACTIVE',
        brand: 'VYBE',
        designer: 'VYBE Studio',
        material: group.material,
        color: group.color,
        isNew: flags.includes('isNew'),
        isLimited,
        isFeatured: flags.includes('isFeatured'),
        isCollectible,
        characteristics: {
          style: 'dark fantasy',
          category: group.categorySlug,
          seedVersion: 2,
        },
        categorySlug: group.categorySlug,
        collectionSlug,
        imageUrl: isCollectible ? collectiblePlaceholder : productPlaceholder,
        variants: group.variants.map((size, variantIndex) => ({
          size,
          color: group.color,
          sku: `${skuPrefix}-${variantIndex + 1}`,
          stock: buildStock(index, variantIndex, isLimited),
        })),
      });

      index += 1;
    }
  }

  return products;
}

async function seedUsers() {
  const [adminPassword, userPassword] = await Promise.all([
    bcrypt.hash('Admin1234', 10),
    bcrypt.hash('User1234', 10),
  ]);

  await prisma.user.upsert({
    where: { email: 'admin@vybe.com' },
    update: {
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
      isBlocked: false,
    },
    create: {
      email: 'admin@vybe.com',
      username: 'admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  await prisma.user.upsert({
    where: { email: 'user@vybe.com' },
    update: {
      username: 'user',
      password: userPassword,
      role: 'USER',
      isBlocked: false,
    },
    create: {
      email: 'user@vybe.com',
      username: 'user',
      password: userPassword,
      role: 'USER',
    },
  });
}

async function seedCategories() {
  const createdParents = new Map();

  for (const category of parentCategories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: `${category.name} в стилистике dark fantasy.`,
        parentId: null,
      },
      create: {
        ...category,
        description: `${category.name} в стилистике dark fantasy.`,
      },
    });

    createdParents.set(category.slug, created);
  }

  for (const [parentSlug, children] of Object.entries(childCategories)) {
    const parent = createdParents.get(parentSlug);

    for (const [name, slug] of children) {
      await prisma.category.upsert({
        where: { slug },
        update: {
          name,
          parentId: parent.id,
          description: `${name}: базовая категория VYBE Store.`,
        },
        create: {
          name,
          slug,
          parentId: parent.id,
          description: `${name}: базовая категория VYBE Store.`,
        },
      });
    }
  }
}

async function seedCollections() {
  for (const [name, slug] of collections) {
    await prisma.collection.upsert({
      where: { slug },
      update: {
        name,
        description: `${name}: стартовая коллекция VYBE Store.`,
        isActive: true,
      },
      create: {
        name,
        slug,
        description: `${name}: стартовая коллекция VYBE Store.`,
        isActive: true,
      },
    });
  }
}

async function clearProductData() {
  await prisma.stockMovement.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
}

async function seedProducts() {
  await clearProductData();

  const products = buildProducts();

  for (const productData of products) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: productData.categorySlug },
    });
    const collection = await prisma.collection.findUniqueOrThrow({
      where: { slug: productData.collectionSlug },
    });

    await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        oldPrice: productData.oldPrice,
        discountType: productData.discountType,
        discountValue: productData.discountValue,
        finalPrice: productData.finalPrice,
        status: productData.status,
        brand: productData.brand,
        designer: productData.designer,
        material: productData.material,
        color: productData.color,
        isNew: productData.isNew,
        isLimited: productData.isLimited,
        isFeatured: productData.isFeatured,
        isCollectible: productData.isCollectible,
        characteristics: productData.characteristics,
        categoryId: category.id,
        collectionId: collection.id,
        images: {
          create: {
            url: productData.imageUrl,
            alt: productData.name,
            order: 0,
          },
        },
        variants: {
          create: productData.variants,
        },
      },
    });
  }
}

async function seedArtworks() {
  for (const [index, [title, slug, category]] of artworks.entries()) {
    await prisma.artwork.upsert({
      where: { slug },
      update: {
        title,
        description: `${title}: стартовая работа визуального архива.`,
        image: artworkPlaceholder,
        category,
        tags: ['dark-fantasy', 'vybe'],
        order: index,
        isActive: true,
      },
      create: {
        title,
        slug,
        description: `${title}: стартовая работа визуального архива.`,
        image: artworkPlaceholder,
        category,
        tags: ['dark-fantasy', 'vybe'],
        order: index,
        isActive: true,
      },
    });
  }
}

async function seedSiteAssets() {
  for (const [key, title, url] of siteAssets) {
    await prisma.siteAsset.upsert({
      where: { key },
      update: {
        title,
        url,
        description: `${title} placeholder.`,
      },
      create: {
        key,
        title,
        url,
        description: `${title} placeholder.`,
      },
    });
  }
}

async function main() {
  await seedUsers();
  await seedCategories();
  await seedCollections();
  await seedProducts();
  await seedArtworks();
  await seedSiteAssets();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
