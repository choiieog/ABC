# Backlog và nghiệm thu

Không ấn định số ngày khi chưa biết số người và lịch làm. Thực hiện theo phụ thuộc; hoàn thành một lát cắt chạy được rồi mới mở rộng. Mỗi task có migration/contract/UI/test phù hợp, không coi xong khi chỉ có controller trả mẫu.

## Backlog theo giai đoạn

| Task | Công việc và mã yêu cầu | Phụ thuộc | Điều kiện hoàn thành |
| --- | --- | --- | --- |
| P00 | Rà quyết định TypeORM và thông số thiết kế | Không | Decision record, mapping FR/route/table; không còn giả định ngầm |
| P01 | Cấu hình, DB user/schema, migration baseline | P00 | Migrate fresh và từ baseline; secret không commit |
| P02 | Logger/error/validation/correlation/health | P01 | Lỗi rõ, readiness đúng; không leak dữ liệu |
| P03 | Outbox/inbox/idempotency/worker lease | P01–02 | Crash/retry không lặp tác dụng, có hàng đợi lỗi |
| P04 | Sửa Gateway version route/query/headers/method | P02 | Query không mất; không mở internal API công khai |
| P05 | Identity AUTH01–03 | P01–04 | Đúng 4 role; đăng ký không nâng quyền; revoke hoạt động |
| P06 | Bootstrap OWNER/ADMIN và UI auth | P05 | Không password production mặc định; session hoạt động frontend |
| P07 | Catalog CAT01–02 và upload | P05 | CRUD quyền đúng, publish profile giao hợp lệ |
| P08 | Customer CUS01, địa chỉ | P05 | Ownership; sửa địa chỉ không đổi snapshot |
| P09 | Supply SUP01 | P05,07 | Supplier + sản phẩm cung ứng + lịch sử |
| P10 | Inventory balances/operations/ledger INV01,03 | P03,07 | Tồn đầu kỳ có movement, ledger khớp balance |
| P11 | Phiếu nhập SUP02 | P09–10 | Nhập thực nhận, confirm/retry đúng một lần |
| P12 | Kiểm kê INV02 | P10 | Khóa kiểm kê, OWNER duyệt, không áp lại |
| P13 | Khuyến mãi và coupon PROMO01 | P07,03 | Overlap/giới hạn/không cộng dồn, phân bổ chuẩn |
| P14 | Adapter VNPAY/GHN và mock | P00,02–03 | Contract test mock và kế hoạch sandbox; nguồn 09 |
| P15 | Giỏ/quote CART01,SHIP01 | P07–08,13–14 | Giá/discount/phí server, có expiry và chống giả |
| P16 | Tạo đơn/giữ hàng ORD01,INV01 | P03,10,15 | Concurrent checkout không oversell, retry một đơn |
| P17 | VNPAY PAY01–02 | P14,16, credentials | Sandbox IPN/query/expiry/late payment chạy thật |
| P18 | OWNER xác nhận/hủy ORD02–04 | P16–17 | Trước chuẩn bị tự hủy, sau duyệt, sau bàn giao chặn |
| P19 | Chuẩn bị/vận đơn/bàn giao SHIP02 | P14,18, credentials | GHN staging + xuất kho một lần; timeout phục hồi |
| P20 | COD + callback + đối soát COD01 | P19 | Khách trả khác đối tác chuyển; chênh lệch phát hiện |
| P21 | Chat CHAT01 | P05,08, upload | Bền vững/reconnect/ownership/ảnh private |
| P22 | Xác nhận nhận/5 ngày RET01 | P19,21 | Hai lựa chọn, case chặn auto-complete, race có kiểm soát |
| P23 | Trả sau giao/kiểm hàng RET01,SHIP03 | P22,10 | OWNER duyệt qua case chat, reverse/manual rõ, cộng tốt một lần |
| P24 | Hoàn online/COD PAY03 | P17,20,23 | Sandbox refund/query hoặc workflow manual có bằng chứng; cap đúng |
| P25 | Đánh giá sản phẩm REV01 | P07,22–23 | Hiển thị trang sản phẩm; người mua thật; moderation audit |
| P26 | Projection/report/export REP01 | P11–25 | Replay không trùng, số liệu truy ngược chứng từ |
| P27 | Toàn bộ UI STORE/OWNER/KHO/ADMIN | Theo module | Không dùng nút giả/dữ liệu giả để báo nghiệp vụ đã xong |
| P28 | E2E, concurrency, failure, bảo mật | P05–27 | Kịch bản quan trọng dưới đây pass |
| P29 | Deploy, backup/restore, monitoring OPS01 | P28 | Runbook, diễn tập restore và nghiệm thu go-live |

