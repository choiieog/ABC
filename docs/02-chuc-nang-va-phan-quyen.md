# Chức năng và phân quyền

Các mã dưới đây là mã triển khai mới, không thay thế số FR gốc. Cần duy trì liên kết FR gốc trong backlog khi sửa đặc tả gốc.

## Yêu cầu chức năng

| Mã | Nội dung | Tiêu chí nghiệm thu chính |
| --- | --- | --- |
| AUTH01 | Đăng ký CUSTOMER | Không thể tự gửi role OWNER/ADMIN/WAREHOUSE; định danh đăng nhập duy nhất. |
| AUTH02 | Đăng nhập/đăng xuất/đổi mật khẩu | Kiểm tra hash mật khẩu, phiên hết hạn/thu hồi; khóa tài khoản có hiệu lực ở yêu cầu kế tiếp. |
| AUTH03 | Quản lý OWNER/WAREHOUSE | ADMIN quản OWNER; OWNER quản kho; không nâng quyền ngang qua sửa profile. |
| CAT01 | Danh mục, sản phẩm, giá, ảnh | Mã duy nhất; không xóa hàng có giao dịch; sản phẩm ngừng bán không được đặt mới. |
| CAT02 | Tra cứu công khai | Tìm/lọc/phân trang; chỉ trả dữ liệu được công bố, không trả giá nhập. |
| CUS01 | Hồ sơ và địa chỉ | CUSTOMER chỉ quản hồ sơ của mình; thay đổi địa chỉ không sửa snapshot đơn cũ. |
| SUP01 | Nhà cung cấp và hàng cung ứng | Bảo toàn lịch sử khi ngừng hợp tác. |
| SUP02 | Phiếu nhập dự kiến/thực nhận/xác nhận | Số thực nhận hợp lệ, cộng kho một lần, có trạng thái chờ cập nhật kho khi lỗi. |
| INV01 | Tồn thực tế/giữ/khả dụng/lịch sử | Chỉ Inventory thay đổi tồn; không xuất vượt; không giữ vượt tồn. |
| INV02 | Kiểm kê và điều chỉnh | Người lập và người duyệt được lưu; không áp dụng lại; kiểm soát giao dịch đồng thời. |
| INV03 | Cảnh báo thấp và tồn đầu kỳ | Tồn đầu kỳ có chứng từ; không sửa số tồn trực tiếp từ màn hình sản phẩm. |
| CART01 | Giỏ vãng lai và khách đăng nhập | Không giữ kho; khi checkout kiểm tra lại toàn bộ. |
| ORD01 | Checkout và tạo đơn online | Có phí giao hợp lệ, snapshot, khóa chống trùng, giữ hàng hoặc trả lỗi rõ. |
| ORD02 | OWNER xác nhận/xem đơn | Không sửa giá/sản phẩm đơn đã đặt; chỉ chuyển trạng thái hợp lệ. |
| ORD03 | Khách theo dõi đơn của mình | Không tra cứu được đơn khác chỉ bằng UUID hoặc số điện thoại. |
| ORD04 | Yêu cầu hủy | Phụ thuộc giai đoạn; xử lý riêng tiền, giữ hàng và vận chuyển. |
| PAY01 | Online toàn phần | Xác minh chữ ký, mã đơn, số tiền, tiền tệ, mã merchant; thông báo lặp không thu/ghi nhận lại. |
| PAY02 | Thất bại/hết hạn/đến muộn | Có đối soát; không tự phục hồi đơn đã hủy; trả trạng thái chưa xác định khi cần. |
| PAY03 | Hoàn tiền | OWNER cho phép; không hoàn vượt đã thu trừ đã hoàn; theo dõi kết quả bất đồng bộ. |
| SHIP01 | Báo phí/khả năng giao | Kiểm tra địa chỉ, hàng, trọng lượng/kích thước; phí có hạn dùng. |
| SHIP02 | Vận đơn/bàn giao/hành trình | Chống tạo trùng; xuất kho một lần theo bàn giao; lưu bằng chứng và mã ngoài. |
| SHIP03 | Giao thất bại/hoàn vận chuyển | Không cộng tồn khi chỉ có thông báo đang hoàn; kiểm hàng thực nhận. |
| COD01 | Thu và đối soát COD | Tách khách đã trả với cửa hàng đã nhận; theo dõi chênh lệch và chứng từ. |
| REP01 | Báo cáo/xuất tệp | Bộ lọc và thời điểm chốt số liệu rõ; đối chiếu được chứng từ nguồn. |
| OPS01 | Nhật ký/sao lưu/phục hồi | Không log token/bí mật; lưu thao tác tiền/kho/quyền; thử khôi phục thành công. |
| PROMO01 | Giá khuyến mãi và một mã/đơn | Không áp mã vào dòng đã khuyến mãi; giới hạn dùng kiểm trong transaction. |
| CHAT01 | Chat khách–OWNER, ảnh và liên kết sản phẩm/đơn | Message bền vững, ownership, gửi lặp không trùng, tải lại/reconnect không mất. |
| RET01 | Xác nhận nhận hoặc yêu cầu trả trong 5 ngày | Chat trước, OWNER duyệt, không tự hoàn tất case đang tranh chấp. |
| REV01 | Đánh giá hiển thị trên sản phẩm | Người mua hợp lệ, 1–5 sao/nội dung/ảnh; OWNER phản hồi/ẩn có lý do. |

