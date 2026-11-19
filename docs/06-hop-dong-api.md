# Hợp đồng API

Đây là danh mục và hợp đồng logic để viết OpenAPI theo từng module; chưa phải OpenAPI executable hoặc endpoint đã có. Giữ legacy `/api` trong thời gian chuyển đổi; API mới đề xuất `/api/v1`. Frontend phải chuyển đồng bộ, không trộn response cũ/mới.

## Quy ước chung

- JSON camelCase; ID string UUID; money/quantity decimal string; time ISO UTC. Giới hạn chuỗi, precision và enum phải khai báo trong DTO/OpenAPI khi triển khai.
- Bearer access token cho API người dùng; refresh cookie; route công khai, nội bộ và webhook tách rõ.
- Danh sách: `page=1&pageSize=20`, tối đa 100; lọc từ ngày đến ngày dùng `[from,to)` sau chuyển múi giờ; sort allowlist. Response `{data:[],meta:{page,pageSize,total},requestId}`.
- Chi tiết `{data:{...},requestId}`. Lỗi `{error:{code,message,fields?,retryable},requestId}`; không lộ stack/SQL/secret.
- 400 dữ liệu sai, 401 chưa xác thực, 403 thiếu quyền, 404 không tồn tại hoặc ngoài ownership, 409 xung đột/state/version/idempotency, 422 nghiệp vụ không đáp ứng, 429 giới hạn, 502/503 đối tác/dịch vụ lỗi.
- POST đổi tiền/kho/đơn dùng `Idempotency-Key`; mutation aggregate dùng version hoặc If-Match. Gửi lại cùng key/payload trả cùng operation, không lặp tác dụng. 202 có `operationId`, `status`, `statusUrl`.
- Client không gửi userId để chọn chủ đơn, không gửi tổng tiền/role để server tin. Audit actor lấy từ danh tính đã kiểm chứng.

## Danh mục endpoint

| Nhóm | Endpoint sau /api/v1 | Quyền / đầu vào chính |
| --- | --- | --- |
| Auth | POST /auth/register, /auth/login, /auth/refresh, /auth/logout, /auth/change-password | Public register/login; session cho phần còn lại |
| Tài khoản | GET /me; PATCH /me | Mình; không nhận role/status |
| Admin | GET/POST /admin/owners; PATCH /admin/owners/{id}/status | ADMIN |
| Nhân viên | GET/POST /staff; PATCH /staff/{id}; POST /staff/{id}/reset-password | OWNER; chỉ WAREHOUSE |
| Danh mục | GET /categories; GET /products; GET /products/{id} | Public; lọc active, categoryId, q |
| Quản sản phẩm | POST/PATCH /products[/{id}]; POST /products/{id}/deactivate | OWNER; version |
| Ảnh | POST /media/uploads; POST /products/{id}/images | Theo mục đích upload/quyền; file hạn chế |
| Khách | GET/PATCH /customers/me; GET/POST /customers/me/addresses; PATCH/DELETE /customers/me/addresses/{id} | CUSTOMER của mình |
| Quản khách | GET /customers; GET /customers/{id}; PATCH /customers/{id}/status | OWNER |
| Supplier | GET/POST /suppliers; GET/PATCH /suppliers/{id}; PUT /suppliers/{id}/products | OWNER sửa, WAREHOUSE đọc |
| Nhập | GET/POST /receipts; GET/PATCH /receipts/{id}; POST /receipts/{id}/confirm; POST /receipts/{id}/cancel | OWNER/WAREHOUSE; chỉ sửa DRAFT |
| Kho | GET /inventory/balances, /inventory/movements, /inventory/reservations | OWNER/WAREHOUSE |
| Kiểm kê | GET/POST /inventory/counts; PATCH /inventory/counts/{id}; POST /inventory/counts/{id}/submit | OWNER/WAREHOUSE |
| Duyệt kiểm kê | POST /inventory/counts/{id}/approve; POST /inventory/counts/{id}/apply | OWNER; apply tạo operation |
| Giỏ | GET /cart; PUT /cart/items/{productId}; DELETE /cart/items/{productId} | CUSTOMER |
| Checkout | POST /checkout/quotes; POST /orders | CUSTOMER; quoteId, paymentMethod |
| Đơn khách | GET /orders; GET /orders/{id}; POST /orders/{id}/cancellation-requests | CUSTOMER của mình |
| Đơn quản trị | GET /management/orders; GET /management/orders/{id}; POST /management/orders/{id}/confirm | OWNER; WAREHOUSE chỉ xem phần được cấp |
| Hủy | POST /management/cancellation-requests/{id}/approve hoặc /reject | OWNER; reason/version |
| Kho xử lý đơn | POST /management/orders/{id}/prepare, /ready, /handover | OWNER/WAREHOUSE; trạng thái đúng |
| Online | POST /orders/{id}/payment-attempts; GET /orders/{id}/payment | CUSTOMER của mình; không nhận amount |
| Hoàn tiền | GET /management/refunds; POST /management/refunds/{id}/approve; POST /management/refunds/{id}/reconcile | OWNER; không sửa số tiền tùy ý |
| Shipping | GET /management/shipments; GET /orders/{id}/shipment | Kho/OWNER hoặc khách của mình |
| COD | GET /management/cod-settlements; POST /management/cod-settlements/import; POST /management/cod-settlements/{id}/reconcile | OWNER; file parse chặt, chống import trùng |
| Reports | GET /reports/{type}; POST /reports/{type}/exports; GET /exports/{id} | OWNER; export async, link hạn ngắn |
| Ops | GET /admin/services; GET /admin/audit; GET /health/live; GET /health/ready | ADMIN với chi tiết; public health tối thiểu |

