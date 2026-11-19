# sales service

Cổng mặc định: 3004.

Từ thư mục gốc:

```powershell
Copy-Item backend/services/sales-service/.env.example backend/services/sales-service/.env
npm run dev:sales
```

Build riêng: `npm run build:sales`. Chạy bản đã build: `npm run start:sales`. Health: GET http://127.0.0.1:3004/health (liveness, chưa kiểm tra DB).

Database/schema: xd_sales. Chưa có persistence thật trong scaffold.

Chỉ các module có controller đã đăng ký mới có API hoạt động. Không coi các README module là tính năng đã hoàn tất. Hướng dẫn chung: docs/11-huong-dan-phat-trien-nhom.md.
