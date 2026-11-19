# XD Manager

## Bộ khung làm việc nhóm

Đã bổ sung đủ 9 dịch vụ nghiệp vụ và Gateway, lệnh chạy/build riêng, cấu hình mẫu và thư mục module cho nhóm 5 người. Xem [hướng dẫn clone, phân công và phát triển](docs/11-huong-dan-phat-trien-nhom.md). Customer/Payment mới chỉ có health; các thư mục mẫu chưa phải chức năng đã triển khai. Phần bản khởi tạo dưới đây mô tả các API demo cũ.

Bộ thiết kế trước triển khai, đã cập nhật phạm vi bán online, VNPAY/GHN, bốn vai trò, khuyến mãi, chat, trả hàng trong 5 ngày và đánh giá sản phẩm: [đọc từ hồ sơ triển khai](docs/README.md). Các tài liệu này mô tả thiết kế đích; phần bên dưới mô tả bản khởi tạo hiện có.

Bản khởi tạo hệ thống quản lý và bán vật liệu xây dựng. Hai ứng dụng Angular gọi API Gateway NestJS qua đường dẫn `/api`. Backend gồm Gateway và chín dịch vụ NestJS chạy độc lập; Customer/Payment hiện chỉ có health.

## Chạy trên máy phát triển

Yêu cầu Node.js 24 và npm. Tại thư mục gốc, cài dependencies và khởi động backend.

```sh
npm ci
npm run dev:backend
```

Mở hai terminal khác để chạy giao diện.

```sh
npm run dev:storefront
```

```sh
npm run dev:admin
```

| Ứng dụng | Địa chỉ |
| --- | --- |
| Cửa hàng | http://127.0.0.1:4200 |
| Quản trị | http://127.0.0.1:4201 |
| API Gateway | http://127.0.0.1:3000/api/health |

Chạy `npm run build` để biên dịch toàn bộ vào `dist/`. Hai dev server đã cấu hình proxy. Nếu tự phục vụ bản build Angular, cấu hình máy chủ HTTP chuyển tiếp `/api/*` đến Gateway và trả về `index.html` cho các đường dẫn giao diện.

## API

| Dịch vụ | Cổng | Đường dẫn qua Gateway |
| --- | --- | --- |
| Identity | 3001 | `GET /api/roles` |
| Catalog | 3002 | `GET /api/products`, `GET /api/categories` |
| Inventory | 3003 | `GET /api/stock` |
| Sales | 3004 | `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders` |
| Shipping | 3005 | `GET /api/carriers`, `GET /api/shipments` |
| Supply | 3006 | `GET /api/suppliers`, `GET /api/receipts` |
| Reporting | 3007 | `GET /api/sales-reports` |

Gửi JSON dưới đây đến `POST /api/orders` với `Content-Type: application/json`. Sales lấy đơn giá từ Catalog và trả về mã đơn, trạng thái tiếp nhận, chi tiết mặt hàng và tổng tiền. Dùng mã đó để tra cứu đơn trên cửa hàng. Báo cáo quản trị tổng hợp các đơn Sales đã tiếp nhận.

```json
{
  "items": [{ "productId": "XM01", "quantity": 2 }]
}
```

## Cấu trúc mã nguồn

Mỗi dịch vụ NestJS có `src/main.ts` để khởi động tiến trình và `src/app.module.ts` để nạp các module nghiệp vụ. Ví dụ với đơn hàng:

```text
backend/services/sales-service/src/
├── main.ts
├── app.module.ts
└── modules/
    └── orders/
        ├── orders.controller.ts
        ├── orders.service.ts
        ├── orders.dto.ts
        ├── orders.entity.ts
        └── orders.module.ts
```

| File | Vai trò |
| --- | --- |
| `*.controller.ts` | Khai báo endpoint HTTP, nhận dữ liệu yêu cầu và gọi service. |
| `*.service.ts` | Xử lý nghiệp vụ, quản lý dữ liệu mẫu hoặc gọi dịch vụ khác. |
| `*.dto.ts` | Khai báo kiểu dữ liệu trao đổi qua API. DTO tạo đơn có hàm kiểm tra dữ liệu đầu vào. |
| `*.entity.ts` | Mô tả dữ liệu nghiệp vụ bằng kiểu TypeScript. |
| `*.module.ts` | Đăng ký controller và service với NestJS. |

Frontend quản trị đặt lớp gọi Gateway tại `frontend/admin-portal/src/app/core/services/resource-api.service.ts`. Component bảng trong `shared/` gọi lớp này để tải dữ liệu theo endpoint của từng trang.

Trong `backend/api-gateway/src/`, `routing/gateway.controller.ts` khai báo các tuyến chuyển tiếp đang chạy. Ba thư mục còn lại đang dành chỗ cho các phần sau.

| Thư mục | Mục đích dự kiến |
| --- | --- |
| `auth/` | Guard xác thực và kiểm tra quyền truy cập ở Gateway. |
| `clients/` | HTTP client dành riêng cho từng dịch vụ khi cần gom logic gọi API nội bộ. Hiện Gateway dùng helper trong `backend/shared/service-http.ts`. |
| `webhooks/` | Điểm nhận sự kiện từ đối tác, chẳng hạn thông báo thanh toán hoặc cập nhật vận chuyển. |

## Phạm vi bản khởi tạo

Backend lắng nghe trên loopback để chạy thử cục bộ. Danh mục, tồn kho, vai trò và đối tác dùng dữ liệu mẫu. Giỏ hàng nằm trong bộ nhớ của ứng dụng Angular. Đơn hàng nằm trong bộ nhớ của Sales và mất khi dịch vụ khởi động lại. Luồng đặt hàng dừng ở trạng thái tiếp nhận. Các thư mục nghiệp vụ còn trống dành cho phần mở rộng như đăng nhập, phân quyền, giữ tồn kho, thanh toán và xử lý giao nhận. Bản chạy thử chưa tích hợp MySQL.

## Cây thư mục hiện tại

Xem [cây thư mục và bảng giải thích](docs/12-cau-truc-thu-muc.md). Các thư mục ghi “khung” chỉ có tài liệu, chưa có chức năng chạy.