P27 thực hiện cùng từng module, không đợi hết backend mới làm UI. Payment/Shipping chỉ được ghi “tích hợp” sau test sandbox; production là bước riêng cần tài khoản/hợp đồng và cấu hình thật.

## Kiểm thử theo rủi ro

| Mã | Tình huống | Kỳ vọng | Truy vết |
| --- | --- | --- | --- |
| T01 | CUSTOMER gửi role=OWNER; gọi API admin/kho | Bị từ chối, không nâng quyền | AUTH01–03 |
| T02 | Đổi UUID để đọc đơn/chat/ảnh khách khác | Không lộ dữ liệu | CUS01,ORD03,CHAT01 |
| T03 | Khóa user/đổi quyền khi còn access/socket | Request tiếp bị từ chối, socket không tiếp tục gửi | AUTH02 |
| T04 | Hai đơn mua lượng chỉ đủ một | Một thành công, một thiếu; balance không âm | INV01,ORD01 |
| T05 | Confirm receipt/consume/release gửi 10 lần | Chỉ một operation/movement tương ứng | SUP02,INV01 |
| T06 | Restart sau commit giữ kho trước cập nhật Sales | Saga phục hồi, không giữ đôi/mất giữ | ORD01 |
| T07 | Tạo payment/vận đơn timeout sau đối tác nhận | UNKNOWN + query theo ref, không tạo trùng | PAY02,SHIP02 |
| T08 | VNPAY IPN sai chữ ký/amount/merchant | Không PAID; ghi ngoại lệ phù hợp | PAY01 |
| T09 | Return URL giả hoặc khách đóng trình duyệt | Backend vẫn xác nhận từ nguồn thật | PAY01 |
| T10 | IPN lặp/đến muộn sau expire hoặc hủy | Ghi thu thực và hoàn, không khôi phục đơn | PAY02–03 |
| T11 | Hủy chạy đồng thời prepare/handover | Một chuyển hợp lệ; sau bàn giao không hủy | ORD04 |
| T12 | Refund UNKNOWN rồi retry; yêu cầu vượt tiền | Không hoàn đôi/vượt cap | PAY03 |
| T13 | COD delivered nhưng chưa chuyển tiền | Khách PAID, settlement vẫn chờ | COD01 |
| T14 | COD net khác gross vì phí | Đối soát theo breakdown; phát hiện chênh thực | COD01 |
| T15 | Callback vận chuyển cũ đến sau delivered | Không lùi đơn; query nếu mâu thuẫn | SHIP02 |
| T16 | Hàng đang hoàn chưa về hoặc về hỏng/thiếu | Chỉ good thực nhận tăng khả dụng | SHIP03,RET01 |
| T17 | Giỏ chỉ có hàng khuyến mãi + coupon | Không áp coupon; giải thích rõ | PROMO01 |
| T18 | Hai khách dùng lượt mã cuối; một đơn fail stock | Claim không vượt; bù đúng lượt RESERVED | PROMO01 |
| T19 | Hoàn một phần có coupon/làm tròn | Tổng hoàn <= phần đã trả, dùng snapshot | PROMO01,RET01 |
| T20 | Đúng deadline 5 ngày: worker vs mở case | Case đã nhận hợp lệ không mất; khóa/version | RET01 |
| T21 | Tin nhắn gửi lại/reconnect/sai room | Không trùng/mất/lộ; tải lại cursor | CHAT01 |
| T22 | Người chưa mua/đã trả hết tạo review | Bị chặn theo eligibility | REV01 |
| T23 | OWNER sửa nội dung sao của khách | Bị chặn; chỉ reply/moderation audit | REV01 |
| T24 | Replay sự kiện Reporting | Không đếm hai lần; có last_synced_at | REP01 |
| T25 | Kiểm kê trong lúc reserve/xuất | Khóa sản phẩm hoặc từ chối an toàn | INV02 |
| T26 | Restore DB và chạy lại worker | Tiền/kho không thực thi lại tác dụng ngoài | OPS01,P03 |

