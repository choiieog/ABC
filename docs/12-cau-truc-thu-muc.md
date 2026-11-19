# Cây thư mục và ý nghĩa thành phần

Rà soát ngày 15/11/2026. Cây dưới đây hiển thị mã nguồn và cấu hình; bỏ qua .git, node_modules, dist, .angular và tệp môi trường riêng.

Đã sửa lỗi thiếu HealthModule, dọn 40 tệp .gitkeep và 11 thư mục rỗng. Các thư mục config, database, integrations, workers trong backend đã được xóa ở bước trước. database ở gốc vẫn chứa SQL.

```text
XD_Manager/
├── backend/
│   ├── api-gateway/
│   │   ├── src/
│   │   │   ├── auth/  [khung, chưa có mã]
│   │   │   │   └── note.txt
│   │   │   ├── clients/  [khung, chưa có mã]
│   │   │   │   └── README.md
│   │   │   ├── routing/
│   │   │   │   └── gateway.controller.ts
│   │   │   ├── webhooks/  [khung, chưa có mã]
│   │   │   │   └── README.md
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── .env.example
│   │   ├── README.md
│   │   └── tsconfig.json
│   ├── services/
│   │   ├── catalog-service/
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── categories/
│   │   │   │   │   │   ├── categories.controller.ts
│   │   │   │   │   │   ├── categories.dto.ts
│   │   │   │   │   │   ├── categories.entity.ts
│   │   │   │   │   │   ├── categories.module.ts
│   │   │   │   │   │   ├── categories.service.ts
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── products.controller.ts
│   │   │   │   │   │   ├── products.dto.ts
│   │   │   │   │   │   ├── products.entity.ts
│   │   │   │   │   │   ├── products.module.ts
│   │   │   │   │   │   ├── products.service.ts
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── promotions/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── reviews/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── units/  [khung, chưa có mã]
│   │   │   │   │       └── README.md
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── .env.example
│   │   │   ├── README.md
│   │   │   └── tsconfig.json
│   │   ├── customer-service/
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── addresses/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── conversations/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── profiles/  [khung, chưa có mã]
│   │   │   │   │       └── README.md
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── .env.example
│   │   │   ├── README.md
│   │   │   └── tsconfig.json
│   │   ├── identity-service/
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── roles/
│   │   │   │   │   │   ├── README.md
│   │   │   │   │   │   ├── roles.controller.ts
│   │   │   │   │   │   ├── roles.dto.ts
│   │   │   │   │   │   ├── roles.entity.ts
│   │   │   │   │   │   ├── roles.module.ts
│   │   │   │   │   │   └── roles.service.ts
│   │   │   │   │   ├── sessions/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── users/  [khung, chưa có mã]
│   │   │   │   │       └── README.md
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── .env.example
│   │   │   ├── README.md
│   │   │   └── tsconfig.json
│   │   ├── inventory-service/
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── counts/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── reservations/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── stock/
│   │   │   │   │       ├── README.md
│   │   │   │   │       ├── stock.controller.ts
│   │   │   │   │       ├── stock.dto.ts
│   │   │   │   │       ├── stock.entity.ts
│   │   │   │   │       ├── stock.module.ts
│   │   │   │   │       └── stock.service.ts
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── .env.example
│   │   │   ├── README.md
│   │   │   └── tsconfig.json
│   │   ├── payment-service/
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── attempts/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── cod/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── payments/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── refunds/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── settlements/  [khung, chưa có mã]
│   │   │   │   │       └── README.md
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── .env.example
│   │   │   ├── README.md
│   │   │   └── tsconfig.json
│   │   ├── reporting-service/
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── inventory-reports/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── payment-reports/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── projections/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── sales-reports/
│   │   │   │   │       ├── README.md
│   │   │   │   │       ├── sales-reports.controller.ts
│   │   │   │   │       ├── sales-reports.dto.ts
│   │   │   │   │       ├── sales-reports.entity.ts
│   │   │   │   │       ├── sales-reports.module.ts
│   │   │   │   │       └── sales-reports.service.ts
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── .env.example
│   │   │   ├── README.md
│   │   │   └── tsconfig.json
│   │   ├── sales-service/
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── cancellations/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── cart/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── checkout/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── coupons/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── orders/
│   │   │   │   │   │   ├── orders.controller.ts
│   │   │   │   │   │   ├── orders.dto.ts
│   │   │   │   │   │   ├── orders.entity.ts
│   │   │   │   │   │   ├── orders.module.ts
│   │   │   │   │   │   ├── orders.service.ts
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── returns/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── workflows/  [khung, chưa có mã]
│   │   │   │   │       └── README.md
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── .env.example
│   │   │   ├── README.md
│   │   │   └── tsconfig.json
│   │   ├── shipping-service/
│   │   │   ├── src/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── carriers/
│   │   │   │   │   │   ├── carriers.controller.ts
│   │   │   │   │   │   ├── carriers.dto.ts
│   │   │   │   │   │   ├── carriers.entity.ts
│   │   │   │   │   │   ├── carriers.module.ts
│   │   │   │   │   │   ├── carriers.service.ts
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── quotes/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── returns/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── shipments/
│   │   │   │   │       ├── README.md
│   │   │   │   │       ├── shipments.controller.ts
│   │   │   │   │       ├── shipments.dto.ts
│   │   │   │   │       ├── shipments.entity.ts
│   │   │   │   │       ├── shipments.module.ts
│   │   │   │   │       └── shipments.service.ts
│   │   │   │   ├── app.module.ts
│   │   │   │   └── main.ts
│   │   │   ├── .env.example
│   │   │   ├── README.md
│   │   │   └── tsconfig.json
│   │   └── supply-service/
│   │       ├── src/
│   │       │   ├── modules/
│   │       │   │   ├── receipts/
│   │       │   │   │   ├── README.md
│   │       │   │   │   ├── receipts.controller.ts
│   │       │   │   │   ├── receipts.dto.ts
│   │       │   │   │   ├── receipts.entity.ts
│   │       │   │   │   ├── receipts.module.ts
│   │       │   │   │   └── receipts.service.ts
│   │       │   │   └── suppliers/
│   │       │   │       ├── README.md
│   │       │   │       ├── suppliers.controller.ts
│   │       │   │       ├── suppliers.dto.ts
│   │       │   │       ├── suppliers.entity.ts
│   │       │   │       ├── suppliers.module.ts
│   │       │   │       └── suppliers.service.ts
│   │       │   ├── app.module.ts
│   │       │   └── main.ts
│   │       ├── .env.example
│   │       ├── README.md
│   │       └── tsconfig.json
│   ├── shared/
│   │   ├── health/
│   │   │   └── health.module.ts
│   │   ├── bootstrap.ts
│   │   └── service-http.ts
│   └── tsconfig.json
├── database/
│   ├── catalog-service.sql
│   ├── identity-service.sql
│   ├── inventory-service.sql
│   ├── README.md
│   ├── reporting-service.sql
│   ├── sales-service.sql
│   ├── seed-demo.sql
│   ├── shipping-service.sql
│   └── supply-service.sql
├── docs/
│   ├── api/  [khung, chưa có mã]
│   │   └── README.md
│   ├── 01-pham-vi-va-quyet-dinh.md
│   ├── 02-chuc-nang-va-phan-quyen.md
│   ├── 03-quy-trinh-va-trang-thai.md
│   ├── 04-kien-truc-va-tich-hop.md
│   ├── 05-thiet-ke-du-lieu.md
│   ├── 06-hop-dong-api.md
│   ├── 07-backlog-va-nghiem-thu.md
│   ├── 08-khuyen-mai-chat-tra-hang-danh-gia.md
│   ├── 09-doi-tac-va-dau-vao.md
│   ├── 10-so-do-va-quyet-dinh-ky-thuat.md
│   ├── 11-huong-dan-phat-trien-nhom.md
│   ├── 12-cau-truc-thu-muc.md
│   └── README.md
├── frontend/
│   ├── admin-portal/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/
│   │   │   │   │   ├── services/
│   │   │   │   │   │   └── resource-api.service.ts
│   │   │   │   │   └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── accounts/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── catalog/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── chat/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── customers/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── inventory/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── orders/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── payments/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── promotions/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── reports/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── returns/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── settings/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── shipping/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── supply/  [khung, chưa có mã]
│   │   │   │   │       └── README.md
│   │   │   │   ├── shared/
│   │   │   │   │   ├── README.md
│   │   │   │   │   └── resource.component.ts
│   │   │   │   ├── app.component.ts
│   │   │   │   └── app.routes.ts
│   │   │   ├── index.html
│   │   │   └── main.ts
│   │   └── tsconfig.app.json
│   ├── shared/
│   │   ├── api.ts
│   │   └── styles.css
│   ├── storefront/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/
│   │   │   │   │   ├── cart.service.ts
│   │   │   │   │   └── README.md
│   │   │   │   ├── features/
│   │   │   │   │   ├── addresses/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── auth/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── cart/
│   │   │   │   │   │   └── cart.component.ts
│   │   │   │   │   ├── catalog/
│   │   │   │   │   │   └── catalog.component.ts
│   │   │   │   │   ├── chat/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── checkout/
│   │   │   │   │   │   └── checkout.component.ts
│   │   │   │   │   ├── order-tracking/
│   │   │   │   │   │   └── tracking.component.ts
│   │   │   │   │   ├── payment-result/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── product-detail/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── profile/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   ├── returns/  [khung, chưa có mã]
│   │   │   │   │   │   └── README.md
│   │   │   │   │   └── reviews/  [khung, chưa có mã]
│   │   │   │   │       └── README.md
│   │   │   │   ├── shared/  [khung, chưa có mã]
│   │   │   │   │   └── README.md
│   │   │   │   ├── app.component.ts
│   │   │   │   └── app.routes.ts
│   │   │   ├── index.html
│   │   │   └── main.ts
│   │   └── tsconfig.app.json
│   ├── proxy.conf.json
│   └── tsconfig.json
├── scripts/
│   ├── backend-apps.json
│   └── start-backend.cjs
├── .gitignore
├── angular.json
├── package-lock.json
├── package.json
└── README.md
```

