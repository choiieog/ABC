# Khuyến mãi chat trả hàng và đánh giá

Tài liệu này tích hợp các yêu cầu bổ sung người dùng đã chốt. Các lựa chọn chi tiết được ghi “đề xuất” để có thể điều chỉnh trước module tương ứng; không phải tính năng đã có.

## Ranh giới dịch vụ

- Catalog sở hữu giá khuyến mãi sản phẩm và đánh giá (module riêng `promotions`, `reviews`). Không tạo service mới cho mỗi bảng.
- Sales sở hữu coupon, lượt dùng, phân bổ giảm, yêu cầu trả sau giao và xác nhận nhận hàng. Có thể tách sau khi nghiệp vụ lớn.
- Customer sở hữu hội thoại và tin nhắn hỗ trợ; module chat phục vụ CUSTOMER–OWNER. Như vậy tổng vẫn là 9 dịch vụ nghiệp vụ và Gateway, chưa cần thêm Chat/Review Service.
- Payment hoàn tiền theo case được duyệt; Inventory nhận lại hàng; Shipping quản vận đơn reverse nếu đối tác hỗ trợ. Không cập nhật trạng thái hoàn qua tin nhắn tự do.

## Giảm giá

Đã chốt: giá khuyến mãi sản phẩm và mã phần trăm/số tiền; tối đa một mã/đơn; không cộng mã lên dòng đã có giá khuyến mãi.

Quy tắc đề xuất để code:

1. Giá khuyến mãi có thời gian `[start,end)`, nhỏ hơn giá niêm yết, không âm; một sản phẩm chỉ một chương trình có hiệu lực. Không chồng khoảng thời gian (khóa product khi tạo/sửa).
2. Coupon có mã chuẩn hóa uppercase, loại PERCENT/FIXED, giá trị, trần giảm nếu %, mức đơn tối thiểu, thời gian, tổng lượt, lượt/khách, trạng thái. Không giảm phí giao trong bản đầu.
3. Mức tối thiểu và cơ sở tính coupon tính trên tổng các dòng không khuyến mãi sau làm tròn. Nếu giỏ chỉ có hàng khuyến mãi, mã không đủ điều kiện; không âm thầm bỏ mã.
4. Giảm coupon tối đa bằng giá trị phần hàng đủ điều kiện. FIXED không vượt cơ sở; PERCENT trong (0,100], làm tròn về đồng, áp trần nếu có.
5. Phân bổ coupon theo tỷ trọng giá trị dòng đủ điều kiện. Dùng largest-remainder để tổng phân bổ chính xác bằng tổng giảm; tie-break theo line ID ổn định. Lưu snapshot theo dòng và phần đơn vị để hoàn một phần không vượt tiền đã trả.
6. Quote chỉ kiểm tra; tạo đơn phải claim lượt coupon trong transaction Sales. Chưa có stock thì bù RELEASED. RESERVED tính vào hạn mức, tránh hai khách lấy lượt cuối.
7. Coupon usage: RESERVED → COMMITTED khi OWNER xác nhận; hủy/hết hạn trước xác nhận giải phóng. Đề xuất sau COMMITTED không trả lại lượt kể cả hoàn hàng, tránh lạm dụng; cần hiển thị chính sách.
8. Giá/giảm thay đổi trong lúc quote chưa tạo đơn: yêu cầu quote lại. Đơn đã tạo dùng snapshot, không tính lại khi chiến dịch hết hạn.

Ví dụ: hàng A gốc 200.000 giảm sản phẩm còn 180.000; hàng B 100.000 không khuyến mãi; mã 10% chỉ giảm B 10.000; phí giao 30.000; khách trả 300.000. Nếu hoàn B đủ, tiền hàng tối đa hoàn 90.000, không dùng giá mới.

Bảng Catalog: `product_promotions(id, product_id, sale_price, starts_at, ends_at, status, version)`. Bảng Sales: `coupons(id, normalized_code UNIQUE, type, value, max_discount, min_eligible_subtotal, starts_at, ends_at, total_limit, per_customer_limit, status, version)`; `coupon_usages(id, coupon_id, customer_id, order_id UNIQUE, status, reserved_at, committed_at)`; `coupon_customer_counters(coupon_id,customer_id,reserved_count,committed_count)` PK kép. Khóa counter tổng và khách theo thứ tự thống nhất; không đếm rồi insert thiếu khóa.

## Chat

Chat tư vấn trên web, không tích hợp mạng xã hội ở bản đầu. Đề xuất yêu cầu đăng nhập để gửi/lưu hội thoại; vãng lai có thể xem thông tin hỗ trợ, không có chat ẩn danh chưa định danh.

