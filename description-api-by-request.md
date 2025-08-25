# Mô tả API theo Request

## Cấu trúc Project-express 

``` bash
project-express-authen/
│── package.json
│── server.js
│── .env                   
├── data/                           # Chứa ouput của chức năng ghi file Excel
│
├── uploads/                        # Chứa file excel tạm thời
│
├── config/                         # Chứa các file cấu hình kết nối và tích hợp dịch vụ bên ngoài
│   └── database.js                 # Cấu hình Kết nối MySQL
│   └── cloudinary.js               # Cấu hình lưu trữ ảnh với Cloudinary
│   └── passport.js                 # Cấu hình đăng nhập với Google OAuth
│
├── src/                            # Lưu trữ source 
│   ├── models/                     # Định nghĩa các schema hoặc model
│   │   └── User.model.js           
│   │   └── Upload.model.js         
│   │
│   ├── controllers/                # Chứa các hàm xử lý logic request/response
│   │   └── auth.controller.js      
│   │   └── excel.controller.js     
│   │   └── upload.controller.js    
│   │   └── user.controller.js     
│   │
│   ├── routes/                     # Định nghĩa endpoint API.
│   │   └── auth.routes.js        
│   │   └── excel.routes.js        
│   │   └── upload.routes.js       
│   │   └── user.routes.js          
│   │   └── index.js                
│   │
│   ├── services/                   # Chứa business logic và xử lý dữ liệu.
│   │   └── auth.service.js         
│   │   └── excel.service.js  
│   │   └── upload.service.js  
│   │   └── user.service.js  
│   │
│   ├── middlewares/                # Chứa các middleware tái sử dụng
│   │   └── auth.middleware.js      # verify token từ service Auth
│   │   └── error.middleware.js 
│   │   └── role.middleware.js 
│   │   └── upload.middleware.js 
│   │
│   ├── utils/                      # Chứa helper/tiện ích dùng chung.
│   │   └── response.js
│   │   └── mailer.js
│   │
│   └── app.js                      # Khởi tạo ứng dụng Express
```

## Cách chạy project backend express
``` bash
cd project-express-authen
npm install
nodemon server.js
```

# 1. Tạo tài khoản, đăng nhập tài khoản và generate jwt

## 1. Register User
### Endpoint: POST /api/auth/register
### Request Body
``` json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "123456",
  "numberphone": "0123456789"
}
```
### Response (201 Created)
``` json
{
  "user": {
    "id": "64f8b1e...",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "numberphone": "0123456789",
    "role": "user"
  }
}
```
### Logic
- Kiểm tra email đã tồn tại chưa (authService.findByEmail).

- Nếu tồn tại → trả về lỗi 400.

- Nếu chưa tồn tại → mã hóa password và lưu vào DB (authService.create).

## 2. Login User
### Endpoint: POST /api/auth/login
### Request Body
``` json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### Response (200 OK)
``` json
{
  "token": "jwt_token_here",
  "user": {
    "id": "64f8b1e...",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "numberphone": "0123456789",
    "role": "user"
  }
}