| Thành phần | Vai trò |
|---|---|
| backend/api-gateway | Nhận HTTP /api và định tuyến tới dịch vụ nghiệp vụ. |
| backend/services | Chín dịch vụ: Identity, Catalog, Inventory, Sales, Shipping, Supply, Reporting, Customer, Payment. |
| backend/shared/bootstrap.ts | Khởi tạo NestJS, host/cổng và shutdown hooks. |
| backend/shared/service-http.ts | Gọi HTTP nội bộ, timeout và địa chỉ dịch vụ. |
| backend/shared/health | Endpoint GET /health cho các ứng dụng đăng ký HealthModule. Catalog hiện chưa đăng ký module này. |
| frontend/storefront | Giao diện khách hàng: danh mục, giỏ hàng, checkout, tra cứu đơn. |
| frontend/admin-portal | Giao diện quản trị dùng bảng ResourceComponent và cấu hình trang trong app.routes.ts. |
| frontend/shared | Kiểu dữ liệu API và CSS dùng chung cho hai giao diện. |
| core | Service nền tảng dùng trong từng ứng dụng frontend. |
| shared trong frontend | Thành phần giao diện tái sử dụng trong từng ứng dụng. |
| features | Chia giao diện theo nghiệp vụ; nhiều thư mục mới là khung README. |
| modules | Chia backend theo nghiệp vụ; chỉ module đã đăng ký mới hoạt động. |
| database ở gốc | SQL baseline của bảy schema cũ và dữ liệu mẫu; backend chưa kết nối MySQL. |
| docs | Thiết kế đích, API, phân công nhóm và tài liệu cấu trúc. |
| scripts/backend-apps.json | Danh sách 10 tiến trình và cổng mặc định 3000–3009. |
| scripts/start-backend.cjs | Chạy toàn bộ hoặc từng backend, nạp .env riêng. |
| tsconfig.json, tsconfig.app.json | Cấu hình biên dịch TypeScript và kế thừa; các lệnh build đang sử dụng. |
| .env.example | Mẫu cấu hình môi trường, không phải tệp chứa secret thật. |
| angular.json | Cấu hình build/serve hai ứng dụng Angular. |
| package.json, package-lock.json | Dependencies, scripts và phiên bản thư viện. |
| node_modules | Thư viện cài bằng npm; không chỉnh sửa thủ công. |
| dist, .angular | Kết quả build và cache; không phải mã nguồn. |

Trong module NestJS, controller nhận HTTP; service xử lý nghiệp vụ; dto mô tả dữ liệu API; entity hiện là kiểu TypeScript, chưa phải entity ORM; module đăng ký controller và service.

## Kết quả kiểm tra

- npm run build: thành công cho backend, storefront và admin-portal.
- Khởi động 10 backend trên cổng kiểm tra riêng: thành công.
- 11 endpoint GET qua Gateway: thành công.
- Tạo đơn XM01 số lượng 2, tổng 190000 và tra cứu lại: thành công.
- Tạo đơn thiếu items: trả HTTP 400 đúng dự kiến.

Đây là kiểm tra build và API demo; chưa kiểm thử trình duyệt hoặc tích hợp MySQL/VNPAY/GHN thật.
