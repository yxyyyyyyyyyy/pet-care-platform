# 宠物健康养护平台 - API 接口文档

## 基础说明

- **基础地址**: `http://localhost:5000/api`
- **内容类型**: `application/json`
- **认证方式**: JWT Token

## 全局返回格式

### 成功响应
```json
{
  "message": "操作成功"
}
```

### 错误响应
```json
{
  "error": "错误类型",
  "message": "错误描述"
}
```

## 通用错误码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 参数错误 |
| 401 | 未登录或Token无效 |
| 403 | 无权访问 |
| 404 | 资源不存在 |

---

## 一、用户认证模块

### 用户注册

- **请求方式**: POST
- **接口地址**: `/api/auth/register`
- **权限**: 无需登录

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名，长度至少3位 |
| password | string | 是 | 密码，长度至少6位 |

#### 请求示例

```json
{
  "username": "petlover",
  "password": "123456"
}
```

#### 返回成功示例

```json
{
  "message": "注册成功",
  "user": {
    "id": 1,
    "username": "petlover",
    "created_at": "2026-07-15T10:00:00"
  }
}
```

#### 常见错误返回

```json
{
  "error": "注册失败",
  "message": "用户名已存在"
}
```

---

### 用户登录

- **请求方式**: POST
- **接口地址**: `/api/auth/login`
- **权限**: 无需登录

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

#### 请求示例

```json
{
  "username": "petlover",
  "password": "123456"
}
```

