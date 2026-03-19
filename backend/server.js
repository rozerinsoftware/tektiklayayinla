const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
const db = new Database('ilanlar.db');

app.use(cors());
app.use(express.json());

// Veritabanı tablosunu oluştur
db.exec(`
  CREATE TABLE IF NOT EXISTS ilanlar (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    baslik TEXT NOT NULL,
    aciklama TEXT NOT NULL,
    fiyat TEXT NOT NULL,
    platformlar TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Tüm ilanları getir
app.get('/ilanlar', (req, res) => {
  const ilanlar = db.prepare('SELECT * FROM ilanlar').all();
  const parsed = ilanlar.map(ilan => ({
    ...ilan,
    platformlar: JSON.parse(ilan.platformlar)
  }));
  res.json(parsed);
});

// Yeni ilan ekle
app.post('/ilanlar', (req, res) => {
  const { baslik, aciklama, fiyat, platformlar } = req.body;
  const stmt = db.prepare('INSERT INTO ilanlar (baslik, aciklama, fiyat, platformlar) VALUES (?, ?, ?, ?)');
  const result = stmt.run(baslik, aciklama, fiyat, JSON.stringify(platformlar));
  res.json({ id: result.lastInsertRowid, baslik, aciklama, fiyat, platformlar });
});

// İlan güncelle
app.put('/ilanlar/:id', (req, res) => {
  const { baslik, aciklama, fiyat, platformlar } = req.body;
  const stmt = db.prepare('UPDATE ilanlar SET baslik=?, aciklama=?, fiyat=?, platformlar=? WHERE id=?');
  stmt.run(baslik, aciklama, fiyat, JSON.stringify(platformlar), req.params.id);
  res.json({ message: 'İlan güncellendi' });
});

// İlan sil
app.delete('/ilanlar/:id', (req, res) => {
  db.prepare('DELETE FROM ilanlar WHERE id=?').run(req.params.id);
  res.json({ message: 'İlan silindi' });
});

app.listen(3000, () => {
  console.log('Server çalışıyor: http://localhost:3000');
});