ALTER TABLE sales
ADD COLUMN status VARCHAR(10) DEFAULT 'Pendiente' AFTER comments,
ADD COLUMN total_charged DECIMAL(10,2) DEFAULT 0 AFTER status;

ALTER TABLE sales MODIFY status VARCHAR(10) DEFAULT 'Pendiente' AFTER comments;