#### 返回成功示例

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "petlover",
    "created_at": "2026-07-15T10:00:00"
  }
}
```

#### 常见错误返回

```json
{
  "error": "登录失败",
  "message": "用户名或密码错误"
}
```

---

### 获取当前用户信息

- **请求方式**: GET
- **接口地址**: `/api/auth/me`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

无

#### 返回成功示例

```json
{
  "id": 1,
  "username": "petlover",
  "created_at": "2026-07-15T10:00:00"
}
```

#### 常见错误返回

```json
{
  "code": 401,
  "msg": "登录失效"
}
```

---

## 二、宠物管理模块

### 新增宠物

- **请求方式**: POST
- **接口地址**: `/api/pets`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 是 | 宠物名称 |
| species | string | 是 | 种类，如dog、cat |
| breed | string | 否 | 品种 |
| age | number | 是 | 年龄，0-50岁 |
| weight | number | 是 | 体重，0-200kg |
| gender | string | 是 | 性别，male或female |
| color | string | 否 | 颜色 |
| birthday | string | 否 | 生日，YYYY-MM-DD格式 |
| notes | string | 否 | 备注 |

#### 请求示例

```json
{
  "name": "旺财",
  "species": "dog",
  "breed": "金毛",
  "age": 3,
  "weight": 25,
  "gender": "male",
  "color": "金色",
  "birthday": "2023-05-15",
  "notes": "性格温顺"
}
```

#### 返回成功示例

```json
{
  "message": "创建成功",
  "pet": {
    "id": 1,
    "user_id": 1,
    "name": "旺财",
    "species": "dog",
    "breed": "金毛",
    "age": 3.0,
    "weight": 25.0,
    "gender": "male",
    "color": "金色",
    "birthday": "2023-05-15",
    "notes": "性格温顺",
    "created_at": "2026-07-15T10:30:00",
    "updated_at": "2026-07-15T10:30:00"
  }
}
```

#### 常见错误返回

```json
{
  "error": "创建失败",
  "message": "性别只能是male或female"
}
```

---

### 获取当前用户所有宠物

- **请求方式**: GET
- **接口地址**: `/api/pets`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

无

#### 返回成功示例

```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "旺财",
    "species": "dog",
    "breed": "金毛",
    "age": 3.0,
    "weight": 25.0,
    "gender": "male",
    "color": "金色",
    "birthday": "2023-05-15",
    "notes": "性格温顺",
    "created_at": "2026-07-15T10:30:00",
    "updated_at": "2026-07-15T10:30:00"
  }
]
```

---

### 获取宠物详情

- **请求方式**: GET
- **接口地址**: `/api/pets/<pet_id>`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

无

#### 返回成功示例

```json
{
  "id": 1,
  "user_id": 1,
  "name": "旺财",
  "species": "dog",
  "breed": "金毛",
  "age": 3.0,
  "weight": 25.0,
  "gender": "male",
  "color": "金色",
  "birthday": "2023-05-15",
  "notes": "性格温顺",
  "created_at": "2026-07-15T10:30:00",
  "updated_at": "2026-07-15T10:30:00"
}
```

#### 常见错误返回

```json
{
  "error": "宠物不存在"
}
```

---

### 修改宠物信息

- **请求方式**: PUT
- **接口地址**: `/api/pets/<pet_id>`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| name | string | 否 | 宠物名称 |
| species | string | 否 | 种类 |
| breed | string | 否 | 品种 |
| age | number | 否 | 年龄 |
| weight | number | 否 | 体重 |
| gender | string | 否 | 性别 |
| color | string | 否 | 颜色 |
| birthday | string | 否 | 生日 |
| notes | string | 否 | 备注 |

#### 请求示例

```json
{
  "name": "旺财",
  "age": 4,
  "weight": 26
}
```

#### 返回成功示例

```json
{
  "message": "更新成功",
  "pet": {
    "id": 1,
    "user_id": 1,
    "name": "旺财",
    "age": 4.0,
    "weight": 26.0
  }
}
```

#### 常见错误返回

```json
{
  "error": "宠物不存在"
}
```

---

### 删除宠物

- **请求方式**: DELETE
- **接口地址**: `/api/pets/<pet_id>`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

无

#### 返回成功示例

```json
{
  "message": "删除成功"
}
```

#### 常见错误返回

```json
{
  "error": "宠物不存在"
}
```

---

## 三、养护记录 & 养护建议模块

### 新增养护记录

- **请求方式**: POST
- **接口地址**: `/api/care/records`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pet_id | number | 是 | 宠物ID |
| record_type | string | 是 | 记录类型，如疫苗接种、驱虫、体检 |
| description | string | 否 | 详细描述 |
| date | string | 是 | 日期，YYYY-MM-DD格式 |
| veterinarian | string | 否 | 兽医姓名 |
| cost | number | 否 | 费用 |

#### 请求示例

```json
{
  "pet_id": 1,
  "record_type": "疫苗接种",
  "description": "狂犬疫苗第三针",
  "date": "2026-07-15",
  "veterinarian": "张医生",
  "cost": 150
}
```

#### 返回成功示例

```json
{
  "message": "创建成功",
  "record": {
    "id": 1,
    "pet_id": 1,
    "record_type": "疫苗接种",
    "description": "狂犬疫苗第三针",
    "date": "2026-07-15",
    "veterinarian": "张医生",
    "cost": 150.0,
    "created_at": "2026-07-15T11:00:00",
    "updated_at": "2026-07-15T11:00:00"
  }
}
```

---

### 获取养护记录列表

- **请求方式**: GET
- **接口地址**: `/api/care/records`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pet_id | number | 否 | 宠物ID，不传则返回所有宠物的记录 |

#### 请求示例

```
GET /api/care/records?pet_id=1
```

#### 返回成功示例

```json
[
  {
    "id": 1,
    "pet_id": 1,
    "record_type": "疫苗接种",
    "description": "狂犬疫苗第三针",
    "date": "2026-07-15",
    "veterinarian": "张医生",
    "cost": 150.0,
    "created_at": "2026-07-15T11:00:00",
    "updated_at": "2026-07-15T11:00:00"
  }
]
```

---

### 获取养护记录详情

- **请求方式**: GET
- **接口地址**: `/api/care/records/<record_id>`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

无

#### 返回成功示例

```json
{
  "id": 1,
  "pet_id": 1,
  "record_type": "疫苗接种",
  "description": "狂犬疫苗第三针",
  "date": "2026-07-15",
  "veterinarian": "张医生",
  "cost": 150.0,
  "created_at": "2026-07-15T11:00:00",
  "updated_at": "2026-07-15T11:00:00"
}
```

#### 常见错误返回

```json
{
  "error": "记录不存在"
}
```

---

### 修改养护记录

- **请求方式**: PUT
- **接口地址**: `/api/care/records/<record_id>`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| record_type | string | 否 | 记录类型 |
| description | string | 否 | 详细描述 |
| date | string | 否 | 日期 |
| veterinarian | string | 否 | 兽医姓名 |
| cost | number | 否 | 费用 |

#### 请求示例

```json
{
  "cost": 160
}
```

#### 返回成功示例

```json
{
  "message": "更新成功",
  "record": {
    "id": 1,
    "cost": 160.0
  }
}
```

---

### 删除养护记录

- **请求方式**: DELETE
- **接口地址**: `/api/care/records/<record_id>`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

无

#### 返回成功示例

```json
{
  "message": "删除成功"
}
```

---

### 根据宠物信息生成养护建议

- **请求方式**: GET
- **接口地址**: `/api/care/advice/<pet_id>`
- **权限**: 需要登录
- **请求头**: `Authorization: Bearer {token}`

#### 请求参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| pet_id | number | 是 | 宠物ID（路径参数） |

#### 请求示例

```
GET /api/care/advice/1
```

#### 返回成功示例

```json
{
  "pet": {
    "id": 1,
    "name": "旺财",
    "species": "dog",
    "age": 3.0,
    "weight": 25.0
  },
  "age_stage": "adult",
  "weight_advice": "中型犬，保持适量运动",
  "feeding": "每天喂食2次，控制食量防止肥胖",
  "exercise": "每天散步2次，每次30-60分钟",
  "health": "每年体检一次，定期驱虫",
  "grooming": "每周梳理毛发2-3次"
}
```