- Một hội thoại chung theo khách và có thể mở case theo đơn/sản phẩm. Message có type TEXT/IMAGE/ORDER_REFERENCE/RETURN_SYSTEM_EVENT, actor, client_message_id, sequence, created_at.
- Tin nhắn được ghi DB trước khi phát realtime/ACK. WebSocket chỉ là kênh đẩy; REST phân trang cursor là nguồn khôi phục.
- Xác thực handshake, kiểm quyền join từng room/send/read; không dùng conversationId tự khai để vào room khác. Thu hồi phiên phải ngắt/chặn socket tương ứng.
- UNIQUE(conversation_id,sender_id,client_message_id) chống gửi lặp. Sequence tăng ổn định; read cursor theo participant. Reconnect tải sau lastSequence.
- Ảnh upload giới hạn loại/kích thước, quét/kiểm an toàn theo hạ tầng, private object key; URL ký hạn ngắn chỉ cấp cho thành viên. Đề xuất tối đa 5 ảnh/message, mỗi ảnh 5 MB, text 4.000 ký tự.
- OWNER trả lời trực tiếp; có unread, trạng thái OPEN/CLOSED, lọc theo đơn/case. Khách gửi lại thì có thể mở lại hội thoại. Không có bot tự duyệt trả/hoàn tiền.
- Message thông thường không sửa dữ liệu đơn; thao tác “tạo yêu cầu trả từ cuộc chat” sinh bản ghi có mã, các dòng hàng và lý do. Quyết định duyệt/từ chối tạo system message, không chỉ gõ “đồng ý” rồi tự coi đã duyệt.

Bảng Customer: `conversations(id, customer_id, order_id nullable, subject_type, status, last_message_at)`; `conversation_participants(conversation_id,user_id,last_read_sequence)`; `messages(id,conversation_id,sequence,sender_id,client_message_id,type,body,created_at)`; `message_attachments(id,message_id,object_key,mime,size)`; `case_links(conversation_id,return_request_id)`.

## Sau giao và cửa sổ 5 ngày

1. Shipping nhận sự kiện giao đã được xác minh; lưu `carrier_delivered_at`. Sales vào DELIVERED_AWAITING_ACCEPTANCE và `acceptance_deadline = carrier_delivered_at + 120 giờ`. Khách phải thấy deadline theo UTC+7.
2. Khách có hai hành động: **Xác nhận nhận hàng thành công** hoặc **Trao đổi/yêu cầu trả hàng**. “Yêu cầu trả” chưa có nghĩa OWNER đã duyệt hoàn.
3. Xác nhận thành công chuyển COMPLETED; đề xuất việc xác nhận đóng cửa sổ trả thông thường, giao diện cảnh báo rõ. Khi chưa xác nhận, khách có 5 ngày để mở yêu cầu.
4. Hết 5 ngày tự COMPLETED nếu không có yêu cầu/case tranh chấp active. Chat tư vấn chung không tự chặn auto-complete; phải gắn case của đơn. Khi khách chọn “trao đổi trả hàng”, tạo case timestamp ngay để tránh mất quyền trong lúc chờ OWNER trả lời.
5. Có case trong hạn thì ngừng auto-complete đến kết quả. OWNER duyệt hoặc từ chối có lý do; từ chối cho khách xem lý do và tiếp tục trao đổi. Không tự coi chat bị đóng là khách đồng ý từ chối.
6. Đề xuất mỗi đơn một case trả active; hỗ trợ một số dòng/số lượng. Một case có thể chứa nhiều dòng, nhưng tổng trả không vượt mua trừ đã trả.
7. Với case từ chối còn tranh chấp: giữ trạng thái xử lý, OWNER ghi nhận quyết định kết thúc và bằng chứng; không có vai trò trọng tài mới.

Nếu webhook giao đến muộn, đối soát thời điểm thật trước đặt deadline. Nếu timestamp bất hợp lý/khách không thể có đủ thời gian thao tác, đưa OWNER xử lý gia hạn có audit; không âm thầm backdate đóng quyền.

## Quy trình trả được duyệt

1. Khách gửi lý do, dòng/số lượng, ảnh trong chat gắn đơn; Sales ghi REQUESTED.
2. OWNER xem cuộc trao đổi, duyệt số lượng, cách gửi lại, dự kiến tiền/chi phí và hướng dẫn; lưu decision snapshot. Không duyệt chỉ bằng nội dung chat tự do.
3. Tạo vận đơn reverse qua adapter nếu hỗ trợ đúng dịch vụ; nếu không, OWNER đặt trên cổng đối tác và lưu mã/chứng từ, hiển thị rõ MANUAL_RETURN, không giả là đã gọi API.
4. Nhận hàng: WAREHOUSE kiểm tốt/hỏng/thiếu, ảnh và lý do. OWNER giải quyết chênh lệch. Chỉ hàng đủ điều kiện bán được Inventory cộng lại một lần.
5. OWNER xác nhận khoản hoàn cuối dựa trên số thực nhận được chấp nhận và snapshot giảm giá. Payment tạo refund theo case, không vượt phần còn có thể hoàn.
6. Online: hoàn qua VNPAY theo khả năng/điều kiện merchant. COD: chuyển khoản hoàn có kiểm chứng, mã tham chiếu và bằng chứng; không giả có giao dịch VNPAY để refund.
7. Sau hoàn tiền thành công và kết thúc xử lý hàng: đơn RETURNED_AFTER_DELIVERY hoặc COMPLETED_WITH_PARTIAL_RETURN. Case vẫn giữ lịch sử chat/kiểm hàng/quyết định.

