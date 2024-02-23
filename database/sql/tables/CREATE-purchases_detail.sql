CREATE TABLE `purchases_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchase_id` int unsigned NOT NULL,
  `product_id` int unsigned NOT NULL,
  `qty` int DEFAULT '0',
  `unit_price` decimal(10,2) DEFAULT '0.00',
  `total` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `purchases_detail_ibfk_1` FOREIGN KEY (`id`) REFERENCES `purchases` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `purchases_detail_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON UPDATE CASCADE ON DELETE RESTRICT
);