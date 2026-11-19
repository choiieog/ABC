CREATE DATABASE IF NOT EXISTS xd_shipping
    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;
USE xd_shipping;

CREATE TABLE IF NOT EXISTS carriers (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(120) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS shipments (
    id CHAR(36) PRIMARY KEY,
    order_id CHAR(36) NOT NULL,
    carrier_id VARCHAR(32) NOT NULL,
    tracking_code VARCHAR(100),
    status ENUM('pending', 'in_transit', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
    created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    KEY idx_shipments_order_id (order_id),
    UNIQUE KEY uq_shipments_tracking (carrier_id, tracking_code),
    CONSTRAINT fk_shipments_carrier FOREIGN KEY (carrier_id) REFERENCES carriers (id)
) ENGINE=InnoDB;