Case status: REQUESTED → UNDER_REVIEW → APPROVED/REJECTED → AWAITING_RETURN → RETURN_IN_TRANSIT → INSPECTING → REFUND_PENDING → CLOSED. WITHDRAWN nếu khách rút trước phát sinh hoàn thực; không được rút để xóa tiền/hàng đã phát sinh. Có thể DISPUTED nếu chênh lệch cần xử lý.

Đề xuất phí: lỗi cửa hàng/hàng sai hoặc hỏng được xác nhận do khâu cung ứng thì cửa hàng chịu phí hợp lý; đổi ý chỉ được chấp nhận theo chính sách đã công bố. Không tự khấu trừ tiền nếu chưa thống nhất. Không đưa ra khẳng định pháp lý về quyền trả hàng; đây là thiết kế vận hành cần chủ cửa hàng công bố trước sử dụng.

Bảng Sales: `return_requests(id, order_id, conversation_id, requested_at, status, reason, decided_by, decision_at, decision_reason, expected_refund, approved_refund, shipping_policy_snapshot, version)`; `return_request_items(id,return_request_id,order_item_id,requested_qty,approved_qty,accepted_qty,allocated_paid_amount)`; `return_decisions`/status history append-only. Những khoản tiền được Payment quản, không chỉ lưu trong chat.

## Đánh giá trên sản phẩm

Đã chốt vị trí: hiển thị đánh giá trên trang sản phẩm. Đề xuất quyền tạo: CUSTOMER có dòng mua đã hoàn tất và còn lượng hàng được giữ lại sau trả; một đánh giá/order_item, tối đa một phản hồi chính thức OWNER. Chưa hoàn tất chỉ xem, không tạo.

- Sao nguyên 1–5, nội dung, ảnh tùy chọn; liên kết order_item phục vụ xác minh nhưng không công khai mã đơn/địa chỉ.
- Catalog nhận projection sự kiện hoàn tất/trả; lệnh tạo phải xác minh eligibility với Sales nếu projection chưa cập nhật. Không tin cờ verifiedPurchase từ frontend.
- Khách sửa đánh giá của mình, có version và lịch sử; đề xuất trong 30 ngày, ngoài hạn liên hệ OWNER. Đây là thông số thiết kế có thể đổi.
- OWNER phản hồi, không sửa sao/nội dung khách. Ẩn spam/PII/vi phạm có lý do/audit; không ẩn chỉ vì ít sao. Điểm trung bình tính trên đánh giá công khai hợp lệ, ghi verified purchase.
- Nếu đánh giá đã tồn tại trước một case ngoại lệ trả hàng, giữ lịch sử và cập nhật nhãn phù hợp; không xóa để làm tăng điểm.

Bảng Catalog: `reviews(id,product_id,customer_id,order_item_id UNIQUE,rating,body,status,verified_purchase,version,created_at,updated_at)`; `review_images`; `review_replies(review_id UNIQUE,owner_id,body,version)`; `review_moderation_logs(review_id,actor_id,action,reason,occurred_at)`.

## API bổ sung

| API sau /api/v1 | Quyền và quy tắc |
| --- | --- |
| POST/PATCH /product-promotions[/{id}] | OWNER; kiểm overlap |
| GET/POST /coupons; PATCH /coupons/{id} | OWNER; không lộ mã riêng qua public list |
| POST /checkout/quotes với couponCode | CUSTOMER; trả giảm theo dòng và lỗi đủ điều kiện |
| GET/POST /conversations; GET /conversations/{id}/messages?afterSequence= | CUSTOMER của mình, OWNER |
| POST /conversations/{id}/messages; POST /conversations/{id}/read | Thành viên, clientMessageId |
| POST /orders/{id}/acceptance | CUSTOMER của mình; version, không case active |
| POST /orders/{id}/return-requests | CUSTOMER; conversationId, lines, reason; ghi nhận trước deadline |
| POST /management/return-requests/{id}/approve hoặc /reject | OWNER, lý do/version |
| POST /management/return-requests/{id}/inspection | WAREHOUSE/OWNER; số lượng và bằng chứng |
| POST /management/return-requests/{id}/finalize-refund | OWNER; server tính cap |
| GET /products/{id}/reviews | Public; phân trang/điểm trung bình |
| POST /products/{id}/reviews; PATCH /reviews/{id} | CUSTOMER đủ điều kiện/của mình |
| POST /reviews/{id}/reply; POST /reviews/{id}/moderation | OWNER; moderation có lý do |

WebSocket đề xuất `/support` qua Gateway reverse proxy, sự kiện message.created, read.updated, case.updated; authorization giống REST. ACK có messageId/sequence; lỗi theo mã chuẩn, không broadcast dữ liệu chat ra mọi khách.
