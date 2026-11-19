# supply service

Cổng mặc định: 3006.

Từ thư mục gốc:

```powershell
Copy-Item backend/services/supply-service/.env.example backend/services/supply-service/.env
npm run dev:supply
```

Build riêng: `npm run build:supply`. Chạy bản đã build: `npm run start:supply`. Health: GET http://127.0.0.1:3006/health (liveness, chưa kiểm tra DB).

Database/schema: xd_supply. Chưa có persistence thật trong scaffold.

Chỉ các module có controller đã đăng ký mới có API hoạt động. Không coi các README module là tính năng đã hoàn tất. Hướng dẫn chung: docs/11-huong-dan-phat-trien-nhom.md.
