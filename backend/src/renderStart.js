import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });

  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

run('npx', ['prisma', 'generate']);
run('npx', ['prisma', 'migrate', 'deploy']);

if (process.env.RUN_SEED_ON_START === 'true') {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    const productCount = await prisma.product.count();
    const shouldForceSeed = process.env.RUN_SEED_FORCE === 'true';

    if (productCount === 0 || shouldForceSeed) {
      run('node', ['prisma/seed.js']);
    } else {
      console.log(`Seed skipped: database already has ${productCount} products.`);
    }
  } finally {
    await prisma.$disconnect();
  }
} else if (process.env.RUN_SEED === 'true') {
  console.log('RUN_SEED is ignored on Render start. Use RUN_SEED_ON_START=true only for a deliberate one-time seed.');
}

await import('./app.js');
