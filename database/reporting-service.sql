CREATE DATABASE IF NOT EXISTS xd_reporting
    CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_cs;
USE xd_reporting;

-- Each row is a copy of the fields needed from one Sales order.
CREATE TABLE IF NOT EXISTS sales_order_facts (
    order_id CHAR(36) PRIMARY KEY,
    created_at DATETIME(3) NOT NULL,
    total DECIMAL(20, 0) NOT NULL,
    CONSTRAINT chk_sales_order_facts_total CHECK (total >= 0)
) ENGINE=InnoDB;

CREATE OR REPLACE SQL SECURITY INVOKER VIEW sales_report AS
SELECT COUNT(*) AS order_count, COALESCE(SUM(total), 0) AS order_total
FROM sales_order_facts;
