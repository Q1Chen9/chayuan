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
  database: 'yolodatabase', // Changed database name
  multipleStatements: true
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');

  // Create tables from yolodatabase.sql
  const createTablesSQL = `
    CREATE TABLE IF NOT EXISTS \`user\`  (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`username\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`password\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`email\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`phone\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`is_super\` int NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`) USING BTREE
    ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

    CREATE TABLE IF NOT EXISTS \`camerarecords\`  (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`weight\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`conf\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`username\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`start_time\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`out_video\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`kind\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`) USING BTREE
    ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

    CREATE TABLE IF NOT EXISTS \`imgrecords\`  (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`input_img\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`out_img\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`confidence\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
      \`all_time\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`conf\` decimal(5, 2) NULL DEFAULT NULL,
      \`weight\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`username\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`start_time\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`label\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
      \`ai\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`suggestion\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
      PRIMARY KEY (\`id\`) USING BTREE
    ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

    CREATE TABLE IF NOT EXISTS \`leafgraderecords\`  (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`input_img\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`out_img\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`confidence\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
      \`all_time\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`conf\` decimal(5, 2) NULL DEFAULT NULL,
      \`weight\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`username\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`start_time\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`label\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
      \`ai\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`suggestion\` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
      PRIMARY KEY (\`id\`) USING BTREE
    ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

    CREATE TABLE IF NOT EXISTS \`videorecords\`  (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`input_video\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`out_video\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`confidence\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
      \`all_time\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`conf\` decimal(5, 2) NULL DEFAULT NULL,
      \`weight\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`username\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`start_time\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      \`label\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
      PRIMARY KEY (\`id\`) USING BTREE
    ) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;
  `;

  db.query(createTablesSQL, (err) => {
    if (err) throw err;
    console.log("Tables created or already exist.");

    // Insert initial data if tables are empty
    db.query('SELECT COUNT(*) AS count FROM \`user\`', (err, result) => {
      if(err) throw err;
      if(result[0].count === 0) {
        db.query(`
          INSERT INTO \`user\` VALUES (1, 'admin', '123456', NULL, NULL, 1);
          INSERT INTO \`user\` VALUES (7, '1111', '1111', '2925901323@qq.com', '19522025110', 0);
        `);
      }
    });

    db.query('SELECT COUNT(*) AS count FROM \`imgrecords\`', (err, result) => {
      if(err) throw err;
      if(result[0].count === 0) {
        db.query(`
          INSERT INTO \`imgrecords\` VALUES (1275, 'http://localhost:9999/files/23dac24872da4462b95a4b38cb0eab1a/1.jpg', 'http://localhost:9999/files/29ced1fc7e9144f2b9952016bc57206e_result_1.jpg', '["97.36%"]', '3.176秒', 0.50, 'best.onnx', 'admin', '2025-07-22 12:34:06', '["藻斑病"]', '不使用Al', '未选择AI，无AI建议！');
          INSERT INTO \`imgrecords\` VALUES (1276, 'http://localhost:9999/files/23dac24872da4462b95a4b38cb0eab1a/10.jpg', 'http://localhost:9999/files/e945b02cc3df4ae9aab4d6b505292f27_result_10.jpg', '["93.68%"]', '0.181秒', 0.50, 'best.onnx', 'admin', '2025-07-22 12:34:07', '["茶盲蝽"]', '不使用Al', '未选择AI，无AI建议！');
          INSERT INTO \`imgrecords\` VALUES (1278, 'http://localhost:9999/files/23dac24872da4462b95a4b38cb0eab1a/11.jpg', 'http://localhost:9999/files/5d8cba78de8f407192d71159e2d39362_result_11.jpg', '["95.43%"]', '0.196秒', 0.50, 'best.onnx', 'admin', '2025-07-22 12:34:07', '["赤叶枯病"]', '不使用Al', '未选择AI，无AI建议！');
          INSERT INTO \`imgrecords\` VALUES (1285, 'http://localhost:9999/files/23dac24872da4462b95a4b38cb0eab1a/3.jpg', 'http://localhost:9999/files/cfa3f4f4e69046c7a895657a4a564e01_result_3.jpg', '["94.55%"]', '0.186秒', 0.50, 'best.onnx', 'admin', '2025-07-22 12:34:09', '["褐枯病"]', '不使用Al', '未选择AI，无AI建议！');
          INSERT INTO \`imgrecords\` VALUES (1289, 'http://localhost:9999/files/23dac24872da4462b95a4b38cb0eab1a/5.jpg', 'http://localhost:9999/files/88302f8d5a32489cb2f4ebab07b2ca30_result_5.jpg', '["98.34%"]', '0.174秒', 0.50, 'best.onnx', 'admin', '2025-07-22 12:34:10', '["灰枯病"]', '不使用Al', '未选择AI，无AI建议！');
          INSERT INTO \`imgrecords\` VALUES (1293, 'http://localhost:9999/files/23dac24872da4462b95a4b38cb0eab1a/7.jpg', 'http://localhost:9999/files/d61ed92789b4490a970a72bea48d9ff5_result_7.jpg', '["97.21%"]', '0.186秒', 0.50, 'best.onnx', 'admin', '2025-07-22 12:34:11', '["健康"]', '不使用Al', '未选择AI，无AI建议！');
        `);
      }
    });
    // Add more seeding for other tables if necessary
  });
});

