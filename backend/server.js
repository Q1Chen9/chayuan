const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// 动态导入node-fetch
let fetch;
(async () => {
  const nodeFetch = await import('node-fetch');
  fetch = nodeFetch.default;
})();

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

// AI聊天接口 - 调用DeepSeek API
app.post('/api/ai-chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ error: '消息内容不能为空' });
        }
        
        // 检查fetch是否可用，如果不可用则直接使用备用回复
        if (!fetch) {
            console.log('fetch未初始化，使用备用回复');
            const fallbackResponse = generateFallbackResponse(message);
            return res.json({ response: fallbackResponse });
        }
        
        // 调用DeepSeek API
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer sk-6bdf146e7b644c0190520366b8d1b421' // 请替换为实际的API密钥
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个专业的茶园管理AI助手，专门帮助用户分析茶园数据、诊断茶叶病虫害、优化生产管理。请用专业但易懂的语言回答问题，并提供实用的建议。'
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });
        
        if (!response.ok) {
            throw new Error(`DeepSeek API错误: ${response.status}`);
        }
        
        const data = await response.json();
        const aiResponse = data.choices[0].message.content;
        
        res.json({ response: aiResponse });
        
    } catch (error) {
        console.error('AI聊天接口错误:', error);
        
        // 如果API调用失败，返回一个默认的智能回复
        const fallbackResponse = generateFallbackResponse(req.body.message || '');
        res.json({ response: fallbackResponse });
    }
});

