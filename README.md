# 宠物健康养护平台

基于 Next.js (App Router) + Flask 的全栈宠物健康养护管理平台。

## 功能特性

### 前端页面
- **登录页** - 用户注册、登录功能
- **宠物档案管理页** - 宠物信息增删改查
- **养护记录&养护建议页** - 养护记录管理，根据宠物品种/年龄/体重生成养护建议

### 后端API
- **JWT用户登录鉴权** - 用户注册、登录、Token验证
- **宠物信息CRUD** - 宠物档案增删改查
- **养护记录管理** - 养护记录录入与养护建议生成

## 技术栈

### 前端
- Next.js 14 (App Router)
- React 18
- TypeScript
- Axios
- CSS Modules

### 后端
- Flask 2.3
- Flask-SQLAlchemy
- Flask-JWT-Extended
- Flask-CORS
- SQLite

## 项目结构

```
pet-care-platform/
├── frontend/                    # Next.js 前端
│   ├── app/                     # 页面路由
│   │   ├── login/               # 登录页
│   │   ├── pets/                # 宠物档案管理页
│   │   └── care/                # 养护记录&建议页
│   ├── components/              # 公共组件
│   ├── lib/                     # 请求工具
│   ├── styles/                  # 样式文件
│   └── ...
├── backend/                     # Flask 后端
│   ├── models/                  # 数据库模型
│   ├── routes/                  # 分模块接口
│   ├── utils/                   # 工具函数
│   └── ...
├── screenshots/                 # 截图文件夹
├── docs/                        # 文档文件夹
├── prompt_log.md                # 提示日志
└── README.md                    # 项目说明
```

## 快速开始

### 环境要求
- Node.js >= 18
- Python >= 3.8

### 后端启动

```bash
cd backend
pip install -r requirements.txt
python app.py
```

后端服务运行在 http://localhost:5000

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端服务运行在 http://localhost:3000

## API接口

### 用户认证
- POST /api/auth/register - 用户注册
- POST /api/auth/login - 用户登录
- GET /api/auth/me - 获取当前用户

### 宠物管理
- GET /api/pets - 获取宠物列表
- GET /api/pets/:id - 获取宠物详情
- POST /api/pets - 创建宠物
- PUT /api/pets/:id - 更新宠物
- DELETE /api/pets/:id - 删除宠物

### 养护记录
- GET /api/care/records - 获取养护记录
- GET /api/care/records/:id - 获取记录详情
- POST /api/care/records - 创建养护记录
- PUT /api/care/records/:id - 更新养护记录
- DELETE /api/care/records/:id - 删除养护记录
- GET /api/care/advice/:pet_id - 获取养护建议

## 数据库

使用 SQLite 数据库，数据文件存储在 `backend/instance/pet_care.db`

## 配置文件

### 后端 (.env)
```
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key
DATABASE_URL=sqlite:///./instance/pet_care.db
```

### 前端 (.env)
```
NEXT_PUBLIC_API_BASE=http://localhost:5000/api
```

## 注意事项

1. 首次运行需要先启动后端创建数据库
2. 生产环境请修改 SECRET_KEY 和 JWT_SECRET_KEY
3. 前端默认代理后端地址为 http://localhost:5000
