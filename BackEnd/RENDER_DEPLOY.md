# Hướng dẫn Deploy Backend lên Render

## Bước 1: Chuẩn bị

1. Đảm bảo code đã được push lên GitHub
2. Tạo tài khoản Render tại https://render.com

## Bước 2: Tạo Database trên Render

1. Đăng nhập vào Render Dashboard
2. Click **New +** → **PostgreSQL** (hoặc MySQL nếu có)
3. Điền thông tin:
   - **Name**: `jobhunter-db`
   - **Database**: `jobhunter`
   - **User**: `jobhunter_user`
   - **Region**: Singapore (hoặc gần nhất)
   - **Plan**: Starter (free)
4. Click **Create Database**
5. Lưu lại **Internal Database URL** và **External Database URL**

## Bước 3: Deploy Web Service

### Cách 1: Sử dụng Render Dashboard

1. Click **New +** → **Web Service**
2. Connect repository GitHub của bạn
3. Điền thông tin:
   - **Name**: `jobhunter-backend`
   - **Region**: Singapore
   - **Branch**: `main`
   - **Root Directory**: `BackEnd` (nếu repo có folder BackEnd)
   - **Environment**: `Docker`
   - **Dockerfile Path**: `Dockerfile`
   - **Docker Context**: `.` (hoặc `BackEnd` nếu cần)

4. **Environment Variables**:
   ```
   SPRING_PROFILES_ACTIVE=prod
   DATABASE_URL=<Internal Database URL từ bước 2>
   DATABASE_USERNAME=<username từ database>
   DATABASE_PASSWORD=<password từ database>
   JWT_SECRET=<generate một secret key mới>
   PORT=8080
   ```

5. **Health Check Path**: `/actuator/health`

6. Click **Create Web Service**

### Cách 2: Sử dụng render.yaml (Recommended)

1. File `render.yaml` đã được tạo sẵn
2. Trong Render Dashboard, click **New +** → **Blueprint**
3. Connect repository và chọn file `render.yaml`
4. Render sẽ tự động tạo database và web service

## Bước 4: Cấu hình Database URL

Render MySQL connection string có format:
```
mysql://username:password@hostname:port/database
```

Nếu Render cung cấp PostgreSQL, bạn cần:
1. Thay đổi dependency trong `build.gradle.kts`:
   ```kotlin
   implementation("org.postgresql:postgresql")
   ```
2. Cập nhật `application-prod.properties`:
   ```properties
   spring.datasource.driver-class-name=org.postgresql.Driver
   spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
   ```

## Bước 5: Kiểm tra Deploy

1. Sau khi deploy xong, kiểm tra logs trong Render Dashboard
2. Test API endpoint: `https://your-app.onrender.com/actuator/health`
3. Nếu có lỗi, xem logs để debug

## Lưu ý quan trọng:

1. **Upload Files**: 
   - Render sử dụng ephemeral storage, files sẽ mất khi restart
   - Nên sử dụng S3 hoặc Cloud Storage cho production
   - Hoặc mount volume nếu dùng paid plan

2. **Database**:
   - Free tier có giới hạn
   - External connection có thể bị giới hạn IP
   - Nên dùng Internal Database URL

3. **Environment Variables**:
   - JWT_SECRET nên generate một giá trị mới cho production
   - Không commit secrets vào Git

4. **Health Check**:
   - Render sẽ check `/actuator/health` mỗi 30s
   - Nếu fail, service sẽ restart

5. **Build Time**:
   - Lần đầu build có thể mất 5-10 phút
   - Các lần sau sẽ nhanh hơn nhờ Docker cache

## Troubleshooting

### Lỗi kết nối Database:
- Kiểm tra Internal Database URL
- Đảm bảo database đã được tạo
- Kiểm tra firewall rules

### Lỗi build:
- Xem logs trong Render Dashboard
- Kiểm tra Dockerfile syntax
- Đảm bảo Java 21 được support

### Lỗi runtime:
- Xem application logs
- Kiểm tra environment variables
- Verify port configuration

## Update Code

Sau khi push code mới lên GitHub:
1. Render sẽ tự động detect changes
2. Tự động rebuild và redeploy
3. Có thể manual trigger trong Dashboard