```
### Logic
- Tìm user theo email (authService.findByEmail).
- So sánh mật khẩu (authService.checkPassword).
- Nếu đúng → tạo JWT Token với payload { id, email, name, numberphone, role }.
- Trả về token + thông tin user.

## 3. Middleware: auth.middleware.js (Mục đích: Bảo vệ các route yêu cầu đăng nhập.)
### Logic
- Lấy token từ header Authorization: Bearer <token>.

- Nếu không có → trả về lỗi 401 Unauthorized.

- Nếu có → kiểm tra token (jwt.verify).

- Nếu hợp lệ → gán req.user = decoded.

- Nếu sai → trả về lỗi 403 Forbidden.


# 2. Social Login (Google OAuth2) Flow

## Cách chạy project frontend nextjs
``` bash
cd frontend-next
npm install
npm run build
npm run dev
```

## 1. Flow hoạt động
1. Frontend NextJS select tới Endpoint http://localhost:3000/auth/login bấm nút "Login with Google" → gọi API GET /api/auth/google.

2. API GET /api/auth/google → Passport chuyển hướng sang trang đăng nhập Google (scope: ["profile", "email"]).

3. Sau khi user đồng ý → Google trả về thông tin (profile, email…) qua API callback GET /api/auth/google/callback

4. Trong passport.use(new GoogleStrategy(...)):
- Lấy email từ Google.
- Tìm user trong DB (authService.findByEmail).
- Nếu chưa có → tạo mới user (authService.create).
- Trả về user cho Passport.

5. authController.googleCallback nhận req.user, tạo JWT token, rồi redirect về frontend:
``` arduino
http://localhost:3000?token=<jwt_token>
```

6. Frontend lấy token từ URL, lưu vào cookie / localStorage, rồi dùng để gọi API backend như login thường.

# 3. Upload file + 6. API CURD có kết nối Database MongoDB

## 1. Authentication
- Tất cả API đều cần JWT Token (qua middleware authMiddleware).
- Thêm vào request header:

``` http
Authorization: Bearer <your_token>
```

## 2. Endpoints
## 2.1 Upload File
### Endpoint: POST /api/upload/uploadfile
### Middleware: uploadMiddleware.single('image')
### Request (Form-Data)

``` bash
Field	            Type	              Description
──────────────────────────────────────────────────────
title	            text	              Tiêu đề file
──────────────────────────────────────────────────────
description	        text	              Mô tả file
──────────────────────────────────────────────────────
file	        	File                  ảnh upload (Cloudinary sẽ lưu)

```

### Response (200 OK)
``` json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "_id": "64f8b1e...",
    "title": "Ảnh sản phẩm",
    "description": "Ảnh sản phẩm mới",
    "ImageUrl": "https://res.cloudinary.com/xxx/image/upload/abc.jpg",
    "cloudinary_id": "abc123",
    "createdAt": "2025-08-25T10:15:30.000Z",
    "updatedAt": "2025-08-25T10:15:30.000Z"
  }
}
```

## 2.2 Get All Files
### Endpoint: GET /api/upload
### Response (200 OK)
``` json
{
  "message": "All files",
  "data": [
    {
      "_id": "64f8b1e...",
      "title": "Ảnh sản phẩm",
      "description": "Ảnh sản phẩm mới",
      "ImageUrl": "https://res.cloudinary.com/xxx/image/upload/abc.jpg",
      "cloudinary_id": "abc123",
      "createdAt": "2025-08-25T10:15:30.000Z"
    }
  ]
}
```

## 2.3. Get File By ID
### Endpoint: GET /api/upload/:id
### Response (200 OK)
``` json
{
  "message": "All files",
  "data": {
    "_id": "64f8b1e...",
    "title": "Ảnh sản phẩm",
    "description": "Ảnh sản phẩm mới",
    "ImageUrl": "https://res.cloudinary.com/xxx/image/upload/abc.jpg",
    "cloudinary_id": "abc123"
  }
}
```

## 2.4. Update File (Title & Description)
### Endpoint: PUT /api/upload/:id

### Request Body (JSON)
``` json
{
  "title": "Ảnh sản phẩm update",
  "description": "Ảnh đã chỉnh sửa"
}
```

### Response (200 OK)
``` json
{
  "message": "update successfull",
  "data": {
    "_id": "64f8b1e...",
    "title": "Ảnh sản phẩm update",
    "description": "Ảnh đã chỉnh sửa",
    "ImageUrl": "https://res.cloudinary.com/xxx/image/upload/abc.jpg",
    "cloudinary_id": "abc123"
  }
}
```

## 2.5. Delete File
### Endpoint: DELETE /api/upload/:id

### Response (200 OK)
``` json
{
  "message": "deleted successfull"
}
```

## 3. Cloudinary Integration

- Upload ảnh được xử lý bởi uploadMiddleware + Cloudinary config.

- Khi xóa file → service gọi cloudinary.uploader.destroy(cloudinary_id) để xóa ảnh trên Cloudinary.

# 4. Gửi email

## 1. Forgot Password (Yêu cầu đặt lại mật khẩu)

### Endpoint: POST /api/auth/forgotpass
### Request Body 
``` json
{
  "email": "user@example.com"
}
```

### Logic
1. Nhận email từ request.

2. Gọi authService.generateResetToken(email) để:

- Tìm user theo email.

- Nếu không có user → trả về 404 User not found.

- Nếu có → tạo reset token (chuỗi random bằng crypto.randomBytes).

- Lưu token và thời gian hết hạn (resetTokenExpiration = Date.now() + 1 giờ) vào DB.

3. Tạo link reset password dạng:
``` bash
http://localhost:3001/api/auth/resetpass?token=<reset_token>
```

4. Gửi email cho user kèm link.

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "message": "Reset password link has been sent"
  }
}
```

