# shipping service

Cổng mặc định: 3005.

Từ thư mục gốc:

```powershell
Copy-Item backend/services/shipping-service/.env.example backend/services/shipping-service/.env
npm run dev:shipping
```

Build riêng: `npm run build:shipping`. Chạy bản đã build: `npm run start:shipping`. Health: GET http://127.0.0.1:3005/health (liveness, chưa kiểm tra DB).

Database/schema: xd_shipping. Chưa có persistence thật trong scaffold.

Chỉ các module có controller đã đăng ký mới có API hoạt động. Không coi các README module là tính năng đã hoàn tất. Hướng dẫn chung: docs/11-huong-dan-phat-trien-nhom.md.
