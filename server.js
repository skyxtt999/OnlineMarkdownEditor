const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3333;
const MD_DIR = path.join(__dirname, 'md');

// 确保 md 目录存在
if (!fs.existsSync(MD_DIR)) {
    fs.mkdirSync(MD_DIR, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 获取文件列表
app.get('/api/files', (req, res) => {
    try {
        const files = fs.readdirSync(MD_DIR)
            .filter(f => f.endsWith('.md'))
            .map(f => ({
                name: f,
                path: f
            }));
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 读取文件内容
app.get('/api/files/:filename', (req, res) => {
    try {
        const filePath = path.join(MD_DIR, req.params.filename);
        if (!filePath.startsWith(MD_DIR)) {
            return res.status(403).json({ error: '禁止访问' });
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        res.json({ content });
    } catch (error) {
        res.status(404).json({ error: '文件不存在' });
    }
});

// 保存文件
app.put('/api/files/:filename', (req, res) => {
    try {
        const filePath = path.join(MD_DIR, req.params.filename);
        if (!filePath.startsWith(MD_DIR)) {
            return res.status(403).json({ error: '禁止访问' });
        }
        fs.writeFileSync(filePath, req.body.content, 'utf-8');
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 删除文件
app.delete('/api/files/:filename', (req, res) => {
    try {
        const filePath = path.join(MD_DIR, req.params.filename);
        if (!filePath.startsWith(MD_DIR)) {
            return res.status(403).json({ error: '禁止访问' });
        }
        fs.unlinkSync(filePath);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Markdown 编辑器运行在 http://localhost:${PORT}`);
});