## 2. Reset Password (Đặt lại mật khẩu mới)

### Endpoint: POST /api/auth/resetpass?token=<reset_token>
### Request Params / Query
- token: mã reset đã gửi qua email.

### Request Body
``` json
{
  "password": "newpassword123"
}
```

### Logic
1. Lấy token từ query string (req.query.token).

2. Tìm user có resetToken = token và resetTokenExpiration còn hạn.

3. Nếu không có → trả về 400 Invalid token or expired.

4. Nếu có → hash mật khẩu mới (bcrypt.hash).

5. Cập nhật password vào DB, đồng thời xóa resetToken và resetTokenExpiration để không dùng lại được.

### Response (200 OK)
``` json
{
  "success": true,
  "data": {
    "message": "Password has been reset successfully"
  }
}
```

### 3. Service Functions

1. generateResetToken(email)

- Tạo reset token ngẫu nhiên (crypto.randomBytes).

- Lưu token + thời gian hết hạn (1 giờ) vào DB.

- Trả về { user, token }.

2. resetPassword(token, newPassword)

- Tìm user theo resetToken và resetTokenExpiration.

- Hash mật khẩu mới.

- Lưu vào DB và xóa reset token.

- Trả về user sau khi update.

# 5. Đọc, ghi file excel

### 1. Upload & đọc dữ liệu từ file Excel
### Endpoint: POST /api/excel/readexcel

## Mô tả

- API này cho phép upload 1 file Excel (.xlsx hoặc .xls) lên server và đọc dữ liệu trong sheet đầu tiên.

- Sau khi đọc xong, server sẽ xóa file tạm trong thư mục uploads/.

## Yêu cầu

- Header: cần token vì có authMiddleware

``` http
Authorization: Bearer <token>
```

1. Body: Form-data

- Key: file

- Type: File

- Value: chọn file Excel từ máy (ví dụ students.xlsx)

### Response (ví dụ)

``` json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Nguyen Van A",
      "score": 9.5
    },
    {
      "id": 2,
      "name": "Tran Thi B",
      "score": 8.0
    }
  ],
  "message": "File reading success"
}
```

## 2. Ghi dữ liệu ra file Excel

### Endpoint POST /api/excel/writeexcel
### Mô tả
- API này cho phép gửi dữ liệu (mảng JSON) lên server, sau đó server sẽ tạo 1 file Excel (output.xlsx) và lưu trong thư mục data/

### Yêu cầu
- Header: cần token vì có authMiddleware

``` http
Authorization: Bearer <token>
```

- Body (JSON)
``` json
{
  "data": [
    { "id": 1, "name": "Nguyen Van A", "score": 9.5 },
    { "id": 2, "name": "Tran Thi B", "score": 8.0 },
    { "id": 3, "name": "Le Van C", "score": 7.2 }
  ]
}
```

### Response 
``` json
{
  "success": true,
  "message": "Excel file created",
  "path": "D:\\project-express\\data\\output.xlsx"
}
```

