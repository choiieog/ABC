# Thiết kế dữ liệu

Đây là mô hình logic và từ điển trường chủ chốt để viết migration; chưa phải DDL được triển khai. Quyết định chat/giảm giá/đánh giá/trả sau giao được bổ sung tại tài liệu 08 và phải đưa vào migration cùng mô hình này.

## Quy ước

- PK nội bộ UUID CHAR(36); mã hiển thị riêng UNIQUE, không dùng số thứ tự đoán được để thay kiểm tra quyền.
- Thời gian DATETIME(3) theo UTC; API ISO 8601; giao diện UTC+7. Đối tác yêu cầu giờ Việt Nam được chuyển trong adapter.
- Money DECIMAL(20,0), VND nguyên; quantity DECIMAL(18,3). Backend dùng decimal arithmetic, không tính tiền bằng float. JSON truyền tiền/số lượng dạng string; quy tắc làm tròn theo dòng ROUND_HALF_UP về đồng và snapshot kết quả.
- quantity_step của sản phẩm quy định bội số hợp lệ; hàng đếm có step=1. Không thay step/đơn vị khi làm sai lịch sử.
- Mọi aggregate mutable có version, created_at, updated_at; chứng từ có created_by/confirmed_by theo nghiệp vụ. FK chỉ trong schema sở hữu, mã chéo schema không tạo FK.
- Trạng thái dùng VARCHAR có CHECK hoặc bảng tham chiếu theo migration; không kéo dài ENUM cũ `received` mà bỏ qua dữ liệu hiện có.
- Thông tin snapshot người nhận, sản phẩm và giá giữ nguyên trên đơn. Thay hồ sơ master không sửa chứng từ cũ.
- Dữ liệu tài chính/kho không xóa vật lý. Image/file lưu object key và metadata; không nhét binary vào DB.

## Identity

| Bảng | Trường chủ chốt | Ràng buộc |
| --- | --- | --- |
| roles | code, name | PK code: ADMIN/OWNER/WAREHOUSE/CUSTOMER |
| users | id, login_normalized, password_hash, display_name, status, auth_version | UNIQUE login_normalized; đăng ký chỉ CUSTOMER |
| user_roles | user_id, role_code | PK kép, FK nội bộ; role mutation kiểm quyền |
| sessions | id, user_id, refresh_hash, expires_at, revoked_at, rotated_from, auth_version | UNIQUE refresh_hash; index user/expires |
| audit_logs | id, actor_id, action, entity_type/id, result, correlation_id, occurred_at, redacted_detail | Không cung cấp API sửa/xóa tùy ý |

Đề xuất chọn email làm định danh đăng nhập, số điện thoại là thông tin liên hệ; nếu cần login SĐT phải chuẩn hóa và thiết kế xác minh riêng. Không tự thêm OTP khi chưa có dịch vụ gửi.

## Catalog và Customer

| Bảng | Trường chủ chốt | Ràng buộc |
| --- | --- | --- |
| categories | id, code, name, status | UNIQUE code |
| units | id, code, name | UNIQUE code |
| products | id, sku, name, category_id, unit_id, quantity_step, list_price, status, description, weight_g_per_unit, shipping_profile_id | UNIQUE sku; price>=0, step>0; phải có profile giao trước publish |
| shipping_profiles | id, package_type, length_cm, width_cm, height_cm, packaging_rule, restricted | Không suy ra thể tích kiện bằng cộng chiều các sản phẩm; rule đóng gói cần kiểm chứng |
| product_images | id, product_id, object_key, sort_order, alt_text | FK product |
| product_price_history | id, product_id, old_price, new_price, actor_id, effective_at | Lưu thay đổi phục vụ đối chiếu |
| customers | id, user_id, name, phone_normalized, status | UNIQUE user_id; phone không tự coi là định danh duy nhất nếu chưa có xác minh |
| customer_addresses | id, customer_id, recipient, phone, address_text, provider_address_codes, is_default | FK customer; đổi default trong transaction |

Đơn vị phụ/quy đổi chưa chốt; không tự tạo nghiệp vụ bán bao/tấn cho cùng SKU khi chưa có hệ số và bước làm tròn.

## Supply

| Bảng | Trường chủ chốt | Ràng buộc |
| --- | --- | --- |
| suppliers | id, code, name, phone, email, address, contact_name, status | UNIQUE code |
| supplier_products | supplier_id, product_id, supplier_sku | PK supplier/product, product là mã ngoài |
| receipts | id, code, supplier_id, status, confirmed_at, inventory_operation_id | UNIQUE code/operation; snapshot supplier |
| receipt_items | id, receipt_id, product_id, product_name, unit_name, planned_qty, accepted_qty, unit_cost, line_total | qty>=0; accepted>0 với dòng xác nhận; phiếu có >=1 dòng nhận |

