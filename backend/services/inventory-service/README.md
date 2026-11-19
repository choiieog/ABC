# inventory service

Cổng mặc định: 3003.

Từ thư mục gốc:

```powershell
Copy-Item backend/services/inventory-service/.env.example backend/services/inventory-service/.env
npm run dev:inventory
```

Build riêng: `npm run build:inventory`. Chạy bản đã build: `npm run start:inventory`. Health: GET http://127.0.0.1:3003/health (liveness, chưa kiểm tra DB).

Database/schema: xd_inventory. Chưa có persistence thật trong scaffold.

Chỉ các module có controller đã đăng ký mới có API hoạt động. Không coi các README module là tính năng đã hoàn tất. Hướng dẫn chung: docs/11-huong-dan-phat-trien-nhom.md.