Product POST và PATCH dùng hai route riêng; ký hiệu bảng là cách rút gọn tài liệu. Tất cả chi tiết body/response của các route hỗ trợ cần hoàn tất trong OpenAPI cùng module trước khi code controller. Không sinh controller tự động từ bảng này.

## Contract trọng tâm

### Quote

`POST /checkout/quotes`

```json
{"addressId":"uuid","items":[{"productId":"uuid","quantity":"2.000"}],"paymentMethod":"ONLINE","couponCode":null}
```

Response data gồm quoteId, expiresAt, items với giá gốc/giá áp dụng/giảm phân bổ, goodsSubtotal, productDiscountTotal, couponDiscountTotal, shippingFee, grandTotal, currency=VND, provider/service và dự kiến giao. Quote không giữ hàng. Nếu phí không lấy được, trả SHIPPING_QUOTE_UNAVAILABLE; không dùng phí 0 giả.

### Tạo đơn

`POST /orders`, header Idempotency-Key bắt buộc:

```json
{"quoteId":"uuid","paymentMethod":"ONLINE","note":"Gọi trước khi giao"}
```

Trả 201/202 với orderId, code, status, version, totals, deadline và statusUrl nếu đang xử lý. Một quote không tạo hai đơn ngay cả khi dùng hai key. Giá/coupon hết hạn hoặc thay đổi phải trả QUOTE_CHANGED/QUOTE_EXPIRED để khách xác nhận lại; không âm thầm thay tổng.

### Attempt

`POST /orders/{id}/payment-attempts` body `{}`; server tính số tiền từ order. Trả attemptId, status, paymentUrl, expiresAt. Chỉ URL được allowlist từ adapter; không redirect theo URL tùy ý do khách gửi.

### Hủy

`POST /orders/{id}/cancellation-requests`

```json
{"reason":"Không còn nhu cầu","expectedVersion":3}
```

Trả requestId/status/orderStatus/refundStatus nếu có. Sau bàn giao trả ORDER_ALREADY_HANDED_OVER; giao dịch hủy chưa chốt thì response PENDING, không giả CANCELLED.

### Bàn giao

`POST /management/orders/{id}/handover`

```json
{"shipmentId":"uuid","expectedVersion":8,"evidenceKeys":["private-object-key"]}
```

Chỉ khi có vận đơn đúng đơn, chuẩn bị xong, không yêu cầu hủy chặn và có bằng chứng bàn giao. Bước xuất kho có thể async; HANDOVER_PENDING cho đến thành công. Không yêu cầu kho tự nhập trạng thái ngân hàng.

## API nội bộ

Prefix `/internal/v1`, không công khai qua catch-all Gateway. Service credential, audience và quyền theo service gọi.

- Inventory: POST /reservations (orderId, lines, operationId); GET /operations/{operationId}; POST /reservations/{id}/release; POST /reservations/{id}/consume; POST /receipts/apply; POST /returns/apply.
- Catalog: POST /products/validate-cart; trả giá/version/đơn vị/profile giao.
- Shipping: POST /quotes; POST /shipments; GET /shipments/by-client-ref/{ref}; POST /shipments/{id}/cancel chỉ trước bàn giao; POST /reverse-shipments cho case được duyệt.
- Payment: POST /attempts; GET /attempts/by-reference/{ref}; POST /refunds; POST /cod-collections; không nhận lệnh đánh dấu thành công từ frontend.
- Consumer: POST /events với envelope và event_id; mỗi target lưu inbox trước xử lý.

## Callback theo đối tác đã chọn

- VNPAY IPN: `GET /integrations/vnpay/ipn` ở Gateway, tham số và chữ ký query nguyên bản theo tài liệu; không áp ép POST/raw-body cho VNPAY.
- VNPAY return: route trình duyệt `/payment/return` chỉ hiển thị/truy vấn kết quả; không tự đánh dấu PAID.
- GHN: `POST /integrations/ghn/order-events`, JSON; header bí mật cấu hình với đối tác và xác minh thêm qua query API cho thay đổi quan trọng. Không tự giả định GHN có HMAC.
- Response callback theo tài liệu đối tác, không bọc envelope API người dùng làm sai ACK.

## Mã lỗi nghiệp vụ

INSUFFICIENT_STOCK, PRODUCT_INACTIVE, INVALID_QUANTITY_STEP, QUOTE_EXPIRED, QUOTE_CHANGED, SHIPPING_NOT_SUPPORTED, SHIPPING_QUOTE_UNAVAILABLE, COUPON_INELIGIBLE, COUPON_LIMIT_REACHED, ORDER_STATE_CONFLICT, ORDER_ALREADY_HANDED_OVER, PAYMENT_PENDING, PAYMENT_RESULT_UNKNOWN, PAYMENT_AMOUNT_MISMATCH, REFUND_LIMIT_EXCEEDED, OPERATION_PENDING, VERSION_CONFLICT, IDEMPOTENCY_CONFLICT, RETURN_NOT_ELIGIBLE, REVIEW_NOT_ELIGIBLE. Mỗi lỗi có thông điệp tiếng Việt và retryable chính xác; không retry tự động mọi POST.
