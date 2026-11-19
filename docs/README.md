# Hồ sơ chuẩn bị triển khai XD Manager

Ngày lập: 13/11/2026. Đây là đặc tả thiết kế trước triển khai, không phải mô tả tính năng đã chạy.

Nguồn: `D:/hoc_ky_7/Kien_truc_huong_dv/Mô tả bài toán.docx`, các điều chỉnh trực tiếp của người dùng trong cuộc trao đổi và khảo sát mã nguồn hiện tại. Khi có mâu thuẫn, quyết định trực tiếp của người dùng được ưu tiên.

## Thứ tự đọc

1. [Phạm vi và quyết định](01-pham-vi-va-quyet-dinh.md): yêu cầu đã chốt, câu hỏi đang chờ, quy tắc đề xuất.
2. [Chức năng và phân quyền](02-chuc-nang-va-phan-quyen.md): yêu cầu có mã, quyền và giao diện.
3. [Quy trình và trạng thái](03-quy-trinh-va-trang-thai.md): luồng thành công, hủy, lỗi và phục hồi.
4. [Kiến trúc và tích hợp](04-kien-truc-va-tich-hop.md): dịch vụ, giao tiếp, bảo mật và hợp đồng đối tác.
5. [Thiết kế dữ liệu](05-thiet-ke-du-lieu.md): bảng, trường, ràng buộc và migration.
6. [Hợp đồng API](06-hop-dong-api.md): tuyến API, cấu trúc dữ liệu và lỗi.
7. [Backlog và nghiệm thu](07-backlog-va-nghiem-thu.md): thứ tự code, tiêu chí hoàn thành, kịch bản kiểm thử và triển khai.
8. [Khuyến mãi chat trả hàng đánh giá](08-khuyen-mai-chat-tra-hang-danh-gia.md): yêu cầu bổ sung, cửa sổ 5 ngày và thiết kế chi tiết.
9. [Đối tác và đầu vào](09-doi-tac-va-dau-vao.md): VNPAY, GHN, nguồn chính thức và những thông tin cần khi tích hợp.
10. [Sơ đồ và quyết định kỹ thuật](10-so-do-va-quyet-dinh-ky-thuat.md): ERD, sơ đồ trạng thái, cấu trúc code và bước bắt đầu.

## Trạng thái quyết định

- **Đã chốt:** người dùng yêu cầu trực tiếp; dùng làm cơ sở triển khai.
- **Đề xuất:** lựa chọn thiết kế có thể triển khai sau khi rà soát; không được hiểu là yêu cầu gốc đã xác nhận.
- **Chờ trả lời:** ảnh hưởng nghiệp vụ hoặc phụ thuộc đối tác; chưa triển khai phần phụ thuộc.

Đã cập nhật câu trả lời: giao một lần, báo phí trước đặt, giảm sản phẩm + một mã không cộng dồn trên dòng khuyến mãi, chat, trả trong 5 ngày có OWNER duyệt, đánh giá trên sản phẩm, không hủy sau bàn giao, thời hạn online 15 phút/COD 24 giờ. Chọn VNPAY và GHN theo ủy quyền. Những thông số chi tiết do người thiết kế đề xuất vẫn được ghi rõ trong tài liệu, có thể thay đổi bằng cấu hình/quyết định mới.

## Hiện trạng đã kiểm tra

- Có Angular storefront/admin portal, Gateway NestJS và 7 dịch vụ Identity, Catalog, Inventory, Sales, Shipping, Supply, Reporting.
- Sales lưu đơn trong `Map`, trạng thái `received`; chưa có luồng thanh toán, giữ kho hoặc kiểm tra quyền trên các API đơn đã khảo sát.
- Gateway hiện chuyển tiếp một tập GET/POST; chưa chuyển query string vào URL đích, chưa chuyển danh tính đã xác thực, chưa hỗ trợ đầy đủ PATCH/DELETE/webhook.
- Vai trò mẫu là `admin`, `staff`, chưa đúng 4 vai trò đã chốt.
- DDL hiện có chỉ là nền tảng; tồn kho dùng INT, đơn chưa có khách/người nhận/phí vận chuyển, chưa có Payment/Customer schema.
- Chưa có kết nối DB trong luồng Sales đã khảo sát; file entity TypeScript không phải bằng chứng có persistence.

Không coi bộ DDL cũ hoặc dữ liệu demo là đặc tả cuối. Không thay đổi database đang dùng bằng cách chạy lại CREATE TABLE IF NOT EXISTS; phải có migration có kiểm soát.

## Điều kiện sẵn sàng code

- Với mỗi luồng: có FR, quyền, trạng thái, bảng dữ liệu, API và kịch bản lỗi tương ứng.
- Các quyết định chờ trả lời có chủ sở hữu và không bị thay bằng giả định ngầm.
- Dùng TypeORM + mysql2 + migration theo lựa chọn kỹ thuật tại tài liệu 10; không dùng nhiều cơ chế migration song song.
- Có môi trường MySQL thử nghiệm, dữ liệu seed và thông tin cấu hình mẫu không chứa bí mật.
- Kiểm thử thực với sandbox đối tác trước khi cho phép giao dịch tiền/hàng thật.

## Hướng dẫn làm việc nhóm

[11. Cấu trúc scaffold, cách chạy từng service và phân công 5 người](11-huong-dan-phat-trien-nhom.md). Cấu trúc đã được bổ sung; nghiệp vụ trong tài liệu 01–10 vẫn là thiết kế đích, chưa được triển khai đầy đủ.
