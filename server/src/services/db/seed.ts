import { prisma } from './prisma';
import { Role } from '@prisma/client';
// Category seed
const args = process.argv.slice(2);
const seedAll = args.length === 0;

if (args.includes('categories') || seedAll) {
  const categorySeed = [
    {
      name: 'Electronics',
      children: [
        { name: 'Laptops' },
        { name: 'Smartphones' },
        { name: 'Cameras' },
      ],
    },
    {
      name: 'Fashion',
      children: [
        { name: 'Men Clothing' },
        { name: 'Women Clothing' },
        { name: 'Accessories' },
      ],
    },
    {
      name: 'Home & Kitchen',
      children: [
        { name: 'Furniture' },
        { name: 'Cookware' },
        { name: 'Decor' },
      ],
    },
    {
      name: 'Sports & Outdoors',
      children: [{ name: 'Fitness Equipment' }, { name: 'Camping Gear' }],
    },
    {
      name: 'Books',
      children: [
        { name: 'Fiction' },
        { name: 'Non-fiction' },
        { name: 'Comics' },
      ],
    },
  ];
  console.log('Seeding categories');
  try {
    categorySeed.map(async (c) => {
      const keyParent = 'parent-' + c.name;
      const child = c.children;
      await prisma.categories.create({
        data: { id: keyParent, name: c.name, parentId: null },
      });
      child.map(async (c) => {
        const keyChild = 'child-' + c.name;
        await prisma.categories.create({
          data: { id: keyChild, name: c.name, parentId: keyParent },
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
  console.log('finnish categories seed');
}
// User seeding

if (args.includes('user') || seedAll) {
  const users = [
    {
      id: 'admin-1',
      email: 'admin@example.com',
      fullname: 'Administrator',
      password: 'hashed_password',
      role: Role.ADMIN,
      ratingPos: 20,
      ratingNeg: 0,
    },
    {
      id: 'bidder-1',
      email: 'bidder1@example.com',
      fullname: 'Bidder One',
      password: 'hashed_password',
      role: Role.BIDDER,
      ratingPos: 5,
      ratingNeg: 0,
    },
    {
      id: 'bidder-2',
      email: 'bidder2@example.com',
      fullname: 'Bidder Two',
      password: 'hashed_password',
      role: Role.BIDDER,
      ratingPos: 3,
      ratingNeg: 1,
    },
    {
      id: 'bidder-3',
      email: 'bidder3@example.com',
      fullname: 'Bidder Three',
      password: 'hashed_password',
      role: Role.BIDDER,
      ratingPos: 7,
      ratingNeg: 0,
    },
    {
      id: 'bidder-4',
      email: 'bidder4@example.com',
      fullname: 'Bidder Four',
      password: 'hashed_password',
      role: Role.BIDDER,
      ratingPos: 1,
      ratingNeg: 0,
    },
    {
      id: 'bidder-5',
      email: 'bidder5@example.com',
      fullname: 'Bidder Five',
      password: 'hashed_password',
      role: Role.BIDDER,
      ratingPos: 4,
      ratingNeg: 0,
    },
  ];
  console.log('Seeding user');
  try {
    users.map(async (u) => {
      await prisma.user.create({
        data: {
          id: u.id,
          fullname: u.fullname,
          email: u.email,
          password: u.password,
          role: u.role,
          ratingPos: u.ratingPos,
          ratingNeg: u.ratingNeg,
        },
      });
    });
  } catch (err) {
    console.log(err);
  }
  console.log('Finnish seeding user');
}
