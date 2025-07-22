const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Qc123456',
  database: 'predictiondata'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');

  // Create warnings table and insert initial data
  db.query(`
    CREATE TABLE IF NOT EXISTS warnings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      level VARCHAR(50) NOT NULL,
      area VARCHAR(50) NOT NULL,
      time VARCHAR(50) NOT NULL,
      suggestion TEXT NOT NULL
    )
  `, (err) => {
    if (err) throw err;
    db.query('SELECT COUNT(*) AS count FROM warnings', (err, result) => {
      if(err) throw err;
      if(result[0].count === 0) {
        db.query(`
          INSERT INTO warnings (name, level, area, time, suggestion) VALUES
          ('藻斑病', '紧急', 'A1区', '2分钟前', '立即隔离A1区，并采用石硫合剂进行全面喷洒。'),
          ('茶盲蝽', '高', 'B3区', '15分钟前', '使用杀虫灯诱杀，并喷洒高效氯氰菊酯。'),
          ('褐枯病', '高', 'A2区', '30分钟前', '剪除病枝，集中烧毁，喷洒70%甲基托布津。'),
          ('赤叶枯病', '中', 'C1区', '1小时前', '增施有机肥，改善通风，喷洒50%多菌灵。'),
          ('灰枯病', '中', 'D4区', '2小时前', '清除落叶，减少病源，喷洒波尔多液。'),
          ('藻斑病', '低', 'B2区', '3小时前', '注意观察，保持茶园干燥，暂不需用药。')
        `);
      }
    });
  });

  // Create user_detections table and insert initial data
  db.query(`
    CREATE TABLE IF NOT EXISTS user_detections (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      count INT NOT NULL
    )
  `, (err) => {
    if (err) throw err;
    db.query('SELECT COUNT(*) AS count FROM user_detections', (err, result) => {
      if(err) throw err;
      if(result[0].count === 0) {
        db.query(`
          INSERT INTO user_detections (name, count) VALUES
          ('王农艺师', 128),
          ('李技术员', 97),
          ('张操作员', 85),
          ('赵监测员', 72),
          ('孙巡查员', 66)
        `);
      }
    });
  });

  // Create pest_distribution table and insert initial data
  db.query(`
    CREATE TABLE IF NOT EXISTS pest_distribution (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      percentage INT NOT NULL,
      color VARCHAR(50) NOT NULL
    )
  `, (err) => {
    if (err) throw err;
    db.query('SELECT COUNT(*) AS count FROM pest_distribution', (err, result) => {
      if(err) throw err;
      if(result[0].count === 0) {
        db.query(`
          INSERT INTO pest_distribution (name, percentage, color) VALUES
          ('藻斑病', 25, '#FF5370'),
          ('褐枯病', 20, '#FFBA5A'),
          ('灰枯病', 15, '#5A66FF'),
          ('健康', 10, '#23fdc0'),
          ('茶盲蝽', 18, '#47C8FF'),
          ('赤叶枯病', 12, '#A66CFF')
        `);
      }
    });
  });

  // Create severity_stats table and insert initial data
  db.query(`
    CREATE TABLE IF NOT EXISTS severity_stats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      count INT NOT NULL,
      color VARCHAR(50) NOT NULL
    )
  `, (err) => {
    if (err) throw err;
    db.query('SELECT COUNT(*) AS count FROM severity_stats', (err, result) => {
      if(err) throw err;
      if(result[0].count === 0) {
        db.query(`
          INSERT INTO severity_stats (name, count, color) VALUES
          ('紧急', 5, '#FF5370'),
          ('高', 12, '#FFBA5A'),
          ('中', 34, '#47C8FF'),
          ('低', 58, '#23fdc0')
        `);
      }
    });
  });
});

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

app.get('/api/warnings', (req, res) => {
  db.query('SELECT * FROM warnings ORDER BY id DESC', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching warnings');
      return;
    }
    res.json(results);
  });
});

app.get('/api/user-detections', (req, res) => {
  db.query('SELECT * FROM user_detections ORDER BY count DESC', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching user detections');
      return;
    }
    res.json(results);
  });
});

app.get('/api/pest-distribution', (req, res) => {
  db.query('SELECT * FROM pest_distribution', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching pest distribution');
      return;
    }
    res.json(results);
  });
});

app.get('/api/severity-stats', (req, res) => {
  db.query('SELECT * FROM severity_stats', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching severity stats');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 