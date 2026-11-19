# Bộ khung phát triển XD Manager cho nhóm 5 người

## Trạng thái

Có 9 dịch vụ nghiệp vụ và Gateway, mỗi tiến trình có cổng và cấu hình riêng. Đây là scaffold phát triển, chưa phải hệ thống hoàn chỉnh. Customer/Payment chỉ có health; các module README chưa có API. Dữ liệu demo và đơn trong bộ nhớ vẫn được giữ để chạy tham khảo. Chưa tích hợp MySQL, auth thật, VNPAY/GHN, outbox/inbox hoặc WebSocket.

## Chuẩn bị và chạy

Yêu cầu Node.js 24 và npm theo README gốc. Sau khi clone, chạy từ thư mục gốc:

~~~powershell
npm ci
Copy-Item backend/services/catalog-service/.env.example backend/services/catalog-service/.env
npm run dev:catalog
~~~

Service vẫn dùng giá trị mặc định nếu chưa có .env; DATABASE_URL mới là cấu hình dành cho persistence tương lai. Khi triển khai DB thật, điền tài khoản riêng của schema và kiểm tra biến bắt buộc lúc khởi động. Không commit .env hoặc secret.

- Build riêng: npm run build:catalog (thay catalog bằng tên tương ứng).
- Chạy riêng bản build: npm run start:catalog.
- dev:<name> build rồi chạy một lần; chưa tự reload khi sửa file.
- Build toàn backend: npm run build:backend.
- Chạy toàn backend sau build: npm run start:backend.
- Chạy một nhóm sau build: node scripts/start-backend.cjs gateway catalog sales.
- Frontend: npm run dev:storefront hoặc npm run dev:admin.
- Frontend gọi Gateway; khi chạy riêng service thì kiểm thử API trực tiếp bằng HTTP client, hoặc chạy thêm Gateway và dịch vụ phụ thuộc.
- Launcher nạp .env riêng từng tiến trình bằng Node env-file; biến môi trường có sẵn ưu tiên hơn file. Khi chạy nhiều tiến trình, PORT toàn cục bị loại để tránh tranh cổng. HOST mặc định 127.0.0.1; đổi khi cần môi trường container.
- Launcher chạy nhóm theo phiên: một tiến trình dừng thì nhóm cùng dừng. Chạy terminal riêng nếu muốn vòng đời độc lập.

## Phân công

| Người | Thành phần | Frontend chủ trì |
| --- | --- | --- |
| 1 | Identity + Customer | Auth, tài khoản, hồ sơ, địa chỉ, chat |
| 2 | Catalog + Gateway | Sản phẩm, chi tiết, khuyến mãi sản phẩm, đánh giá |
| 3 | Inventory + Supply | Kho, kiểm kê, nhà cung cấp, nhập hàng |
| 4 | Sales + Reporting | Giỏ, checkout, đơn, trả hàng, mã giảm, báo cáo |
| 5 | Payment + Shipping | Kết quả thanh toán, giao hàng, hoàn tiền, COD |

Các file dùng chung package.json, package-lock.json, app.routes.ts, AppModule và backend/shared cần phối hợp khi sửa. Người 4 làm Reporting sau luồng đơn chính; người 5 tích hợp đối tác bằng adapter/mock trước sandbox.

## Cổng và dữ liệu sở hữu

| Tên dùng trong lệnh | Cổng | Schema |
| --- | --- | --- |
| gateway | 3000 | Không |
| identity | 3001 | xd_identity |
| catalog | 3002 | xd_catalog |
| inventory | 3003 | xd_inventory |
| sales | 3004 | xd_sales |
| shipping | 3005 | xd_shipping |
| supply | 3006 | xd_supply |
| reporting | 3007 | xd_reporting |
| customer | 3008 | xd_customer |
| payment | 3009 | xd_payment |

GET /health trên từng cổng là liveness, không phải bằng chứng DB/đối tác sẵn sàng. Gateway giữ GET /api/health cũ. Biến <SERVICE>_URL cấu hình client nội bộ hiện có; module mới tự dùng client theo hợp đồng.

## Cây chuẩn

~~~text
backend/
  api-gateway/src/{auth,clients,routing,webhooks}/
  services/<name>-service/
    .env.example
    README.md
    tsconfig.json
    src/
      main.ts
      app.module.ts
      modules/<business-module>/
  shared/                          # bootstrap.ts, service-http.ts, health/
frontend/
  storefront/src/app/{core,shared,features}/
  admin-portal/src/app/{core,shared,features}/
docs/api/
scripts/backend-apps.json
~~~

Trong module, tạo *.controller.ts, *.service.ts, *.module.ts; tách dto/, entities/, repositories/ khi triển khai. Đăng ký module vào AppModule. Thư mục có README là chỗ nhận việc, không tự được nạp thành module NestJS. Không bắt buộc thêm thư mục rỗng hoặc tạo mỗi bảng một service.

## Persistence và hợp đồng

- Dùng TypeORM + mysql2 theo docs/10; bổ sung dependency tương thích và cập nhật lockfile khi triển khai. Bộ khung chưa cài các package này.
- Khi triển khai persistence, có thể tạo src/database/ trong từng service để chứa data-source.ts và migrations; synchronize=false. Không chạy lại DDL demo để cập nhật DB có dữ liệu.
- database/*.sql là baseline demo cũ cho 7 schema, chưa đáp ứng thiết kế đích; Customer/Payment tạo schema bằng migration của service khi triển khai.
- Chỉ FK trong schema sở hữu, không đọc/ghi DB chéo service. shared không chứa repository/entity ORM dùng chung.
- Chốt API/DTO và sự kiện từ docs/06, docs/08 trước khi gọi chéo. Hiện demo dùng /api; /api/v1 là mục tiêu cần chuyển đổi đồng bộ.
- Gateway chưa định tuyến API Customer/Payment hoặc module mới. Người 2 bổ sung route khi có API thật; không tạo catch-all công khai cho mọi endpoint nội bộ.
- Webhook giữ dữ liệu cần xác minh; module tiếp nhận xử lý theo hợp đồng đối tác. Chưa có webhook hoạt động trong scaffold.
- Không dùng mock hoặc liveness để tuyên bố giao dịch thật thành công.

## Trình tự tích hợp và bàn giao

1. Identity + Gateway + Catalog; chốt quyền và cấu trúc lỗi.
2. Catalog + Customer + Sales: giỏ, địa chỉ, báo giá.
3. Sales + Inventory: giữ hàng, chống trùng, giải phóng, xuất kho.
4. Sales + Payment + Shipping: thanh toán, vận đơn, COD.
5. Chat/case trả, kiểm hàng, hoàn tiền, đánh giá và Reporting.

Mỗi phần bàn giao gồm migration (nếu có dữ liệu), API hợp đồng, kiểm tra quyền, frontend liên quan, kiểm thử quan trọng và README cấu hình. Build toàn hệ thống trước khi gộp. Không sửa module người khác để bù hợp đồng lệch mà chưa thống nhất.
