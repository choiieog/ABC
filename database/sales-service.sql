CREATE DATABASE IF NOT EXISTS xd_sales
    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;
USE xd_sales;

CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY,
    status ENUM('received') NOT NULL DEFAULT 'received',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    total DECIMAL(20, 0) NOT NULL,
    KEY idx_orders_created_at (created_at),
    CONSTRAINT chk_orders_total CHECK (total >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
    order_id CHAR(36) NOT NULL,
    product_id VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(15, 0) NOT NULL,
    PRIMARY KEY (order_id, product_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id),
    CONSTRAINT chk_order_items_quantity CHECK (quantity BETWEEN 1 AND 1000),
    CONSTRAINT chk_order_items_price CHECK (unit_price >= 0)
) ENGINE=InnoDB;
