# Quy trình và trạng thái

Đã chốt online 15 phút, xác nhận COD 24 giờ, outbound giao một lần, phí hiển thị khi đặt. Không hard-code; lưu deadline trên giao dịch và cấu hình chính sách có phiên bản. Sau khi đối tác báo giao, có cửa sổ 5 ngày xác nhận/đề nghị trả; xem quy trình mở rộng tại tài liệu 08.

## Trạng thái đơn

Trạng thái đơn không thay thế trạng thái tiền và vận chuyển.

| Trạng thái | Điều kiện vào | Chuyển tiếp |
| --- | --- | --- |
| CREATING | Đã lưu yêu cầu, đang xác minh/giữ hàng | AWAITING_PAYMENT, AWAITING_CONFIRMATION, CREATION_FAILED |
| AWAITING_PAYMENT | Online, đã giữ hàng, chưa thu | AWAITING_CONFIRMATION, CANCELLING, EXPIRING |
| AWAITING_CONFIRMATION | Online đã thu đủ hoặc COD đã đặt | CONFIRMED, CANCELLING, EXPIRING với COD |
| CONFIRMED | OWNER chấp nhận; hàng vẫn được giữ | PREPARING, CANCELLING |
| PREPARING | Kho bắt đầu; không có yêu cầu hủy đang chặn | READY_TO_SHIP, CANCELLING |
| READY_TO_SHIP | Đã đóng gói, vận đơn được tạo | HANDOVER_PENDING, CANCELLING |
| HANDOVER_PENDING | Đã ghi nhận bàn giao, đang chốt xuất kho | SHIPPING hoặc hàng đợi phục hồi |
| SHIPPING | Đã bàn giao và chốt xuất kho | DELIVERED_AWAITING_ACCEPTANCE, RETURNING nếu giao thất bại |
| RETURNING | Đối tác xác nhận hoàn vận chuyển | RETURNED |
| RETURNED | Kho đã kiểm nhận kết quả hàng hoàn | CLOSED_UNDELIVERED sau xử lý tiền |
| DELIVERED_AWAITING_ACCEPTANCE | Có bằng chứng giao; COD có bằng chứng thu; bắt đầu 5 ngày | COMPLETED hoặc RETURN_REQUESTED |
| COMPLETED | Khách xác nhận hoặc hết 5 ngày, không tranh chấp | Hoàn tất; đánh giá sản phẩm theo quyền |
| RETURN_REQUESTED | Khách mở case qua chat trước deadline | Đợi OWNER duyệt/từ chối; ngừng tự hoàn tất |
| RETURN_IN_PROGRESS | OWNER duyệt, đang nhận lại/kiểm hàng | RETURNED_AFTER_DELIVERY khi trả đủ; COMPLETED_WITH_PARTIAL_RETURN khi trả một phần và xử lý tiền xong |
| CANCELLING | Đang dừng vận đơn/giải phóng giữ, chưa chắc hoàn tất | CANCELLED khi hoàn tất phần hàng; tiền theo dõi riêng |
| CANCELLED | Chưa bàn giao và đã dừng xử lý hàng | Không khôi phục; tiền có thể REFUND_PENDING |
| EXPIRING | Worker chiếm quyền xử lý hết hạn, đang xác minh tiền/đóng đơn | EXPIRED hoặc chuyển chờ xác nhận nếu tiền hợp lệ đúng hạn |
| EXPIRED | Đã hết hạn và giải phóng giữ an toàn | Không khôi phục tự động |
| CREATION_FAILED | Không giữ đủ hàng/điều kiện checkout lỗi | Không thanh toán; đặt lại bằng yêu cầu mới |
| CLOSED_UNDELIVERED | Kết thúc giao không thành công, hàng/tiền đã xử lý | Trạng thái cuối |

Yêu cầu hủy là bản ghi riêng REQUESTED/APPROVED/REJECTED/EXECUTING/COMPLETED. Khi có REQUESTED hoặc đang hủy, chặn bắt đầu chuẩn bị/bàn giao cho đến quyết định. Sau bàn giao từ chối hủy, không tạo yêu cầu chặn giao để lách quy tắc. RETURNING trong vận chuyển dùng cho giao thất bại; trả sau giao dùng case riêng.

## Trạng thái các đối tượng khác

