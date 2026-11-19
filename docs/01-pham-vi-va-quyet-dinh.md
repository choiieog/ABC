# Phạm vi và quyết định

## Yêu cầu đã chốt

| Mã | Quyết định |
| --- | --- |
| D01 | Chỉ bán hàng trực tuyến; không có bán tại quầy hoặc lập đơn bán thủ công cho nhân viên bán hàng. |
| D02 | Có đúng các vai trò ADMIN, OWNER, WAREHOUSE, CUSTOMER; chủ cửa hàng trực tiếp quản lý bán hàng. |
| D03 | Tích hợp thanh toán ngân hàng/cổng thanh toán trên web. |
| D04 | Có COD qua đơn vị giao hàng; tiền mặt/chuyển khoản khi nhận hàng do đối tác hỗ trợ và thu. |
| D05 | Tích hợp bên thứ ba giao hàng. Nhân viên kho chuẩn bị và bàn giao; không có vai trò giao hàng nội bộ. |
| D06 | Mỗi đơn thanh toán đầy đủ một lần; không công nợ, đặt cọc hoặc thanh toán một phần. Nhiều lần thử không đồng nghĩa nhiều khoản thu hợp lệ. |
| D07 | Người dùng giao cho việc thiết kế quy trình hủy phù hợp nghiệp vụ. Chính sách đề xuất được ghi riêng dưới đây. |
| D08 | Phí giao phải hiển thị khi đặt hàng; một đơn giao outbound một lần. |
| D09 | Có giá khuyến mãi sản phẩm và mã giảm theo %/số tiền; tối đa một mã/đơn, không áp mã trên dòng đã khuyến mãi. |
| D10 | Có chat tư vấn và trao đổi trả hàng; OWNER duyệt trả sau trao đổi. |
| D11 | Đã bàn giao thì không được hủy đơn. Trả sau giao là nghiệp vụ riêng, không phải hủy. |
| D12 | Trong 5 ngày sau khi đối tác báo đã giao, khách xác nhận thành công hoặc mở yêu cầu trả; quá hạn tự hoàn tất nếu không có tranh chấp. Trả một số dòng được hỗ trợ, hoàn sau kiểm hàng, chưa đổi hàng trực tiếp. |
| D13 | Có đánh giá trên trang sản phẩm. Thiết kế đề xuất ràng buộc người mua thật, sao/nội dung/ảnh, OWNER phản hồi và ẩn vi phạm có lý do. |
| D14 | Đồng ý mốc thanh toán online 15 phút và OWNER xác nhận COD 24 giờ. |
| D15 | Người dùng ủy quyền chọn đối tác: chọn VNPAY và GHN sau đối chiếu tài liệu chính thức; production phụ thuộc tài khoản và khả năng phục vụ thực. |

Kế thừa đề bài: một cửa hàng/một kho, VND, web tiếng Việt, hiển thị UTC+7, khách xem/thêm giỏ khi chưa đăng nhập nhưng phải đăng nhập để đặt hàng, không làm việc ngoại tuyến. Không tự mở rộng thành nhiều cửa hàng/multi-tenant.

## Các câu hỏi đã được giải quyết

| Mã | Câu hỏi | Ảnh hưởng |
| --- | --- | --- |
| Q01 | Người dùng ủy quyền lựa chọn; dùng VNPAY + GHN. | Xem tài liệu 09 |
| Q02 | Có giảm giá, chat, trả sau giao, đánh giá; giao một lần. Thuế/quy đổi chưa được yêu cầu, giữ thiết kế cơ sở chưa có. | Xem D08–D13 và tài liệu 08 |
| Q03 | Hiển thị phí khi đặt hàng. | Quote trước tạo đơn/thu tiền |
| Q04 | Không hủy sau bàn giao; trả sau giao cần chat và OWNER duyệt. | Không có luồng khách chặn giao để hủy |
| Q05 | Chọn các mốc đề xuất 15 phút/24 giờ. | Cấu hình deadline có snapshot |