Không xác nhận phiếu rỗng. Cho chênh thực nhận/dự kiến với ghi chú; không ngầm tạo công nợ nhà cung cấp. Nếu quản trị viên thay đơn giá nhập sau CONFIRMED phải có chứng từ điều chỉnh riêng, không sửa lịch sử.

## Inventory

| Bảng | Trường chủ chốt | Ràng buộc |
| --- | --- | --- |
| stock_balances | product_id, on_hand, reserved, min_stock, version | PK product; on_hand>=reserved>=0; min_stock>=0 |
| reservations | id, order_id, operation_id, status, expires_at | UNIQUE order_id/operation_id theo bản đầu một reservation/đơn |
| reservation_items | reservation_id, product_id, quantity | PK kép; qty>0 |
| stock_operations | id, source_service, source_id, operation_type, result | UNIQUE source_service/source_id/type chống áp dụng lại |
| stock_movements | id, operation_id, product_id, movement_type, on_hand_delta, reserved_delta, occurred_at | UNIQUE operation/product/line; ledger không sửa |
| stock_counts | id, status, counted_at, approved_by, applied_at | Không apply hai lần |
| stock_count_items | count_id, product_id, system_qty, counted_qty, reason | PK kép; ghi snapshot/khóa sản phẩm |
| stock_adjustments | id, count_id, operation_id, reason, approved_by | UNIQUE count_id/operation_id |
| inventory_locks | product_id, count_id, lease_until | PK product; có quy trình gia hạn/kết thúc an toàn |

Thuật toán giữ hàng: mở transaction, khóa balances theo product_id đã sort, kiểm lock kiểm kê và `on_hand-reserved>=requested` cho mọi dòng, tăng reserved, lưu reservation/movement, commit. Không kiểm tồn bằng SELECT ngoài transaction rồi UPDATE thiếu điều kiện.

Xuất: khóa reservation ACTIVE, giảm on_hand/reserved cùng lượng, chuyển CONSUMED và ghi operation/movement trong cùng transaction. Hủy: chỉ ACTIVE được release; lặp trả cùng kết quả. Inventory không tự hết hạn reservation độc lập với Sales khi Payment chưa rõ; worker hết hạn phải đi qua điều phối đơn.

## Sales

| Bảng | Trường chủ chốt | Ràng buộc |
| --- | --- | --- |
| carts/cart_items | customer_id, product_id, quantity, version | UNIQUE customer/product; giỏ không giữ giá/tồn như cam kết |
| checkout_quotes | id, customer_id, cart_hash, address_snapshot, totals_snapshot, shipping_quote_id, expires_at, consumed_order_id | Chỉ dùng quote còn hạn/đúng khách; một quote chỉ tạo một đơn |
| orders | id, code, customer_id, status, payment_method, goods_subtotal, product_discount_total, coupon_discount_total, shipping_fee, grand_total, recipient_snapshot, reservation_id, payment_deadline, confirmation_deadline, delivered_at, acceptance_deadline, accepted_at, version | UNIQUE code/quote_id; totals>=0; total = goods - discounts + ship |
| order_items | id, order_id, product_id, sku/name/unit_snapshot, quantity, list_unit_price, sale_unit_price, product_discount, allocated_coupon_discount, line_payable | qty>0; discount không vượt tiền dòng; snapshot phân bổ để hoàn một phần |
| order_status_history | id, order_id, from_status, to_status, actor/source, reason, occurred_at | append-only |
| cancellation_requests | id, order_id, customer_id, reason, status, decided_by/at | Chỉ một yêu cầu active/đơn; khóa khi mở/hủy |
| order_workflows | order_id, workflow_type, step, status, command_id, next_attempt_at, last_error | Lưu bước saga bền vững |

Không lưu `payment_status` bản sao rồi tự sửa như nguồn thật; nếu cần projection phải kèm source version và thời điểm đồng bộ. Payment là nguồn khoản thu, Shipping là nguồn hành trình.

## Payment và Shipping