## Ma trận quyền

Quy ước: “của mình” luôn kiểm tra chủ sở hữu trên backend. ADMIN không mặc định kế thừa OWNER. Mặc định từ chối mọi quyền chưa cấp.

| Hành động | ADMIN | OWNER | WAREHOUSE | CUSTOMER |
| --- | --- | --- | --- | --- |
| Đọc danh mục công khai | Có | Có | Có | Có |
| Quản lý sản phẩm/giá | Không | Có | Chỉ xem dữ liệu cần cho kho | Không |
| Quản lý tài khoản OWNER | Có | Không | Không | Không |
| Quản lý tài khoản kho | Không | Có | Không | Không |
| Quản lý cấu hình tích hợp | Có, bí mật được che | Xem trạng thái vận hành | Không | Không |
| Sửa hồ sơ cá nhân/địa chỉ | Của mình | Của mình | Của mình | Của mình |
| Xem hồ sơ khách | Không mặc định | Có theo công việc | Chỉ thông tin giao của đơn được xử lý | Của mình |
| Nhà cung cấp | Không | Quản lý | Xem để nhập hàng | Không |
| Lập/sửa/xác nhận nhập | Không | Có | Có | Không |
| Xem tồn, lịch sử kho | Không | Có | Có | Chỉ khả dụng đã công bố |
| Lập kiểm kê | Không | Có | Có | Không |
| Duyệt điều chỉnh | Không | Có | Không | Không |
| Đặt đơn | Không | Không | Không | Có |
| Xem đơn | Không mặc định | Tất cả cửa hàng | Phần phục vụ chuẩn bị/giao | Của mình |
| Xác nhận/từ chối đơn | Không | Có | Không | Không |
| Yêu cầu hủy | Không | Có | Không | Của mình theo điều kiện |
| Duyệt hủy/hoàn tiền | Không | Có | Không | Không |
| Chuẩn bị/bàn giao/nhận hàng hoàn | Không | Có | Có | Không |
| Đối soát COD | Không | Có | Không | Không |
| Báo cáo tài chính/kinh doanh | Không mặc định | Có | Không | Không |
| Trạng thái hệ thống/log kỹ thuật | Có | Chỉ lỗi nghiệp vụ liên quan | Không | Không |
| Quản lý khuyến mãi/mã giảm | Không | Có | Không | Chỉ sử dụng hợp lệ |
| Chat tư vấn/xử lý trả | Không mặc định | Trả lời khách cửa hàng | Không mặc định | Hội thoại của mình |
| Yêu cầu trả/xác nhận nhận | Không | Duyệt case trả | Chỉ nhận/kiểm theo case được duyệt | Đơn của mình trong hạn |
| Đánh giá sản phẩm | Không | Phản hồi/ẩn vi phạm có audit | Không | Theo sản phẩm đã mua hợp lệ |

ADMIN/OWNER không được khóa tài khoản quản trị cuối cùng gây mất quyền truy cập; cần cơ chế khôi phục bootstrap có ghi nhận. Nhật ký nghiệp vụ không phải CRUD cho người dùng.

## Danh sách màn hình

### Storefront

Trang sản phẩm/tìm kiếm/lọc; chi tiết; giỏ; đăng ký/đăng nhập/đổi mật khẩu; địa chỉ; checkout gồm báo phí và tổng tiền; chuyển sang đối tác thanh toán; trang kết quả chờ backend xác nhận; danh sách/chi tiết đơn; yêu cầu hủy; theo dõi hoàn tiền và giao hàng. Giỏ và trang kết quả phải giữ được ngữ cảnh sau tải lại.

### OWNER

Tổng quan; sản phẩm/danh mục/đơn vị; nhà cung cấp/phiếu nhập; tồn/giữ hàng/biến động; kiểm kê và duyệt; khách; đơn chờ xác nhận; yêu cầu hủy; thanh toán và ngoại lệ; hoàn tiền; vận đơn; hàng hoàn; đối soát COD; báo cáo/xuất tệp; tài khoản kho. Màn hình hàng đợi ngoại lệ phải cho thấy việc gì chưa xong và hành động an toàn tiếp theo.

### WAREHOUSE

Nhập dự kiến/thực nhận; tồn; kiểm kê; danh sách đơn đã xác nhận; bắt đầu chuẩn bị; sẵn sàng; bàn giao; nhận hàng hoàn và biên bản kiểm tra. Không có nút “đã thanh toán”, “hoàn tiền” hoặc sửa giá.

### ADMIN

Quản lý OWNER; cấu hình tích hợp được che bí mật; health/readiness; nhật ký hệ thống; kết quả sao lưu/khôi phục. Không hiển thị dữ liệu khách đầy đủ nếu không cần.

Mọi màn hình có trạng thái tải, dữ liệu trống, lỗi, không đủ quyền, xác nhận thao tác quan trọng và ngăn gửi lặp. Khóa nút chỉ hỗ trợ trải nghiệm, không thay cho khóa chống trùng ở server.

Bổ sung giao diện: chat nổi trên storefront + hộp thư OWNER; khuyến mãi/mã giảm; xác nhận nhận hàng/yêu cầu trả; chi tiết case và ảnh kiểm hàng; đánh giá/sao/ảnh trên trang sản phẩm và form từ đơn hợp lệ; OWNER quản lý phản hồi/ẩn đánh giá. Không có vai trò CSKH mới; OWNER là người tư vấn.
