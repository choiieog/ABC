# catalog service

Cổng mặc định: 3002.

Từ thư mục gốc:

```powershell
Copy-Item backend/services/catalog-service/.env.example backend/services/catalog-service/.env
npm run dev:catalog
```

Build riêng: `npm run build:catalog`. Chạy bản đã build: `npm run start:catalog`. Health: GET http://127.0.0.1:3002/health (liveness, chưa kiểm tra DB).

Database/schema: xd_catalog. Chưa có persistence thật trong scaffold.

Chỉ các module có controller đã đăng ký mới có API hoạt động. Không coi các README module là tính năng đã hoàn tất. Hướng dẫn chung: docs/11-huong-dan-phat-trien-nhom.md.
