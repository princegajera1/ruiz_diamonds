import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const dataDir = join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const db = new sqlite3.Database(join(dataDir, 'database.sqlite'), (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    db.serialize(() => {
      // Step 1: Create products table
      db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price TEXT NOT NULL,
        category TEXT NOT NULL,
        metal TEXT,
        description TEXT,
        image TEXT
      )`);

      // Step 2: Migrate columns (runs in serialize queue — guaranteed after CREATE TABLE)
      db.serialize(() => {
        db.run(`ALTER TABLE products ADD COLUMN image2 TEXT`, (err) => { if (err) console.log("image2 col exists"); });
        db.run(`ALTER TABLE products ADD COLUMN image3 TEXT`, (err) => { if (err) console.log("image3 col exists"); });
        db.run(`ALTER TABLE products ADD COLUMN discount TEXT`, (err) => { if (err) console.log("discount col exists"); });
      });

      // Users Table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'user'
      )`, () => {
        db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, 
          ['Admin', 'princegajera944@gmail.com', 'admin', 'admin']);
        db.run(`INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, 
          ['Admin', 'princgajera944@gmail.com', 'admin', 'admin']);
      });

      // Orders Table
      db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customerName TEXT NOT NULL,
        customerEmail TEXT NOT NULL,
        date TEXT NOT NULL,
        total TEXT NOT NULL,
        status TEXT DEFAULT 'Pending'
      )`, () => {
        db.run(`ALTER TABLE orders ADD COLUMN items TEXT`, (err) => {
          if (err && !err.message.includes('duplicate column name')) {
            console.error("Error adding items column:", err.message);
          }
        });
      });

      db.run(`CREATE TABLE IF NOT EXISTS stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitors INTEGER DEFAULT 0,
        sales INTEGER DEFAULT 0,
        revenue TEXT DEFAULT '₹0'
      )`);

      // Step 3: Seed products AFTER migrations (serialize guarantees order)
      db.get('SELECT count(*) as count FROM products', (err, row) => {
        if (row && row.count < 10) {
          console.log('Seeding database with 40 professional products (10 per category)...');
          db.run('DELETE FROM products');
          
          const categoryAssets = {
            'Diamond': [
              '/src/assets/diamond_necklace_regal.png', '/src/assets/diamond_bracelet_tennis.png',
              '/src/assets/diamond_ring_princess_cut_solitaire.png', '/src/assets/diamond_pendant_teardrop.png',
              '/src/assets/Diamond Jewelry1.jpg', '/src/assets/Diamond Jewelry2.jpg',
              '/src/assets/Diamond Jewelry3.jpg', '/src/assets/Diamond Jewelry4.jpg',
              '/src/assets/Diamond Jewelry5.jpg'
            ],
            'Gold': [
              '/src/assets/gold_bangles_temple.png', '/src/assets/gold_necklace_choker.png',
              '/src/assets/gold_ring_band_matte.png', '/src/assets/gold_chain_rope_thick_luxury_finish.png',
              '/src/assets/Gold Necklaces1.jpg', '/src/assets/Gold Necklaces2.jpg',
              '/src/assets/Gold Necklaces3.jpg', '/src/assets/Gold Necklaces4.jpg',
              '/src/assets/Gold Necklaces5.jpg'
            ],
            'Ring': [
              '/src/assets/ring_gold_plain.png', '/src/assets/ring_ruby_gold.png',
              '/src/assets/ring_black_onyx.png', '/src/assets/ring_diamond_solitaire.png',
              '/src/assets/ring_turquoise_silver.png', '/src/assets/ring_sapphire_platinum.png',
              '/src/assets/Rings1.jpg', '/src/assets/Rings2.jpg',
              '/src/assets/Rings3.jpg', '/src/assets/Rings4.jpg',
              '/src/assets/Rings5.jpg'
            ],
            'Earrings': [
              '/src/assets/earrings_gold_jhumka.png', '/src/assets/earrings_diamond_studs.png',
              '/src/assets/earrings_modern_hoops.png', '/src/assets/Earrings1.jpg',
              '/src/assets/Earrings2.jpg', '/src/assets/Earrings3.jpg',
              '/src/assets/Earrings4.jpg', '/src/assets/Earrings5.jpg'
            ]
          };

          const metals = ['18KT Gold', '22KT Yellow Gold', 'Platinum', '18KT White Gold', '14KT Gold'];
          const categories = ['Diamond', 'Gold', 'Ring', 'Earrings'];

          let insertedCount = 0;
          categories.forEach(cat => {
            const assets = categoryAssets[cat];
            for (let i = 1; i <= 10; i++) {
              const metal = metals[Math.floor(Math.random() * metals.length)];
              const basePrice = Math.floor(Math.random() * 450000) + 25000;
              const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(basePrice);
              const name = `${cat} ${['Elegance', 'Royal', 'Classic', 'Modern', 'Vintage', 'Divine', 'Majestic', 'Eternal', 'Celestial', 'Imperial'][i-1]} #${100 + i}`;
              const description = `A premium ${metal} ${cat.toLowerCase()} piece from our exclusive collection. Hand-crafted with precision for unmatched luxury.`;
              const shuffled = [...assets].sort(() => 0.5 - Math.random());

              db.run('INSERT INTO products (name, price, category, metal, description, image, image2, image3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [name, price, cat, metal, description, shuffled[0], shuffled[1], shuffled[2]], (err) => {
                  if (err) {
                    console.error(`Error inserting ${name}:`, err.message);
                  } else {
                    insertedCount++;
                    if (insertedCount === 40) {
                      console.log('✓ Database seeded with 40 luxury products (10 per category).');
                    }
                  }
                });
            }
          });
        } else {
          console.log(`✓ Inventory OK: ${row ? row.count : 0} products loaded.`);
        }
      });
    });
  }
});

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  db.run('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', 
    [name, email, password, 'user'], 
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, email, role: 'user' });
    });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    res.json(user);
  });
});