Unit test cho tính tiền/phân bổ/eligibility/state; integration test transaction với MySQL thật; contract test adapters; E2E các luồng online/COD/hủy/trả; load test đồng thời vào phần giữ hàng/coupon. Không chỉ mock DB rồi kết luận khóa hàng đúng.

## Tiêu chí báo cáo

- Tổng hàng trước giảm, giảm sản phẩm, giảm coupon, doanh số sau giảm, phí giao thu và chi phí đối tác trình bày riêng.
- Đơn delivered-awaiting và completed thống kê riêng; không gọi mọi đơn mới tạo là doanh thu.
- Hàng trả, khoản phải hoàn và khoản đã hoàn là các chỉ tiêu riêng theo thời điểm/chứng từ; không ghi hoàn thành khi mới yêu cầu.
- COD khách đã trả và COD đối tác đã chuyển tách riêng; không cộng hai lần vào tiền thu.
- Nhập–xuất–tồn thỏa tồn đầu + nhập + điều chỉnh tăng - xuất - điều chỉnh giảm = tồn cuối; reserved tách khỏi on_hand.
- Chưa báo lợi nhuận khi chưa thống nhất phương pháp giá vốn; giá nhập gần nhất không tự là giá vốn mọi hàng bán.

## Definition of Done từng module

Đúng phạm vi và quyền; migration có dữ liệu thử; OpenAPI body/response/error hoàn chỉnh; không tin dữ liệu tiền/quyền của frontend; test nghiệp vụ rủi ro pass; log/audit không lộ bí mật; UI có pending/error/empty; tác vụ async có phục hồi; docs cập nhật. Task liên quan tiền/hàng cần chứng minh idempotency và đồng thời, không chỉ đường thành công.

## Checklist go-live

1. Build/typecheck/test phù hợp toàn dự án, không dùng secret sandbox trên production; chặn adapter mock.
2. HTTPS, miền/cookie/CORS, webhook auth/ACK và query bù đã thử; chỉ Gateway public.
3. Danh sách SKU được giao, cân nặng/đóng gói, kho lấy, phí và COD/refund thật đã xác minh với đối tác.
4. Chủ cửa hàng công bố chính sách 5 ngày, xác nhận sớm, trả hàng/phí, thời gian hoàn; không hứa khả năng đối tác chưa hỗ trợ.
5. Seed quyền đúng, đổi mật khẩu bootstrap; mở nhật ký và giám sát outbox backlog, UNKNOWN payment/refund, giữ hàng quá hạn, callback lỗi, case quá hạn.
6. Kiểm kê đầu kỳ; backup tách vị trí; diễn tập restore và replay không gửi lại giao dịch tiền thật.
7. Chạy thử đơn giá trị nhỏ được cho phép, kiểm thu/đối soát/hoàn end-to-end, có người chịu trách nhiệm ngoại lệ.
8. Có runbook đóng checkout khi đối tác lỗi kéo dài và quy trình xử lý đơn đã thu; không xóa dữ liệu để “làm lại”.
