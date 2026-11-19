# Đối tác và đầu vào triển khai

Đối chiếu tài liệu công khai chính thức ngày 13/11/2026. Người dùng ủy quyền lựa chọn, chưa đăng ký tài khoản hoặc ký hợp đồng thay người dùng.

## Thanh toán chọn VNPAY

VNPAY có sandbox, luồng chuyển hướng, IPN, truy vấn giao dịch và hoàn tiền. Tài liệu quy định số tiền gửi được nhân 100. Nguồn: [tích hợp PAY chính thức](https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html), [tài liệu tải về](https://sandbox.vnpayment.vn/apis/downloads/).

Thiết kế dự án: adapter `VnpayPaymentAdapter`, merchant ref riêng cho mỗi attempt; IPN GET query tại Gateway; chỉ backend ghi khoản thu. Không lưu thông tin thẻ. Kiểm chứng canonicalization/chữ ký bằng test vector từ tài khoản sandbox, không tự phỏng đoán encoding. Deadline thanh toán phải ánh xạ đúng timezone và trường expiry thực tế. Các quyền query/refund production cần kiểm tra tài khoản merchant.

## Giao hàng chọn GHN

GHN có API tính phí trước tạo đơn, tham số kiện và dịch vụ hàng nặng. Nguồn: [API tính phí](https://developer.ghn.vn/vi/docs/order/calculate-fee).

API tạo vận đơn có mã đơn và thông tin COD. Nguồn: [API tạo đơn](https://developer.ghn.vn/vi/docs/order/create).

Callback có trạng thái và sự kiện tiền COD; tài liệu cho cấu hình custom headers. Nguồn: [callback GHN](https://developer.ghn.dev/en/docs/webhook/callback-order-status).

Thiết kế dự án: `GhnShippingAdapter`, một outbound/đơn, quote gắn địa chỉ/kiện. Cửa hàng trả phí cho GHN; phí khách chịu được tính trong tổng checkout, COD thu đúng tổng này để tránh thu phí hai lần. Cần thử sandbox xác minh cách cấu hình fee payer thực tế.

Callback dùng header bí mật đã cấu hình, chống trùng và truy vấn lại dữ liệu quan trọng bằng token server; không tuyên bố có HMAC khi chưa xác nhận. Một sự kiện logistics không tự chứng minh đã nhận tiền về tài khoản cửa hàng. API trả vận chuyển không mặc nhiên đồng nghĩa hỗ trợ lấy hàng từ khách sau giao; phải thử nghiệm reverse logistics. Nếu chưa hỗ trợ, dùng quy trình đặt trả thủ công có mã và chứng từ như tài liệu 08.

Không khẳng định GHN nhận mọi mặt hàng xi măng, sắt dài, cát/đá rời hoặc đơn xe tải. Lưu whitelist shipping profile đã xác minh. Hàng không báo phí/không được nhận phải chặn checkout và mời chat, không nhận tiền rồi mới xác định có thể giao hay không. Nếu phạm vi kinh doanh đòi giao hàng rời/sắt dài, cần thêm hợp đồng vận tải phù hợp trước khi mở các SKU đó.

## Người phát triển có thể làm ngay

Tạo interface và mock có kiểm thử cho quote, payment, refund, webhook, shipment, query, COD; mock chỉ dev/test. Không gắn nhãn “đã tích hợp” khi mới chạy mock. Sau đó chạy smoke/contract test thật trên sandbox, lưu kết quả không chứa secret.

## Đầu vào cần người dùng cung cấp khi tới module tích hợp

| Đầu vào | Cách cung cấp | Chặn phần nào |
| --- | --- | --- |
| VNPAY sandbox merchant/secret | Qua môi trường hoặc secret manager, không gửi vào git/docs | Test chữ ký và giao dịch sandbox |
| GHN staging token/shop ID | Qua môi trường; tài khoản staging riêng | Quote, vận đơn, callback |
| Địa chỉ và liên hệ kho thực | Dữ liệu cấu hình | Tuyến giao/báo phí |
| Khối lượng, kích thước, đóng gói SKU | Dataset đã kiểm tra | Quote chính xác/khả năng giao |
| Miền HTTPS hoặc tunnel thử | Cấu hình, không public service nội bộ | Nhận IPN/callback |
| Chính sách chi phí trả hàng và SLA | Chủ cửa hàng xác nhận | Nội dung công bố/go-live |
| Tài khoản nhận/chuyển tiền và hợp đồng | Ngoài mã nguồn; bảo mật | Production, đối soát/refund |

Không cần gửi các secret vào cuộc chat này. Chưa có tài khoản thật vẫn phát triển nền tảng và module nội bộ được; không thể xác nhận tích hợp production hoặc phí hợp đồng chỉ từ tài liệu công khai.