app.get('/api/users', (req, res) => {
  db.all('SELECT id, name, email, role FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/products', (req, res) => {
  const { name, price, category, metal, description, discount, image, image2, image3 } = req.body;
  db.run('INSERT INTO products (name, price, category, metal, description, discount, image, image2, image3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [name, price, category, metal, description, discount, image, image2, image3], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, price, category, metal, description, discount, image, image2, image3 });
    });
});

app.put('/api/products/:id', (req, res) => {
  const { name, price, category, metal, description, discount, image, image2, image3 } = req.body;
  console.log(`[PUT] Updating product ID ${req.params.id} with discount: ${discount}`);
  db.run('UPDATE products SET name = ?, price = ?, category = ?, metal = ?, description = ?, discount = ?, image = ?, image2 = ?, image3 = ? WHERE id = ?', 
    [name, price, category, metal, description, discount, image, image2, image3, req.params.id], 
    function(err) {
      if (err) {
        console.error('Update error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        console.warn(`Product ID ${req.params.id} not found for update`);
        return res.status(404).json({ error: 'Product not found' });
      }
      console.log(`Successfully updated product ID ${req.params.id}`);
      res.json({ message: "updated", changes: this.changes });
    });
});

app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "deleted", changes: this.changes });
  });
});

app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    // Parse items JSON string back to array
    const orders = rows.map(order => ({
      ...order,
      items: order.items ? JSON.parse(order.items) : []
    }));
    res.json(orders);
  });
});

app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, total, items } = req.body;
  const now = new Date();
  const date = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + 
               ' ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const itemsStr = JSON.stringify(items || []);
  db.run('INSERT INTO orders (customerName, customerEmail, date, total, status, items) VALUES (?, ?, ?, ?, ?, ?)', 
    [customerName, customerEmail, date, total, 'Pending', itemsStr], 
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, customerName, customerEmail, date, total, status: 'Pending', items: items || [] });
    });
});

app.put('/api/orders/:id', (req, res) => {
  const { status } = req.body;
  db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "updated", changes: this.changes });
  });
});