app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// New API endpoints based on yolodatabase
app.get('/api/warnings', (req, res) => {
  // 1. Get counts for each disease type (excluding '健康')
  const getCountsQuery = `
      SELECT label, COUNT(*) as count 
      FROM imgrecords 
      WHERE label NOT LIKE '%健康%' 
      GROUP BY label
  `;

  db.query(getCountsQuery, (err, countResults) => {
      if (err) {
          res.status(500).send('Error fetching disease counts');
          return;
      }

      const diseaseCounts = {};
      countResults.forEach(row => {
          try {
              const label = JSON.parse(row.label)[0];
              if (label && label !== '健康') {
                  diseaseCounts[label] = row.count;
              }
          } catch (e) {
            if (row.label && row.label !== '健康') {
              diseaseCounts[row.label] = row.count;
            }
          }
      });

      // 2. Define warning level thresholds based on counts
      const getLevel = (count) => {
          if (count > 20) return '紧急';
          if (count > 10) return '高';
          if (count > 5) return '中';
          return '低';
      };

      // 3. Fetch the latest 30 warnings
      db.query('SELECT * FROM imgrecords ORDER BY id DESC LIMIT 30', (err, results) => {
          if (err) {
              res.status(500).send('Error fetching warnings from imgrecords');
              return;
          }

          // 4. Map results to warning format, using counts to determine level
          const warnings = results.map((record, index) => {
              let label;
              try {
                  label = JSON.parse(record.label)[0];
              } catch (e) {
                  label = record.label;
              }

              if (!label || label === '健康') {
                  return null; // This will be filtered out
              }

              const count = diseaseCounts[label] || 0;
              const level = getLevel(count);

              return {
                  id: record.id,
                  name: label,
                  level: level,
                  area: `区域${index + 1}`, // Placeholder for area
                  time: record.start_time,
                  suggestion: record.suggestion || '暂无建议'
              };
          }).filter(item => item !== null); // Filter out nulls (e.g., '健康' records)
          
          res.json(warnings);
      });
  });
});

app.get('/api/user-detections', (req, res) => {
  const query = `
    SELECT
        username as name,
        COUNT(*) as count
    FROM (
        SELECT username FROM imgrecords WHERE username IS NOT NULL
        UNION ALL
        SELECT username FROM leafgraderecords WHERE username IS NOT NULL
    ) AS combined_records
    GROUP BY
        username
    ORDER BY
        count DESC
    LIMIT 5;
  `;
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send('Error fetching user detections');
      return;
    }
    res.json(results);
  });
});

const pestColors = {
  '藻斑病': '#FF5370',
  '褐枯病': '#FFBA5A',
  '灰枯病': '#5A66FF',
  '健康': '#23fdc0',
  '茶盲蝽': '#47C8FF',
  '赤叶枯病': '#A66CFF'
};