// 生成备用回复（当DeepSeek API不可用时）
function generateFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('病虫害') || lowerMessage.includes('病害') || lowerMessage.includes('虫害')) {
        return '根据您的问题，建议您：\n1. 定期检查茶叶叶片状况\n2. 保持适当的田间湿度\n3. 及时清理病虫害叶片\n4. 使用生物防治方法\n\n如需更详细的诊断，请上传相关图片进行AI检测。';
    }
    
    if (lowerMessage.includes('产量') || lowerMessage.includes('生产')) {
        return '关于茶园生产管理，建议：\n1. 合理安排采摘时间\n2. 控制采摘强度\n3. 加强肥水管理\n4. 注意天气变化影响\n\n您可以查看生产页面了解详细的生产数据分析。';
    }
    
    if (lowerMessage.includes('环境') || lowerMessage.includes('监控')) {
        return '环境监控是茶园管理的重要环节：\n1. 关注温湿度变化\n2. 监测土壤状况\n3. 注意空气质量\n4. 预防极端天气\n\n您可以在监控页面查看实时环境数据。';
    }
    
    if (lowerMessage.includes('销售') || lowerMessage.includes('市场')) {
        return '关于茶叶销售分析：\n1. 关注市场价格趋势\n2. 分析不同渠道表现\n3. 了解地域销售分布\n4. 优化库存管理\n\n建议查看销售页面获取详细的市场分析数据。';
    }
    
    return '感谢您的咨询！作为茶园管理AI助手，我可以帮您：\n\n🌱 分析茶园健康状况\n🔍 诊断病虫害问题\n📊 解读生产数据\n📈 提供销售建议\n🌡️ 监控环境指标\n\n请告诉我您具体想了解哪方面的信息，或点击"分析当前页面"按钮，我会根据当前页面数据为您提供专业分析。';
}

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

    CREATE TABLE IF NOT EXISTS \`detection_tasks\` (
      \`id\` int NOT NULL AUTO_INCREMENT,
      \`name\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
      \`area\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
      \`type\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
      \`assignedUser\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`is_read\` tinyint(1) NOT NULL DEFAULT 0,
      PRIMARY KEY (\`id\`)
    ) ENGINE = InnoDB;
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

let warningSettings = {
    warningThresholds: { critical: 20, high: 10, medium: 5 },
    notificationRules: [
        { condition: '紧急', action: '邮件和短信通知', enabled: true, assignedUsers: ['张三', '李四'] },
        { condition: '高', action: '邮件通知', enabled: true, assignedUsers: ['王五'] },
        { condition: '中', action: '应用内通知', enabled: true, assignedUsers: ['赵六'] },
        { condition: '低', action: '无需通知', enabled: false, assignedUsers: [] }
    ]
};

app.get('/api/warning-settings', (req, res) => {
    res.json(warningSettings);
});

app.post('/api/warning-settings', (req, res) => {
    const newSettings = req.body;
    if (newSettings && newSettings.warningThresholds && newSettings.notificationRules) {
        warningSettings = newSettings;
        // In a real app, you would save this to a database
        res.status(200).send('Settings saved successfully');
    } else {
        res.status(400).send('Invalid settings format');
    }
});


app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// New API endpoints based on yolodatabase
app.get('/api/warnings', (req, res) => {
    // 1. Get counts for each disease type (excluding '健康')
    const getCountsQuery = `
        SELECT label 
        FROM imgrecords 
        WHERE label NOT LIKE '%健康%' 
    `;

    db.query(getCountsQuery, (err, allLabelRecords) => {
        if (err) {
            return res.status(500).send('Error fetching disease counts');
        }

        const diseaseCounts = {};
        allLabelRecords.forEach(record => {
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
            if (label && label !== '健康') {
                    diseaseCounts[label] = (diseaseCounts[label] || 0) + 1;
            }
            });
        });

        const getLevel = (count) => {
            if (count > warningSettings.warningThresholds.critical) return '紧急';
            if (count > warningSettings.warningThresholds.high) return '高';
            if (count > warningSettings.warningThresholds.medium) return '中';
            return '低';
        };

        // 3. Fetch the latest warnings from imgrecords, excluding '健康'
        db.query("SELECT * FROM imgrecords ORDER BY id DESC LIMIT 50", (err, results) => {
            if (err) {
                return res.status(500).send('Error fetching warnings from imgrecords');
            }

            const warnings = results.map((record, index) => {
                let label;
                try {
                    label = JSON.parse(record.label)[0];
                } catch (e) {
                    label = record.label;
                }

                if (!label || label === '健康') return null;

                const count = diseaseCounts[label] || 0;

                return {
                    id: record.id,
                    name: label,
                    level: getLevel(count),
                    area: `茶园${(record.id % 3) + 1}区`, // Placeholder for area
                    time: record.start_time,
                    suggestion: record.suggestion || '暂无建议',
                    user: record.username || '未知用户'
                };
            }).filter(item => item !== null);

            res.json(warnings.slice(0, 30));
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
                if (label && label !== '健康') {
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

app.post('/api/tasks', (req, res) => {
    const { name, area, type, assignedUser } = req.body;
    if (!name || !area || !type || !assignedUser) {
        return res.status(400).send('Missing required fields');
    }

    const query = 'INSERT INTO detection_tasks (name, area, type, assignedUser) VALUES (?, ?, ?, ?)';
    db.query(query, [name, area, type, assignedUser], (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error creating task');
        }
        res.status(201).send({ id: result.insertId, ...req.body });
    });
});


app.get('/api/severity-stats', (req, res) => {
    const getLabelsQuery = `
        SELECT label
        FROM imgrecords 
        WHERE label NOT LIKE '%健康%' 
    `;

    db.query(getLabelsQuery, (err, allLabelRecords) => {
        if (err) {
            res.status(500).send('Error fetching severity stats');
            return;
        }

        const diseaseCounts = {};
        allLabelRecords.forEach(record => {
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
                if (label && label !== '健康') {
                    diseaseCounts[label] = (diseaseCounts[label] || 0) + 1;
                }
            });
        });

        const stats = {
            '紧急': { name: '紧急', count: 0, color: '#FF5370' },
            '高': { name: '高', count: 0, color: '#FFBA5A' },
            '中': { name: '中', count: 0, color: '#47C8FF' },
            '低': { name: '低', count: 0, color: '#23fdc0' }
        };
        
        const getLevel = (count) => {
            if (count > warningSettings.warningThresholds.critical) return '紧急';
            if (count > warningSettings.warningThresholds.high) return '高';
            if (count > warningSettings.warningThresholds.medium) return '中';
            return '低';
        };

        Object.values(diseaseCounts).forEach(count => {
            const level = getLevel(count);
                if (stats[level]) {
                    stats[level].count++;
            }
        });

        res.json({
            stats: Object.values(stats),
            thresholds: warningSettings.warningThresholds
        });
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

app.get('/api/health-stats', (req, res) => {
    const query = `SELECT label FROM imgrecords`;
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching health stats');
            return;
        }

        let healthyCount = 0;
        let unhealthyCount = 0;

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
            
            const isUnhealthy = labels.some(l => l !== '健康' && l);
            const isHealthy = labels.includes('健康') && !isUnhealthy;
            
            if (isHealthy) {
                healthyCount++;
            } else if (isUnhealthy) {
                unhealthyCount++;
            }
        });

        res.json([
            { name: '健康', value: healthyCount, color: '#23fdc0' },
            { name: '存在病害', value: unhealthyCount, color: '#FF5370' }
        ]);
    });
});

app.get('/api/tasks', (req, res) => {
    db.query('SELECT * FROM detection_tasks ORDER BY createdAt DESC', (err, results) => {
        if (err) {
            res.status(500).send('Error fetching tasks');
            return;
        }
        res.json(results);
    });
});

// 环境数据API
app.get('/api/environment', (req, res) => {
    const environmentData = {
        temperature: 22.5,
        humidity: 65,
        lightIntensity: 45000,
        windSpeed: 2.3,
        rainfall: 12.5,
        uvIndex: 6,
        timestamp: new Date().toISOString()
    };
    res.json(environmentData);
});

// 土壤数据API
app.get('/api/soil', (req, res) => {
    const soilData = {
        soilMoisture: 45,
        soilTemperature: 18.5,
        ph: 6.2,
        nitrogen: 85,
        phosphorus: 42,
        potassium: 78,
        organicMatter: 3.2,
        timestamp: new Date().toISOString()
    };
    res.json(soilData);
});

// 空气质量数据API
app.get('/api/air-quality', (req, res) => {
    const airQualityData = {
        pm25: 35,
        pm10: 58,
        co2: 420,
        o3: 85,
        no2: 25,
        so2: 8,
        aqi: 72,
        quality: '良好',
        timestamp: new Date().toISOString()
    };
    res.json(airQualityData);
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});