- Reservation: ACTIVE → CONSUMED khi xuất; ACTIVE → RELEASED khi hủy/hết hạn. Không giải phóng reservation đã CONSUMED.
- Payment attempt: CREATED/PENDING/UNKNOWN/SUCCEEDED/FAILED/EXPIRED. UNKNOWN có nghĩa chưa biết kết quả, không tương đương thất bại.
- Payment: UNPAID/PAID, kèm nguồn ONLINE/COD; hoàn tiền là ledger riêng, không xóa khoản thu gốc.
- Refund: REQUESTED/PROCESSING/UNKNOWN/SUCCEEDED/FAILED; tổng thành công và đang xử lý không vượt khoản có thể hoàn.
- Shipment: CREATING/UNKNOWN/WAITING_PICKUP/PICKED_UP/IN_TRANSIT/DELIVERED/DELIVERY_FAILED/RETURNING/RETURNED/CANCELLED. Trạng thái nguyên bản đối tác luôn được giữ cùng trạng thái chuẩn hóa.
- Receipt: DRAFT/CONFIRMING/CONFIRMED/CANCELLED. CONFIRMING không cho sửa dòng.
- Count: DRAFT/COUNTED/APPROVED/APPLYING/APPLIED/CANCELLED.

## Online

1. Khách xin quote; server lấy giá, kiểm tra bước số lượng, khả năng giao và phí. Quote có ID, version/hash giỏ, địa chỉ, thời hạn.
2. Khách xác nhận phương thức ONLINE và quote. Sales tạo CREATING trong transaction và ghi outbox lệnh giữ hàng.
3. Inventory giữ toàn bộ các dòng trong một transaction. Thiếu một dòng thì không giữ dòng nào. Sales chỉ mở thanh toán khi reservation thành công.
4. Payment tạo attempt; amount = tổng đơn bất biến. Trước khi tạo attempt mới phải xác định attempt cũ không còn khả năng thu hoặc xử lý theo giới hạn đối tác.
5. Khách sang trang đối tác; frontend quay về chỉ đọc kết quả backend, có thể hiển thị “đang xác minh”.
6. Webhook hợp lệ: Payment lưu sự kiện bền vững trước khi trả ACK; worker chuẩn hóa, chống trùng, ghi payment và outbox. Sales nhận thông báo chuyển AWAITING_CONFIRMATION.
7. OWNER xác nhận. Kho chuẩn bị, tạo vận đơn, bàn giao, xuất kho, theo dõi giao.
8. Không tự đóng đơn đã trả tiền vì SLA xác nhận quá hạn. Tạo cảnh báo cho OWNER và hàng đợi xử lý; nếu từ chối phục vụ phải hủy/hoàn.

Worker hết hạn không chỉ dựa vào đồng hồ local: chặn mở attempt mới, truy vấn giao dịch chưa rõ, kiểm tra deadline thực tế của đối tác. Nếu đối tác vẫn có thể thu sau thời gian giữ hàng, hết hạn đơn và đưa khoản đến muộn vào luồng hoàn; không bán lại hàng trong lúc vẫn hứa đơn được thực hiện.

## COD

1. Quote → tạo đơn → giữ kho → AWAITING_CONFIRMATION, không tạo thanh toán ngân hàng online.
2. OWNER xác nhận trước deadline đề xuất; chưa xác nhận đến hạn thì hệ thống chuyển EXPIRING và giải phóng giữ.
3. Vận đơn có cod_amount đúng tổng cần thu theo thỏa thuận. Xác định đối tác thu cả phí giao hay chỉ tiền hàng; không để phí giao bị thu hai lần.
4. Khi giao và thu được xác thực, ghi khoản PAID nguồn COD, chứng từ thu và DELIVERED_AWAITING_ACCEPTANCE trên đơn (shipment vẫn là DELIVERED).
5. Nhận bảng đối soát: số gross thu, phí, khoản khấu trừ khác, net nhận, ngày chuyển và tham chiếu ngân hàng. Payment quản ledger tiền; Shipping cung cấp dữ liệu logistics.
6. OWNER đối chiếu, đánh dấu MATCHED hoặc DISPUTED. Không coi net bằng gross nếu đối tác đã trừ phí. Sau giao đơn vẫn chờ khách xác nhận/hết 5 ngày; đối soát COD không quyết định thay xác nhận nhận hàng.

