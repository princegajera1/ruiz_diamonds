import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new sqlite3.Database(join(__dirname, 'data', 'database.sqlite'));

const categories = ['Diamond', 'Gold', 'Ring', 'Earrings', 'Necklace'];
const metals = ['18KT Gold', '22KT Yellow Gold', 'Platinum', '18KT White Gold', '14KT Gold'];

const baseImages = [
  '/src/assets/Diamond Jewelry1.jpg',
  '/src/assets/Diamond Jewelry2.jpg',
  '/src/assets/Diamond Jewelry3.jpg',
  '/src/assets/Diamond Jewelry4.jpg',
  '/src/assets/Diamond Jewelry5.jpg',
  '/src/assets/Gold Necklaces1.jpg',
  '/src/assets/Gold Necklaces2.jpg',
  '/src/assets/Gold Necklaces3.jpg',
  '/src/assets/Gold Necklaces4.jpg',
  '/src/assets/Gold Necklaces5.jpg',
  '/src/assets/Rings1.jpg',
  '/src/assets/Rings2.jpg',
  '/src/assets/Rings3.jpg',
  '/src/assets/Rings4.jpg',
  '/src/assets/Rings5.jpg',
  '/src/assets/Earrings1.jpg',
  '/src/assets/Earrings2.jpg',
  '/src/assets/Earrings3.jpg',
  '/src/assets/Earrings4.jpg',
  '/src/assets/Earrings5.jpg'
];

db.serialize(() => {
  // Clear existing products to prevent duplicates during seed expansion
  db.run('DELETE FROM products');
  
  console.log('Generating 65 professional product records...');

  for (let i = 1; i <= 65; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const metal = metals[Math.floor(Math.random() * metals.length)];
    const basePrice = Math.floor(Math.random() * 450000) + 15000;
    const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(basePrice);
    
    const name = `${category} ${['Elegance', 'Royal', 'Classic', 'Modern', 'Vintage', 'Divine'][Math.floor(Math.random() * 6)]} Series #${100 + i}`;
    const description = `A premium ${metal} ${category.toLowerCase()} piece from our exclusive collection. Hand-crafted with precision and featuring state-of-the-art design aesthetics.`;
    
    // Pick 3 unique random images from the base collection
    const shuffled = [...baseImages].sort(() => 0.5 - Math.random());
    const image = shuffled[0];
    const image2 = shuffled[1];
    const image3 = shuffled[2];

    db.run('INSERT INTO products (name, price, category, metal, description, image, image2, image3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, price, category, metal, description, image, image2, image3]);
  }

  console.log('SUCCESS: Database expanded to 65 high-quality products.');
});

db.close();
