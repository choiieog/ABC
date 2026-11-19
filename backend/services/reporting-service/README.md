# reporting service

Cổng mặc định: 3007.

Từ thư mục gốc:

```powershell
Copy-Item backend/services/reporting-service/.env.example backend/services/reporting-service/.env
npm run dev:reporting
```

Build riêng: `npm run build:reporting`. Chạy bản đã build: `npm run start:reporting`. Health: GET http://127.0.0.1:3007/health (liveness, chưa kiểm tra DB).

Database/schema: xd_reporting. Chưa có persistence thật trong scaffold.

Chỉ các module có controller đã đăng ký mới có API hoạt động. Không coi các README module là tính năng đã hoàn tất. Hướng dẫn chung: docs/11-huong-dan-phat-trien-nhom.md.
