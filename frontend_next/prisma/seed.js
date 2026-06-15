const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Categories
  const categoriesData = [
    { name: 'Medicines' },
    { name: 'Wellness' },
    { name: 'Personal Care' },
    { name: 'Healthcare Devices' },
    { name: 'Vitamins' },
    { name: 'Ayurveda' },
    { name: 'Diabetes Care' },
    { name: 'Skin Care' },
    { name: 'Pain Management' },
    { name: 'Immune Support' }
  ];

  for (const cat of categoriesData) {
    await prisma.category.create({
      data: cat
    });
  }

  // Fetch Categories to link products
  const categories = await prisma.category.findMany();
  const getCatId = (name) => categories.find(c => c.name === name)?.id;

  // Products
  const productsData = [
    { name: 'Premium Vitamin C 1000mg', manufacturer: 'GSK Pharma', mrp: 499, sellingPrice: 299, discountPercent: 40, rating: 4.8, reviewCount: 234, imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300', prescriptionRequired: false, inStock: true, packSize: 'Bottle of 60 tablets', categoryId: getCatId('Vitamins') },
    { name: 'Advanced Pain Relief Tablet', manufacturer: 'Micro Labs Ltd', mrp: 75, sellingPrice: 45, discountPercent: 40, rating: 4.6, reviewCount: 189, imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300', prescriptionRequired: false, inStock: true, packSize: 'Strip of 15 tablets', categoryId: getCatId('Pain Management') },
    { name: 'Herbal Sleep Wellness', manufacturer: 'Himalaya Wellness', mrp: 599, sellingPrice: 399, discountPercent: 33, rating: 4.9, reviewCount: 342, imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300', prescriptionRequired: false, inStock: true, packSize: 'Bottle of 60 tablets', categoryId: getCatId('Wellness') },
    { name: 'Immune Booster Supplement', manufacturer: 'Abbott Healthcare', mrp: 899, sellingPrice: 599, discountPercent: 33, rating: 4.7, reviewCount: 256, imageUrl: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300', prescriptionRequired: false, inStock: true, packSize: 'Bottle of 30 tablets', categoryId: getCatId('Immune Support') },
    { name: 'Skin Care Derma Cream', manufacturer: 'Neutrogena', mrp: 549, sellingPrice: 349, discountPercent: 36, rating: 4.5, reviewCount: 178, imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300', prescriptionRequired: false, inStock: true, packSize: '50ml Tube', categoryId: getCatId('Skin Care') },
    { name: 'Multivitamin Daily Tablet', manufacturer: 'Pfizer Ltd', mrp: 449, sellingPrice: 249, discountPercent: 44, rating: 4.8, reviewCount: 412, imageUrl: 'https://images.unsplash.com/photo-1559757175-7cb057fba93c?w=300', prescriptionRequired: false, inStock: true, packSize: 'Strip of 30 tablets', categoryId: getCatId('Vitamins') },
    { name: 'Dolo 650mg Tablet', manufacturer: 'Micro Labs', mrp: 30, sellingPrice: 25.50, discountPercent: 15, rating: 4.5, reviewCount: 1250, imageUrl: '/images/pain_relief.png', prescriptionRequired: false, inStock: true, packSize: 'Strip of 15', categoryId: getCatId('Medicines') },
    { name: 'Crocin Advance 500mg', manufacturer: 'GSK Pharma', mrp: 25, sellingPrice: 21.25, discountPercent: 15, rating: 4.3, reviewCount: 890, imageUrl: '/images/vitamin_c.png', prescriptionRequired: false, inStock: true, packSize: 'Strip of 15', categoryId: getCatId('Medicines') },
    { name: 'Volini Spray 100ml', manufacturer: 'Sun Pharma', mrp: 225, sellingPrice: 191.25, discountPercent: 15, rating: 4.1, reviewCount: 750, imageUrl: '/images/sleep_wellness.png', prescriptionRequired: false, inStock: true, packSize: '100ml', categoryId: getCatId('Pain Management') },
    { name: 'Accu-Chek Glucometer', manufacturer: 'Roche', mrp: 1299, sellingPrice: 999, discountPercent: 23, rating: 4.5, reviewCount: 430, imageUrl: '/images/multivitamin.png', prescriptionRequired: false, inStock: true, packSize: '1 Kit', categoryId: getCatId('Healthcare Devices') }
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: product
    });
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
