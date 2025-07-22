# 青芽智眸大数据智能运营平台

## 项目概述

本项目是一个基于 Vue.js 和 Node.js 的全栈数据可视化平台，专为茶叶种植园的智能监控和运营而设计。平台通过直观的图表和实时数据，展示了病虫害预警、环境监测、生产销售等关键指标，旨在帮助用户快速做出决策。

## 主要功能

- **实时预警系统**: 动态展示最新的病虫害预警，根据检测数量自动划分“紧急”、“高”、“中”、“低”四个严重等级。
- **数据可视化图表**:
    - **近7日检测趋势**: 以折线图形式展示过去一周内病虫害的检测数量变化。
    - **病虫害与茶叶分级分布**: 通过两个并排的饼图，分别展示不同病虫害的占比和茶叶的等级分布情况，并附有各自的总数统计。
    - **用户检测排行**: 实时更新检测次数最多的用户排名。
- **交互式操作**:
    - **查看完整建议**: 点击被截断的预警建议，可以通过弹窗查看完整内容。
    - **快速操作**: 提供一键“导出预警报告”和“推送预警通知”等便捷功能。
- **实时时间显示**: 页面顶部始终显示实时更新的当前日期和时间。

## 技术栈

- **前端**:
  - **框架**: Vue 3 (Composition API)
  - **图表**: Apache ECharts
  - **HTTP请求**: Axios
  - **路由**: Vue Router
  - **时间处理**: Day.js
- **后端**:
  - **框架**: Node.js, Express
  - **数据库驱动**: mysql2
- **数据库**:
  - MySQL

## 项目结构

```
chayuan/
├── backend/         # 后端服务
│   ├── node_modules/
│   ├── package.json
│   └── server.js    # Express服务器与API逻辑
├── public/
├── src/             # 前端源码
│   ├── assets/
│   ├── components/  # 通用组件 (如弹窗)
│   ├── router/
│   ├── utils/
│   └── view/        # 页面级组件 (包括图表)
│       ├── components/
│       └── prediction.vue # 预测页面主文件
├── README.md        # 项目说明
└── package.json     # 前端依赖与脚本
```

## 安装与运行

### 1. 环境准备

- 安装 [Node.js](https://nodejs.org/) (v16 或更高版本)
- 安装 [MySQL](https://www.mysql.com/) 数据库
- (可选) 安装 [Git](https://git-scm.com/)

### 2. 后端设置

1.  **进入后端目录**:
    ```bash
    cd backend
    ```
2.  **安装依赖**:
    ```bash
    npm install
    ```
3.  **数据库配置**:
    -   在你的 MySQL 服务中创建一个新的数据库，命名为 `yolodatabase`。
    -   打开 `backend/server.js` 文件，找到 `db` 连接配置部分。
    -   根据你的 MySQL 设置，修改 `host`, `user`, `password` 等字段。
4.  **启动后端服务**:
    ```bash
    node server.js
    ```
    服务启动后，会自动创建所需的数据表并填充初始数据。你将在终端看到 `Server is running on http://localhost:3000` 的提示。

### 3. 前端设置

1.  **回到项目根目录**:
    ```bash
    cd ..
    ```
2.  **安装依赖**:
    ```bash
    npm install
    ```
3.  **启动前端开发服务**:
    ```bash
    npm run dev
    ```
    服务启动后，你将在终端看到一个本地访问地址 (通常是 `http://localhost:5173`)。在浏览器中打开此地址即可访问平台。

## API 端点

后端服务提供了以下主要的 API 端点供前端调用：

- `GET /api/warnings`: 获取最新的实时预警信息。
- `GET /api/user-detections`: 获取用户检测次数排名。
- `GET /api/pest-distribution`: 获取病虫害种类分布数据及总数。
- `GET /api/severity-stats`: 获取预警严重等级的统计数据。
- `GET /api/detection-trend`: 获取近7日的病虫害检测趋势数据。
- `GET /api/leaf-grade-stats`: 获取茶叶分级统计数据及总数。