app.get('/api/stats', (req, res) => {
  db.get('SELECT COUNT(*) as productCount FROM products', (err, prod) => {
    db.get('SELECT COUNT(*) as orderCount FROM orders', (err, ord) => {
      db.get('SELECT COUNT(*) as userCount FROM users', (err, usr) => {
        db.all('SELECT total FROM orders', (err, rows) => {
          let totalRev = 0;
          if (rows) {
            totalRev = rows.reduce((acc, row) => acc + parseInt(row.total.replace(/[^\d]/g, ''), 10), 0);
          }
          const formattedRev = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(totalRev);
          
          res.json({
            totalSales: formattedRev,
            visitors: 12450 + (ord ? ord.orderCount * 5 : 0),
            totalOrders: ord ? ord.orderCount : 0,
            totalProducts: prod ? prod.productCount : 0,
            totalUsers: usr ? usr.userCount : 0,
            conversionRate: '3.4%'
          });
        });
      });
    });
  });
});

app.post('/api/system/reseed', (req, res) => {
  db.serialize(() => {
    db.run('DELETE FROM products');
    const categoryAssets = {
      'Diamond': [
        '/src/assets/diamond_necklace_regal.png', '/src/assets/diamond_bracelet_tennis.png',
        '/src/assets/diamond_ring_princess_cut_solitaire.png', '/src/assets/diamond_pendant_teardrop.png',
        '/src/assets/Diamond Jewelry1.jpg', '/src/assets/Diamond Jewelry2.jpg',
        '/src/assets/Diamond Jewelry3.jpg', '/src/assets/Diamond Jewelry4.jpg',
        '/src/assets/Diamond Jewelry5.jpg'
      ],
      'Gold': [
        '/src/assets/gold_bangles_temple.png', '/src/assets/gold_necklace_choker.png',
        '/src/assets/gold_ring_band_matte.png', '/src/assets/gold_chain_rope_thick_luxury_finish.png',
        '/src/assets/Gold Necklaces1.jpg', '/src/assets/Gold Necklaces2.jpg',
        '/src/assets/Gold Necklaces3.jpg', '/src/assets/Gold Necklaces4.jpg',
        '/src/assets/Gold Necklaces5.jpg'
      ],
      'Ring': [
        '/src/assets/ring_gold_plain.png', '/src/assets/ring_ruby_gold.png',
        '/src/assets/ring_black_onyx.png', '/src/assets/ring_diamond_solitaire.png',
        '/src/assets/ring_turquoise_silver.png', '/src/assets/ring_sapphire_platinum.png',
        '/src/assets/Rings1.jpg', '/src/assets/Rings2.jpg',
        '/src/assets/Rings3.jpg', '/src/assets/Rings4.jpg',
        '/src/assets/Rings5.jpg'
      ],
      'Earrings': [
        '/src/assets/earrings_gold_jhumka.png', '/src/assets/earrings_diamond_studs.png',
        '/src/assets/earrings_modern_hoops.png', '/src/assets/Earrings1.jpg',
        '/src/assets/Earrings2.jpg', '/src/assets/Earrings3.jpg',
        '/src/assets/Earrings4.jpg', '/src/assets/Earrings5.jpg'
      ]
    };
    const metals = ['18KT Gold', '22KT Yellow Gold', 'Platinum', '18KT White Gold', '14KT Gold'];
    const categories = ['Diamond', 'Gold', 'Ring', 'Earrings'];
    categories.forEach(cat => {
      const assets = categoryAssets[cat];
      for (let i = 1; i <= 10; i++) {
        const metal = metals[Math.floor(Math.random() * metals.length)];
        const basePrice = Math.floor(Math.random() * 450000) + 25000;
        const price = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(basePrice);
        const name = `${cat} ${['Elegance', 'Royal', 'Classic', 'Modern', 'Vintage', 'Divine', 'Majestic', 'Eternal', 'Celestial', 'Imperial'][i-1]} #${100 + i}`;
        const description = `A premium ${metal} ${cat.toLowerCase()} piece from our exclusive collection.`;
        const shuffled = [...assets].sort(() => 0.5 - Math.random());
        db.run('INSERT INTO products (name, price, category, metal, description, image, image2, image3) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [name, price, cat, metal, description, shuffled[0], shuffled[1], shuffled[2]]);
      }
    });
  });
  res.json({ message: "Reseed completed successfully" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