Các lựa chọn đã đủ để bắt đầu thiết kế/code nội bộ. Trước tích hợp thật phải có tài khoản sandbox, địa chỉ kho, dữ liệu đóng gói và xác minh dịch vụ vận chuyển cho sản phẩm thực tế. Chưa có các đầu vào này không được giả lập thành giao dịch production thành công.

## Quyết định thiết kế đề xuất

- ADMIN phụ trách vận hành/cấu hình và tài khoản OWNER; không có mặc định quyền sửa tiền, kho hay đơn. OWNER không tự cấp ADMIN.
- OWNER quản lý nhân viên kho. Có thể có nhiều tài khoản OWNER của cùng một cửa hàng nếu người dùng cần, không tạo thêm cửa hàng.
- Đơn online đã thu tiền vẫn chờ OWNER xác nhận; nếu không thể phục vụ, hủy và hoàn đủ. Phải thông báo rõ trên web và chốt SLA xác nhận đơn trả trước trước vận hành.
- Tổng trả = tiền hàng gốc - giảm sản phẩm - giảm mã + phí giao khách chịu. Chưa áp dụng thuế riêng. Số tiền giữ cố định sau đặt; không tăng phí đơn đã thu.
- Chỉ nhận đơn có thể giao trọn một lần; không cho sửa sản phẩm/số tiền sau đặt. Khách hủy và đặt lại trước bàn giao nếu cần.
- Giỏ hàng khách vãng lai lưu local; khi đăng nhập, gộp giỏ theo sản phẩm và kiểm tra lại giá/tồn. Giỏ không giữ hàng.
- Giá, phí và tồn phải kiểm tra server-side; payload frontend không quyết định tiền.
- Đơn vị cơ sở có thể là kg/m/m³ với số lượng thập phân; “một đơn vị” không có nghĩa chỉ cho số nguyên. Cần cấu hình bước số lượng tối thiểu cho từng sản phẩm.
- Hủy trước bàn giao hoàn toàn bộ khoản đã thu. Sau bàn giao không hủy; trả sau giao qua case chat theo tài liệu 08. Phí phát sinh không tự khấu trừ khi chưa có chính sách công bố/xác nhận.
- Hàng giao thất bại/khách từ chối là hoàn vận chuyển, khác với trả hàng sau khi đã nhận. Cả hai đều phải kiểm hàng trước cộng kho.
- COD được hoàn tất nghiệp vụ bán khi giao và thu thành công; đối soát tiền đối tác là chu trình riêng.

## Chính sách cần hoàn thiện trước vận hành

1. Khu vực phục vụ; trọng lượng/kích thước tối đa; hàng rời, hàng dễ vỡ, phương tiện bốc dỡ, phụ phí lên tầng và giao công trình.
2. Giờ làm việc và SLA xác nhận đơn trả trước; cách xử lý quá SLA.
3. Thời hạn giữ đơn đã xác nhận chờ lấy hàng; ngoại lệ chờ đối tác không tự giải phóng hàng.
4. Số lần giao lại, ai trả phí giao thất bại/hoàn vận chuyển.
5. Thời gian hoàn tiền hiển thị theo đối tác thực tế; không hứa hoàn tức thì.
6. Quyền điều chỉnh kho: đề xuất WAREHOUSE lập kiểm kê, OWNER duyệt, hệ thống áp dụng một lần.
7. Tiêu chí báo cáo: doanh số hàng đã giao, đơn hoàn tất, giảm giá, trả hàng và tiền thực thu/hoàn/đối soát là các chỉ số riêng; không gắn nhãn “lợi nhuận” khi chưa có phương pháp giá vốn.

## Ngoài phạm vi đề xuất

Bán tại quầy, nhân viên bán hàng, giao hàng nội bộ, nhiều kho, chuyển kho, công nợ, trả góp, đặt cọc, thu từng phần, kế toán tổng hợp, giao outbound nhiều đợt, đổi trực tiếp sang sản phẩm khác. Thuế tách riêng và quy đổi đơn vị chưa được yêu cầu; thiết kế bản đầu dùng một đơn vị cơ sở/SKU. Trả hàng sau giao, chat, khuyến mãi và đánh giá nằm trong phạm vi.
