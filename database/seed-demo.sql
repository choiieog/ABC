-- Run after the service schemas. Existing rows retain their current values.
USE xd_identity;
INSERT INTO roles (id, name) VALUES
    ('admin', 'Quản trị viên'),
    ('staff', 'Nhân viên')
ON DUPLICATE KEY UPDATE id = roles.id;

USE xd_catalog;
INSERT INTO categories (id, name) VALUES
    ('cement', 'Xi măng'),
    ('steel', 'Thép'),
    ('brick', 'Gạch')
ON DUPLICATE KEY UPDATE id = categories.id;
INSERT INTO products (id, name, category_id, unit, price) VALUES
    ('XM01', 'Xi măng PCB40', 'cement', 'bao', 95000),
    ('TH01', 'Thép cây D10', 'steel', 'cây', 125000),
    ('GA01', 'Gạch xây 4 lỗ', 'brick', 'viên', 1800)
ON DUPLICATE KEY UPDATE id = products.id;

USE xd_inventory;
INSERT INTO stock (product_id, available) VALUES
    ('XM01', 120), ('TH01', 85), ('GA01', 2000)
ON DUPLICATE KEY UPDATE product_id = stock.product_id;

USE xd_shipping;
INSERT INTO carriers (id, name) VALUES ('LOCAL', 'Đội xe nội bộ')
ON DUPLICATE KEY UPDATE id = carriers.id;

USE xd_supply;
INSERT INTO suppliers (id, name) VALUES ('NCC01', 'Nhà cung cấp vật liệu mẫu')
ON DUPLICATE KEY UPDATE id = suppliers.id;
