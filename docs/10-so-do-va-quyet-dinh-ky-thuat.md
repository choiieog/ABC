# Sơ đồ và quyết định kỹ thuật

## Lựa chọn để bắt đầu code

Giữ stack trong repository: Angular, NestJS, TypeScript, MySQL. Đề xuất TypeORM + mysql2 cho persistence, Nest integration qua `@nestjs/typeorm`; migration riêng từng datasource và `synchronize=false` trong mọi môi trường dùng dữ liệu cần giữ. Tài liệu cơ sở: [Nest database](https://docs.nestjs.com/techniques/database), [TypeORM migration setup](https://typeorm.io/docs/migrations/setup/). Đây là lựa chọn thiết kế, chưa cài dependency hoặc viết implementation.

Khi bắt đầu P01, chọn phiên bản package tương thích với Nest/Node thực tế, khóa lockfile và chạy build; không lấy version mới nhất mà không kiểm tra. Bổ sung validation, decimal arithmetic, password hashing, JWT, OpenAPI, WebSocket và test runner theo module; không cài trước mọi thư viện chưa dùng. Không tự nâng Angular/Nest trong công việc chuẩn bị tài liệu này.

Chat: WebSocket với REST recovery, DB lưu message. Outbox/inbox: worker trong từng tiến trình service cho giai đoạn đầu; có lease tránh xử lý trùng, không cần Redis/message broker ngay. Media: interface storage, local directory private ở dev và storage riêng ở production; không đặt ảnh chat private dưới thư mục public của Angular.

Login đề xuất email + password, SĐT nhận hàng là contact. Khôi phục mật khẩu tự phục vụ cần email provider/token one-time; khi chưa tích hợp email, chỉ OWNER reset tài khoản kho và ADMIN reset OWNER theo quy trình có audit. Không quảng cáo chức năng “quên mật khẩu khách hàng” nếu chưa có kênh xác minh an toàn.

## ERD theo ranh giới sở hữu

Sơ đồ chỉ thể hiện quan hệ nội bộ; `product_id`, `order_id`, `user_id` chéo dịch vụ là tham chiếu logic, không tạo FK xuyên schema. Các trường đầy đủ nằm trong tài liệu 05/08.

```mermaid
erDiagram
  ID_USERS ||--o{ ID_SESSIONS : owns
  ID_USERS ||--o{ ID_USER_ROLES : assigned
  ID_ROLES ||--o{ ID_USER_ROLES : defines
  CAT_CATEGORIES ||--o{ CAT_PRODUCTS : contains
  CAT_UNITS ||--o{ CAT_PRODUCTS : measures
  CAT_PRODUCTS ||--o{ CAT_IMAGES : shows
  CAT_PRODUCTS ||--o{ CAT_PROMOTIONS : discounts
  CAT_PRODUCTS ||--o{ CAT_REVIEWS : receives
  CAT_REVIEWS ||--o{ CAT_REVIEW_IMAGES : attaches
  CAT_REVIEWS ||--o| CAT_REPLIES : answered
  CUS_CUSTOMERS ||--o{ CUS_ADDRESSES : owns
  CUS_CUSTOMERS ||--o{ CUS_CONVERSATIONS : opens
  CUS_CONVERSATIONS ||--o{ CUS_MESSAGES : contains
  CUS_MESSAGES ||--o{ CUS_ATTACHMENTS : attaches
  SUP_SUPPLIERS ||--o{ SUP_RECEIPTS : supplies
  SUP_RECEIPTS ||--|{ SUP_RECEIPT_ITEMS : contains
```

```mermaid
erDiagram
  INV_RESERVATIONS ||--|{ INV_RESERVATION_ITEMS : holds
  INV_OPERATIONS ||--o{ INV_MOVEMENTS : records
  INV_COUNTS ||--|{ INV_COUNT_ITEMS : measures
  INV_COUNTS ||--o| INV_ADJUSTMENTS : applies
  SALES_ORDERS ||--|{ SALES_ORDER_ITEMS : contains
  SALES_ORDERS ||--o{ SALES_STATUS_HISTORY : records
  SALES_ORDERS ||--o{ SALES_CANCELLATIONS : requests
  SALES_ORDERS ||--o{ SALES_RETURNS : requests
  SALES_RETURNS ||--|{ SALES_RETURN_ITEMS : contains
  SALES_ORDER_ITEMS ||--o{ SALES_RETURN_ITEMS : refers
  SALES_COUPONS ||--o{ SALES_COUPON_USAGES : tracks
  SALES_ORDERS ||--o| SALES_COUPON_USAGES : uses
  PAY_ATTEMPTS ||--o| PAY_PAYMENTS : produces
  PAY_PAYMENTS ||--o{ PAY_REFUNDS : refunds
  PAY_REFUNDS ||--o{ PAY_REFUND_ATTEMPTS : attempts
  PAY_SETTLEMENTS ||--|{ PAY_SETTLEMENT_ITEMS : includes
  PAY_COD_COLLECTIONS ||--o| PAY_SETTLEMENT_ITEMS : settles
  SHIP_SHIPMENTS ||--o{ SHIP_EVENTS : records
  SHIP_SHIPMENTS ||--o{ SHIP_RETURNS : receives
  SHIP_RETURNS ||--|{ SHIP_INSPECTION_ITEMS : checks
```

Order reference trong Payment/Shipping không vẽ cạnh FK đến Sales để tránh hiểu nhầm DB join. Dòng review có `order_item_id` là tham chiếu eligibility, cũng không FK xuyên schema.

## Sơ đồ sau giao

```mermaid
stateDiagram-v2
  [*] --> Shipping
  Shipping --> AwaitingAcceptance: GHN xác nhận giao
  Shipping --> TransportReturn: Giao thất bại và chuyển hoàn
  AwaitingAcceptance --> Completed: Khách xác nhận
  AwaitingAcceptance --> Completed: Hết 120 giờ không case
  AwaitingAcceptance --> ReturnRequested: Mở case qua chat trong hạn
  ReturnRequested --> UnderReview: OWNER xem trao đổi
  UnderReview --> ReturnApproved: Duyệt dòng và số lượng
  UnderReview --> Disputed: Từ chối nhưng còn trao đổi
  Disputed --> ReturnApproved: Chấp thuận sau xác minh
  Disputed --> Completed: Kết thúc case có quyết định
  ReturnApproved --> Receiving: Nhận hàng gửi lại
  Receiving --> Inspection: Kiểm tốt hỏng thiếu
  Inspection --> RefundPending: Chốt khoản hoàn
  RefundPending --> Returned: Hoàn đủ đơn và xử lý xong
  RefundPending --> CompletedPartialReturn: Trả một phần và xử lý xong
```

Các nhãn ngắn trong sơ đồ là tên trình bày; mapping enum dùng tài liệu 03/08. Trả hàng được duyệt nhưng không nhận được hàng không tự chuyển refund; mở ngoại lệ xử lý.

## Sơ đồ thanh toán online

```mermaid
sequenceDiagram
  participant C as Khách
  participant S as Sales
  participant I as Inventory
  participant P as Payment
  participant V as VNPAY
  C->>S: Đặt quote đã xác nhận
  S->>S: Lưu CREATING và outbox
  S->>I: Giữ hàng cùng operationId
  I-->>S: ACTIVE hoặc thiếu tồn
  S-->>C: AWAITING_PAYMENT
  C->>P: Xin thanh toán đơn của mình
  P->>P: Lưu attempt và URL ký
  P-->>C: paymentUrl
  C->>V: Thanh toán toàn phần
  V->>P: IPN qua Gateway
  P->>P: Xác minh và commit inbox
  P-->>V: ACK theo đặc tả
  P->>S: PaymentSucceeded qua outbox
  S->>S: Chờ OWNER xác nhận
  C->>S: Đọc trạng thái backend
```

Return URL trình duyệt có thể đến trước IPN; giao diện hiển thị đang kiểm tra, không tự chuyển PAID. Mũi tên outbox là delivery có retry/idempotency, không khẳng định transaction xuyên service.

## Cấu trúc code dự kiến

```text
backend/services/<service>/src/
  main.ts
  app.module.ts
  modules/<business-module>/
    *.controller.ts
    *.service.ts
    dto/
    entities/
    repositories/
backend/shared/
  bootstrap.ts
  service-http.ts
  health/
frontend/<app>/src/app/
  core/               # API/auth/interceptor
  shared/             # UI không chứa quyền nghiệp vụ nguồn
  features/           # module nghiệp vụ theo tài liệu 02
```

Không bắt buộc tạo thư mục rỗng. Tạo khi triển khai module có trách nhiệm cụ thể. Customer/Payment mới cần đăng ký launcher, config port, build và readiness; script start hiện tại chưa tự nhận service mới.

## Lát cắt đầu tiên nên code

P01–P06: MySQL datasource + migration Identity, lỗi/validation, auth bốn vai trò, Gateway chuyển tiếp danh tính an toàn, đăng nhập trên frontend và kiểm tra ownership. Sau đó P07–P12: Catalog → tồn đầu kỳ → phiếu nhập → kiểm kê. Chỉ chuyển sang checkout khi tồn được lưu thật và các phép giữ/xuất có transaction.

Không viết toàn bộ schema mới rồi kết luận dự án hoàn tất. Mỗi lát cắt có API contract hoàn chỉnh trong OpenAPI, persistence, UI và kiểm thử theo tài liệu 07; các contract markdown hiện là thiết kế đầu vào cho bước đó.