Không đưa chuyển khoản COD vào tài khoản cửa hàng ngoài luồng đối tác nếu chưa có hợp đồng nghiệp vụ riêng, tránh ghi nhận thu hai nơi.

## Hủy và hoàn tiền

| Giai đoạn | Quyền/quy trình | Kho | Tiền |
| --- | --- | --- | --- |
| Chưa PREPARING | Đề xuất khách tự hủy; OWNER được hủy với lý do | Giải phóng giữ một lần | Nếu đã thu thì tạo refund toàn phần |
| PREPARING/READY | Khách yêu cầu, OWNER duyệt; khóa bàn giao; hủy vận đơn và xác minh kết quả | Chưa xuất thì giải phóng giữ | Hoàn toàn phần trước bàn giao |
| HANDOVER_PENDING/SHIPPING | Đã ghi nhận bàn giao thì từ chối hủy; nếu chưa rõ phải xác minh trước quyết định | Không giải phóng lượng đã xuất | Không hoàn theo yêu cầu hủy không hợp lệ |
| RETURNING | Theo dõi về kho, không giả định đã nhận | Kiểm nhận số tốt/hỏng/thiếu | OWNER xác định khoản hoàn theo chính sách |
| DELIVERED_AWAITING_ACCEPTANCE | Trả qua chat trong 5 ngày và OWNER duyệt | Nhận/kiểm mới nhập tốt | Hoàn theo dòng được duyệt/kiểm; xem 08 |

Nếu webhook trả tiền đến khi đơn CANCELLED/EXPIRED/CREATION_FAILED: ghi khoản thu thực, cảnh báo và tạo refund cần xử lý; không tự hồi sinh đơn. Nếu vừa trả tiền vừa hủy: khóa/version đơn quyết định một chuyển hợp lệ; khoản thu vẫn ghi đầy đủ rồi hoàn nếu hủy thắng.

Kho nhận hoàn lập biên bản theo dòng: dispatched, received_good, received_damaged, missing. Tổng kiểm nhận không vượt lượng đã xuất trừ đã nhận trước. Chỉ received_good được cộng bán lại; hàng hỏng ghi nhận khu vực cách ly/log tổn thất, không tính khả dụng. Chênh lệch mở vụ việc đối soát, không xóa dấu vết.

## Nhập và kiểm kê

Nhập: Supply chốt snapshot thực nhận trong CONFIRMING, ghi outbox. Inventory cộng tồn + movement theo receipt_id trong một transaction có khóa duy nhất. Supply chuyển CONFIRMED khi nhận kết quả. Mất phản hồi: tra cứu kết quả lệnh hoặc gửi lại cùng operation_id, không cộng lần hai.

Kiểm kê đề xuất bản đầu: khóa nghiệp vụ kho trên các sản phẩm trong phiếu từ lúc lấy số hệ thống đến khi áp dụng/hủy; chặn giữ mới/nhập/xuất trong khoảng ngắn. Hàng đang bàn giao phải chốt trước. Không cho kết quả điều chỉnh thấp hơn reserved. Nếu muốn kho vẫn hoạt động khi đếm, phải thiết kế snapshot và đối chiếu movement theo thời điểm riêng trước khi code.

## Bảng phục hồi bắt buộc

| Sự cố | Cách phục hồi |
| --- | --- |
| Sales chết sau khi giữ hàng | Reservation gắn order_id/operation_id; worker đọc lại bước saga, không giữ lại lần hai |
| Tạo payment/vận đơn timeout | UNKNOWN; query bằng merchant reference trước khi tạo lại |
| Webhook lặp hoặc sai thứ tự | Inbox unique; so event time/version và truy vấn nguồn khi mâu thuẫn; không lùi trạng thái cuối |
| Đã bàn giao nhưng chưa chốt xuất | HANDOVER_PENDING; outbox retry xuất một lần, không cho giao dịch bán dùng hàng đang giữ |
| Refund timeout | UNKNOWN; đối soát trước retry, không gửi khoản hoàn thứ hai khác mã |
| Đối tác lỗi kéo dài | Backoff có giới hạn, cảnh báo và hàng đợi xử lý; không trả dữ liệu thành công giả |

Mọi chuyển quan trọng dùng optimistic version hoặc khóa hàng, kiểm tra điều kiện trong transaction và ghi lịch sử. Worker dùng lease/claim để nhiều instance không cùng xử lý một việc. Không giữ transaction DB trong khi chờ HTTP đối tác.
