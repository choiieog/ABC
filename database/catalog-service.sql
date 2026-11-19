CREATE DATABASE IF NOT EXISTS xd_catalog
    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;
USE xd_catalog;

CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(120) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id VARCHAR(32) NOT NULL,
    unit VARCHAR(32) NOT NULL,
    price DECIMAL(15, 0) NOT NULL,
    CONSTRAINT chk_products_price CHECK (price >= 0),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id)
) ENGINE=InnoDB;
