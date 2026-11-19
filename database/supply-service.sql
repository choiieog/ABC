CREATE DATABASE IF NOT EXISTS xd_supply
    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;
USE xd_supply;

CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS receipts (
    id CHAR(36) PRIMARY KEY,
    supplier_id VARCHAR(32) NOT NULL,
    received_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT fk_receipts_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers (id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS receipt_items (
    receipt_id CHAR(36) NOT NULL,
    product_id VARCHAR(32) NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(15, 0) NOT NULL,
    PRIMARY KEY (receipt_id, product_id),
    CONSTRAINT fk_receipt_items_receipt FOREIGN KEY (receipt_id) REFERENCES receipts (id),
    CONSTRAINT chk_receipt_items_quantity CHECK (quantity > 0),
    CONSTRAINT chk_receipt_items_cost CHECK (unit_cost >= 0)
) ENGINE=InnoDB;