- /api/excel/readexcel → upload Excel, server trả JSON data.
- /api/excel/writeexcel → gửi JSON data, server tạo file Excel và trả về path.

# 7. API CURD có kết nối Database MySQL hoặc PosgreSQL

``` bash
project-express-product/
│── package.json
│── server.js
│── .env                   
├── config/                         # Chứa các file cấu hình kết nối và tích hợp dịch vụ bên ngoài
│   └── database.js                 # Cấu hình Kết nối MySQL            
│
├── src/                            # Lưu trữ source 
│   ├── models/                     # Định nghĩa các schema hoặc model
│   │   └── Product.model.js         
│   │
│   ├── controllers/                # Chứa các hàm xử lý logic request/response
│   │   └── product.controller.js         
│   │
│   ├── routes/                     # Định nghĩa endpoint API.
│   │   └── product.routes.js                
│   │   └── index.js                
│   │
│   ├── services/                   # Chứa business logic và xử lý dữ liệu.
│   │   └── product.service.js         
│   └── app.js                      # Khởi tạo ứng dụng Express
```

### 1. Lấy danh sách sản phẩm

### Endpoint: GET /api/products
### Response 200 (OK)
``` json
[
  {
    "id": 1,
    "product_name": "iPhone 15",
    "price": 1200,
    "description": "Apple smartphone",
    "createdAt": "2025-08-25T04:00:00.000Z",
    "updatedAt": "2025-08-25T04:00:00.000Z"
  },
  {
    "id": 2,
    "product_name": "MacBook Pro",
    "price": 2500,
    "description": "Laptop for developers",
    "createdAt": "2025-08-25T04:05:00.000Z",
    "updatedAt": "2025-08-25T04:05:00.000Z"
  }
]
```

### 2. Lấy sản phẩm theo ID

### Endpoint: GET /api/products/:id
### Request Example: GET /api/products/1
### Response 200 (OK):
``` json
{
  "id": 1,
  "product_name": "iPhone 15",
  "price": 1200,
  "description": "Apple smartphone",
  "createdAt": "2025-08-25T04:00:00.000Z",
  "updatedAt": "2025-08-25T04:00:00.000Z"
}
```

### 3. Tạo sản phẩm mới

### Endpoint: POST /api/products
### Request Body (JSON):
``` json
{
  "product_name": "Samsung Galaxy S24",
  "price": 999,
  "description": "Latest Samsung phone"
}
```

### Response 201 (Created):
``` json
{
  "id": 3,
  "product_name": "Samsung Galaxy S24",
  "price": 999,
  "description": "Latest Samsung phone",
  "createdAt": "2025-08-25T04:10:00.000Z",
  "updatedAt": "2025-08-25T04:10:00.000Z"
}
```

### 4. Cập nhật sản phẩm theo ID

### Endpoint: PUT /api/products/:id
### Request Example: GET /api/products/1
### Request Body (JSON):
``` json
{
  "product_name": "iPhone 15 Pro",
  "price": 1300,
  "description": "Apple flagship smartphone"
}
```

### Response 200 (OK):
``` json
{
  "id": 1,
  "product_name": "iPhone 15 Pro",
  "price": 1300,
  "description": "Apple flagship smartphone",
  "createdAt": "2025-08-25T04:00:00.000Z",
  "updatedAt": "2025-08-25T04:15:00.000Z"
}
```

### 5. Xóa sản phẩm theo ID

### Endpoint: PUT /api/products/:id
### Request Example: GET /api/products/3
### Response 200 (OK):
``` json
{
  "message": "Product was deleted"
}
```

## Tóm lại:

- GET /api/products → Lấy tất cả sản phẩm

- GET /api/products/:id → Lấy 1 sản phẩm theo ID

- POST /api/products → Thêm sản phẩm mới

- PUT /api/products/:id → Cập nhật sản phẩm

- DELETE /api/products/:id → Xóa sản phẩm