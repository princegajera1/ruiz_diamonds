import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* =========================
   ROOT ROUTE
========================= */
app.get('/', (req, res) => {
  res.send('Backend running successfully 🚀');
});

/* =========================
   DATABASE SETUP
========================= */
const dataDir = join(__dirname, 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const db = new sqlite3.Database(join(dataDir, 'database.sqlite'), (err) => {
  if (err) {
    console.log('Database error:', err.message);
  } else {
    console.log('Connected to SQLite database');

    db.serialize(() => {

      /* PRODUCTS TABLE */
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price TEXT,
          category TEXT,
          metal TEXT,
          description TEXT,
          discount TEXT,
          image TEXT,
          image2 TEXT,
          image3 TEXT
        )
      `);

      /* USERS TABLE */
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          email TEXT UNIQUE,
          password TEXT,
          role TEXT DEFAULT 'user'
        )
      `);

      /* ORDERS TABLE */
      db.run(`
        CREATE TABLE IF NOT EXISTS orders (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customerName TEXT,
          customerEmail TEXT,
          date TEXT,
          total TEXT,
          status TEXT,
          items TEXT
        )
      `);

      /* DEFAULT ADMIN */
      db.run(
        `INSERT OR IGNORE INTO users (id, name, email, password, role)
         VALUES (1, 'Admin', 'admin@gmail.com', 'admin', 'admin')`
      );
    });
  }
});

/* =========================
   AUTH ROUTES
========================= */

app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;

  db.run(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, 'user'],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        name,
        email,
        role: 'user',
      });
    }
  );
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!user) {
        return res.status(401).json({
          error: 'Invalid email or password',
        });
      }

      res.json(user);
    }
  );
});

/* =========================
   PRODUCTS API
========================= */

app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

app.post('/api/products', (req, res) => {
  const {
    name,
    price,
    category,
    metal,
    description,
    discount,
    image,
    image2,
    image3,
  } = req.body;

  db.run(
    `INSERT INTO products 
    (name, price, category, metal, description, discount, image, image2, image3)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      price,
      category,
      metal,
      description,
      discount,
      image,
      image2,
      image3,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        message: 'Product added successfully',
      });
    }
  );
});

app.put('/api/products/:id', (req, res) => {
  const {
    name,
    price,
    category,
    metal,
    description,
    discount,
    image,
    image2,
    image3,
  } = req.body;

  db.run(
    `UPDATE products 
     SET name=?, price=?, category=?, metal=?, description=?, discount=?, image=?, image2=?, image3=?
     WHERE id=?`,
    [
      name,
      price,
      category,
      metal,
      description,
      discount,
      image,
      image2,
      image3,
      req.params.id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: 'Product updated successfully',
      });
    }
  );
});

app.delete('/api/products/:id', (req, res) => {
  db.run(
    'DELETE FROM products WHERE id=?',
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        message: 'Product deleted successfully',
      });
    }
  );
});

/* =========================
   ORDERS API
========================= */

app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.json(rows);
  });
});

app.post('/api/orders', (req, res) => {
  const { customerName, customerEmail, total, items } = req.body;

  const date = new Date().toLocaleString();

  db.run(
    `INSERT INTO orders
    (customerName, customerEmail, date, total, status, items)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      customerName,
      customerEmail,
      date,
      total,
      'Pending',
      JSON.stringify(items),
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json({
        id: this.lastID,
        message: 'Order placed successfully',
      });
    }
  );
});

/* =========================
   SERVER START
========================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});