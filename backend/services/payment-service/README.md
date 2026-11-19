# payment service

Cổng mặc định: 3009.

Từ thư mục gốc:

```powershell
Copy-Item backend/services/payment-service/.env.example backend/services/payment-service/.env
npm run dev:payment
```

Build riêng: `npm run build:payment`. Chạy bản đã build: `npm run start:payment`. Health: GET http://127.0.0.1:3009/health (liveness, chưa kiểm tra DB).

Database/schema: xd_payment. Chưa có persistence thật trong scaffold.

Chỉ các module có controller đã đăng ký mới có API hoạt động. Không coi các README module là tính năng đã hoàn tất. Hướng dẫn chung: docs/11-huong-dan-phat-trien-nhom.md.
