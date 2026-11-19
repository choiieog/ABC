# Database của XD Manager

> Các SQL dưới đây là baseline demo cho 7 schema cũ, chưa phải mô hình cuối. Khung backend hiện có thêm Customer và Payment, chưa có kết nối DB thật. Khi triển khai persistence, có thể tạo thư mục migration tại `backend/services/<service>/src/database/migrations/`; xem `docs/05-thiet-ke-du-lieu.md`, `docs/08-khuyen-mai-chat-tra-hang-danh-gia.md` và `docs/11-huong-dan-phat-trien-nhom.md`.

Bộ DDL dùng MySQL 8.4 và InnoDB. Mỗi dịch vụ sở hữu một schema riêng. Có thể tạo cả bảy schema trên cùng một MySQL server khi phát triển. API Gateway định tuyến HTTP nên không cần schema riêng.

| File | Schema | Dữ liệu thuộc dịch vụ |
| --- | --- | --- |
| `identity-service.sql` | `xd_identity` | `roles`, `users`, `user_roles`. Tài khoản lưu hash mật khẩu. |
| `catalog-service.sql` | `xd_catalog` | `categories`, `products`. Catalog quản lý tên, đơn vị và giá bán hiện tại. |
| `inventory-service.sql` | `xd_inventory` | `stock`. Một hàng tồn khả dụng cho mỗi mã sản phẩm, theo mô hình hiện tại. |
| `sales-service.sql` | `xd_sales` | `orders`, `order_items`. Dòng đơn giữ tên và giá tại thời điểm đặt. |
| `shipping-service.sql` | `xd_shipping` | `carriers`, `shipments`. Vận đơn gắn với mã đơn và đơn vị vận chuyển. |
| `supply-service.sql` | `xd_supply` | `suppliers`, `receipts`, `receipt_items`. Phiếu nhập ghi số lượng và giá nhập. |
| `reporting-service.sql` | `xd_reporting` | `sales_order_facts` chứa bản sao tối thiểu theo mã đơn. View `sales_report` tính số đơn và tổng giá trị. |
| `seed-demo.sql` | Năm schema nghiệp vụ | Nạp dữ liệu mẫu hiện có cho vai trò, danh mục, sản phẩm, tồn kho, vận chuyển và nhà cung cấp. |

## Khởi tạo

Tại thư mục gốc, mở MySQL client bằng tài khoản có quyền tạo schema, bảng và view. Thay `your_mysql_user` bằng tên tài khoản trên máy.

```powershell
mysql --default-character-set=utf8mb4 -u your_mysql_user -p
```

Trong MySQL client, chạy các lệnh sau. Bảy file schema có thể chạy theo thứ tự bất kỳ. File cuối là dữ liệu demo tùy chọn.

```text
SOURCE database/identity-service.sql
SOURCE database/catalog-service.sql
SOURCE database/inventory-service.sql
SOURCE database/sales-service.sql
SOURCE database/shipping-service.sql
SOURCE database/supply-service.sql
SOURCE database/reporting-service.sql
SOURCE database/seed-demo.sql
```

## Ranh giới dữ liệu

- Khóa ngoại chỉ nối bảng trong cùng schema. `product_id` ở Inventory, Sales và Supply là mã do Catalog cấp. `order_id` ở Shipping và Reporting là UUID do Sales cấp. Dịch vụ kiểm tra mã tham chiếu qua API hoặc qua bản sao dữ liệu do chính dịch vụ quản lý.
- Giá bán, giá nhập và tổng tiền dùng `DECIMAL` với 0 chữ số thập phân, theo giả định đơn vị là đồng Việt Nam. Lưu thời gian theo UTC. Khi nối DB vào Sales, ghi đầu đơn và các dòng hàng trong cùng một giao dịch.
- Tài khoản, chi tiết vận đơn và phiếu nhập là thiết kế đề xuất cho các phần mới. Tồn kho hiện mô hình hóa một số lượng trên mỗi sản phẩm. Giữ hàng, nhiều kho và thanh toán chưa có bảng trong bộ này.
- Backend hiện vẫn chạy bằng dữ liệu mẫu và đơn hàng trong bộ nhớ. Reporting hiện gọi API Sales trực tiếp. Để dùng view báo cáo, Reporting cần đồng bộ các trường `order_id`, `created_at`, `total` từ Sales, cập nhật theo mã đơn khi đồng bộ lại, rồi ánh xạ `order_count` và `order_total` về DTO hiện tại.
