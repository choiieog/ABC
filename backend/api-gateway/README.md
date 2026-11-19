# API Gateway

Cổng mặc định: 3000.

Từ thư mục gốc:

```powershell
Copy-Item backend/api-gateway/.env.example backend/api-gateway/.env
npm run dev:gateway
```

Build riêng: `npm run build:gateway`. Chạy bản đã build: `npm run start:gateway`. Health: GET http://127.0.0.1:3000/health (liveness, chưa kiểm tra DB).

Gateway chỉ định tuyến và kiểm tra truy cập; Sales điều phối đơn.

Chỉ các module có controller đã đăng ký mới có API hoạt động. Không coi các README module là tính năng đã hoàn tất. Hướng dẫn chung: docs/11-huong-dan-phat-trien-nhom.md.