app.get('/api/pest-distribution', (req, res) => {
    db.query('SELECT label FROM imgrecords', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching pest distribution');
            return;
        }

        const counts = {};
        let totalDetections = 0;

        results.forEach(record => {
            let labels = [];
            try {
                const parsed = JSON.parse(record.label);
                if (Array.isArray(parsed)) {
                    labels = parsed;
                }
            } catch (e) {
                if (record.label) {
                    labels.push(record.label);
                }
            }
            
            labels.forEach(label => {
                if (label) {
                    counts[label] = (counts[label] || 0) + 1;
                    totalDetections++;
                }
            });
        });

        const distribution = Object.entries(counts).map(([name, count]) => ({
            name: name,
            percentage: count,
            color: pestColors[name] || '#FFFFFF'
        }));

        res.json({ distribution, total: totalDetections });
    });
});

app.get('/api/leaf-grade-stats', (req, res) => {
    const query = `
        SELECT label, COUNT(*) as count 
        FROM leafgraderecords 
        GROUP BY label
    `;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching leaf grade stats');
            return;
        }

        const leafGradeColors = {
            '1-2天': '#67C23A',
            '2-4天': '#E6A23C',
            '4-7天': '#F56C6C',
            '7+天': '#909399'
        };

        const stats = results.map(row => {
            let label;
            try {
                label = JSON.parse(row.label)[0];
            } catch(e) {
                label = row.label;
            }
            return {
                name: label,
                value: row.count,
                color: leafGradeColors[label] || '#5A66FF'
            };
        }).filter(item => item.name);
        
        const aggregated = {};
        stats.forEach(item => {
          if (!aggregated[item.name]) {
            aggregated[item.name] = { name: item.name, value: 0, itemStyle: { color: item.color } };
          }
          aggregated[item.name].value += item.value;
        });
        
        const total = Object.values(aggregated).reduce((sum, item) => sum + item.value, 0);

        res.json({ stats: Object.values(aggregated), total });
    });
});


app.get('/api/severity-stats', (req, res) => {
    const getCountsQuery = `
        SELECT label, COUNT(*) as count 
        FROM imgrecords 
        WHERE label NOT LIKE '%健康%' 
        GROUP BY label
    `;

    db.query(getCountsQuery, (err, countResults) => {
        if (err) {
            res.status(500).send('Error fetching severity stats');
            return;
        }

        const stats = {
            '紧急': { name: '紧急', count: 0, color: '#FF5370' },
            '高': { name: '高', count: 0, color: '#FFBA5A' },
            '中': { name: '中', count: 0, color: '#47C8FF' },
            '低': { name: '低', count: 0, color: '#23fdc0' }
        };
        
        const getLevel = (count) => {
            if (count > 20) return '紧急';
            if (count > 10) return '高';
            if (count > 5) return '中';
            return '低';
        };

        countResults.forEach(row => {
            try {
                const label = JSON.parse(row.label)[0];
                if (label && label !== '健康') {
                    const level = getLevel(row.count);
                    if (stats[level]) {
                        stats[level].count++;
                    }
                }
            } catch (e) {
              if (row.label && row.label !== '健康'){
                const level = getLevel(row.count);
                if (stats[level]) {
                    stats[level].count++;
                }
              }
            }
        });

        res.json(Object.values(stats));
    });
});

app.get('/api/detection-trend', (req, res) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start of the day

    const query = `
        SELECT
            DATE(STR_TO_DATE(start_time, '%Y-%m-%d %H:%i:%s')) AS detection_date,
            COUNT(*) as count
        FROM
            imgrecords
        WHERE
            STR_TO_DATE(start_time, '%Y-%m-%d %H:%i:%s') >= ?
        GROUP BY
            detection_date
        ORDER BY
            detection_date ASC;
    `;

    db.query(query, [sevenDaysAgo], (err, results) => {
        if (err) {
            console.error("Error fetching detection trend:", err);
            res.status(500).send('Error fetching detection trend data');
            return;
        }

        const labels = [];
        const values = [];
        const dailyCounts = new Map(results.map(row => {
            const d = new Date(row.detection_date);
            const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            return [dateKey, row.count];
        }));

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            const dateStringKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            const formattedLabel = `${date.getMonth() + 1}/${date.getDate()}`;

            labels.push(formattedLabel);
            values.push(dailyCounts.get(dateStringKey) || 0);
        }

        res.json({ labels, values });
    });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 