| Bảng | Trường chủ chốt | Ràng buộc |
| --- | --- | --- |
| payment_attempts | id, order_id, provider, merchant_ref, provider_transaction_id, amount, currency, status, expires_at, provider_paid_at | UNIQUE provider/merchant_ref; mã giao dịch ngoài unique khi có |
| payments | id, order_id, source, attempt_id/collection_id, amount, paid_at, duplicate_flag | Một khoản hợp lệ/đơn theo bảng claim; vẫn lưu khoản thu ngoài dự kiến |
| order_payment_claims | order_id, payment_id | PK order_id; nhận claim trong transaction với payments; thu thứ hai lưu exception/refund |
| refunds | id, payment_id, return_request_id, refund_ref, amount, status, provider_ref, approved_by | UNIQUE refund_ref; khóa payment và kiểm cap trước tạo |
| refund_attempts | id, refund_id, request_ref, status, result_at, evidence_key | Không phát sinh lần mới khi kết quả lần cũ UNKNOWN |
| cod_collections | id, shipment_id, order_id, expected_amount, collected_amount, collected_at, status | UNIQUE shipment_id, có nguồn xác minh |
| cod_settlements | id, provider, statement_ref, gross, fees, adjustments, net, transferred_at, bank_ref, status | UNIQUE provider/statement_ref |
| cod_settlement_items | settlement_id, collection_id, gross, fee, adjustment, net, discrepancy | UNIQUE collection_id cho bản đầu thanh toán một đợt |
| shipping_quotes | id, customer_id, provider, service_code, address/package_hash, fee_breakdown, customer_fee, expires_at | Gắn snapshot chính xác |
| shipments | id, order_id, direction, return_request_id, provider, client_ref, provider_ref, status, cod_amount, fee_payer, package_snapshot, handover_at | UNIQUE provider/client_ref, provider/provider_ref; một outbound/đơn |
| shipment_events | id, shipment_id, provider_event_key, raw_status, normalized_status, occurred_at, received_at | UNIQUE provider/event_key |
| shipment_returns | id, shipment_id, received_at, checked_by, inspection_status | Mỗi lượt kiểm nhận có mã duy nhất |
| return_inspection_items | return_id, order_item_id, received_good, received_damaged, missing, evidence_key | Tổng nhận không vượt lượng được hoàn |

`direction` phân biệt OUTBOUND/REVERSE. Không dùng UNIQUE order_id trần vì cùng đơn có thể có vận đơn trả sau giao. Bản đầu giao outbound một lần; tạo reverse không phải giao thêm một đợt hàng bán.

Nếu COD đã thu nhưng chưa chuyển về mà khách được duyệt trả, cửa hàng vẫn phải ghi khoản phải hoàn; không xóa khoản phải thu đối tác. Tài khoản nhận tiền hoàn COD lưu riêng dưới kiểm soát truy cập, có xác nhận khách, không gửi qua log hoặc trường chat công khai.

## Hạ tầng bền vững và Reporting

Mỗi service có outbox_messages, inbox_messages, idempotency_keys, audit_logs theo nhu cầu. Idempotency scope `(actor_id, route, key)` UNIQUE, lưu request_hash, state, response/status, expires_at. Khác payload cùng key trả 409. Với tiền/kho, operation reference tồn tại dài hơn cache idempotency; không dựa cache TTL để tránh thu lại.

Reporting: order_facts, order_item_facts, payment_facts, refund_facts, stock_movement_facts, receipt_facts, shipment_facts, cod_settlement_facts, projection_checkpoints. Upsert theo ID/version nguồn. Báo cáo tồn một thời điểm tính từ ledger/snapshot đã đối soát; không lấy tồn hiện tại rồi gọi là tồn cuối kỳ quá khứ.

Index tối thiểu: orders(customer_id,created_at), orders(status,created_at), receipts(supplier_id,created_at), movements(product_id,occurred_at), shipment_events(shipment_id,occurred_at), attempts(status,updated_at), outbox(status,next_attempt_at), return_requests(order_id,status), messages(conversation_id,sequence).

## Migration và dữ liệu mẫu

1. Dùng TypeORM/mysql2 và migration theo từng schema (tài liệu 10); baseline các bảng hiện có, không xóa dữ liệu ngoài phạm vi.
2. Chuyển quantity INT sang DECIMAL, bổ sung schema mới; backfill mã và trường bắt buộc.
3. Vai trò `staff` cũ không tự ánh xạ quyền cao; dữ liệu demo được seed lại trong DB dev cô lập hoặc migration có danh sách ánh xạ rõ.
4. Đơn `received` cũ không giả là đã thu/giao: đánh dấu legacy và chỉ đọc hoặc loại khỏi DB test mới theo quyết định chuyển đổi.
5. Seed ADMIN/OWNER qua secret đầu vào, ép đổi mật khẩu; không commit mật khẩu mặc định production.
6. Tồn đầu kỳ ghi opening movement, không chỉ UPDATE balance.
7. Test migrate fresh + migrate từ baseline + restore backup. Migration forward có kế hoạch khôi phục; không dùng rollback xóa ledger tiền/kho.
