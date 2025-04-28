# PSA分析 Web UI

这是一个使用现代Web技术重构的PSA分析工具，从Qt桌面应用转换为Web应用。

## 技术栈

- **React 18** - 用户界面库
- **TypeScript** - 类型安全的JavaScript超集
- **Vite** - 快速的前端构建工具
- **Tailwind CSS v4** - 实用优先的CSS框架
- **TanStack Router** - 类型安全的React路由库
- **ReactFlow** - 用于可视化故障树的交互式节点图库
- **Radix UI** - 无样式、可访问的UI组件
- **Lucide React** - 美观的SVG图标库
- **ESLint** - JavaScript和TypeScript代码检查工具

## 项目结构

\`\`\`
src/
├── components/       # React组件
│   ├── nodes/        # 故障树节点组件
│   ├── tables/       # 数据表格组件
│   └── ui/           # UI组件库
├── layouts/          # 布局组件
├── lib/              # 工具函数和库
├── pages/            # 页面组件
├── routes/           # 路由定义
├── globals.css       # 全局样式
├── main.tsx          # 应用入口
└── router.tsx        # 路由配置
\`\`\`

## 功能

- 故障树可视化和编辑
- 门、基本事件和房屋事件管理
- 模型元素侧边栏
- 报告生成和查看
- 响应式设计，支持桌面和移动设备

## 开发

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

### 代码检查

\`\`\`bash
npm run lint
\`\`\`

## 许可证

MIT
