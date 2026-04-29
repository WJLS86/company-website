require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Vercel环境下CORS可简化（默认允许前端域名访问）
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// 表单提交接口（逻辑不变）
app.post('/api/submit', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    console.log("收到表单数据:", { name, phone, email });

    // 读取飞书配置
    const APP_ID = process.env.FEISHU_APP_ID;
    const APP_SECRET = process.env.FEISHU_APP_SECRET;
    const BASE_TOKEN = process.env.FEISHU_BASE_TOKEN;
    const TABLE_TOKEN = process.env.FEISHU_TABLE_TOKEN;

    // 1. 获取飞书token
    const tokenRes = await axios.post('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      app_id: APP_ID,
      app_secret: APP_SECRET
    });
    const token = tokenRes.data.tenant_access_token;
    console.log("✅ 飞书Token获取成功:", token);

    // 2. 写入多维表格
    const writeRes = await axios.post(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${BASE_TOKEN}/tables/${TABLE_TOKEN}/records`,
      { fields: { "姓名": name, "电话": phone, "邮箱": email } },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ 飞书API响应:", writeRes.data);
    res.json({ success: true, msg: '提交成功！数据已同步至飞书' });

  } catch (err) {
    console.error("❌ 错误详情:", err.response?.data || err.message);
    res.json({ success: false, msg: '提交失败：' + (err.response?.data?.msg || err.message) });
  }
});

// 适配Vercel端口（核心修改！）
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ 服务启动成功：http://localhost:${PORT}`);
});