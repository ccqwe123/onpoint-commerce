-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: quotation
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Cash Drawer',1,'2025-10-02 04:46:47','2025-10-02 04:46:47'),(2,'Barcode Scanner - Desktop',1,'2025-10-02 04:47:35','2025-10-02 04:47:35'),(3,'Barcode Scanner - Handheld',1,'2025-10-02 04:47:50','2025-10-02 04:47:50'),(4,'Thermal Printer',1,'2025-10-02 04:48:37','2025-10-02 04:48:37');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2019_08_19_000000_create_failed_jobs_table',1),(4,'2019_12_14_000001_create_personal_access_tokens_table',1),(5,'2025_09_19_061817_create_categories_table',1),(6,'2025_09_19_061934_create_products_table',1),(7,'2025_09_19_062051_create_product_images_table',1),(8,'2025_09_19_082507_create_plans_table',1),(9,'2025_09_19_083259_create_plan_descriptions_table',1),(10,'2025_09_19_135000_create_clients_table',1),(11,'2025_09_19_135001_create_orders_table',1),(12,'2025_09_19_135040_create_order_items_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`),
  CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plan_id` bigint unsigned NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `payment` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` bigint unsigned NOT NULL,
  `user_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_plan_id_foreign` (`plan_id`),
  KEY `orders_client_id_foreign` (`client_id`),
  KEY `orders_user_id_foreign` (`user_id`),
  CONSTRAINT `orders_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE,
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

LOCK TABLES `personal_access_tokens` WRITE;
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan_descriptions`
--

DROP TABLE IF EXISTS `plan_descriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan_descriptions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `plan_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `plan_descriptions_plan_id_foreign` (`plan_id`),
  CONSTRAINT `plan_descriptions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan_descriptions`
--

LOCK TABLES `plan_descriptions` WRITE;
/*!40000 ALTER TABLE `plan_descriptions` DISABLE KEYS */;
INSERT INTO `plan_descriptions` VALUES (1,1,'Access to basic features','2025-10-02 04:43:08','2025-10-02 04:43:08'),(2,1,'Email support','2025-10-02 04:43:08','2025-10-02 04:43:08'),(3,1,'Up to 5 users','2025-10-02 04:43:08','2025-10-02 04:43:08'),(4,1,'Community resources','2025-10-02 04:43:08','2025-10-02 04:43:08'),(5,1,'1 GB storage','2025-10-02 04:43:08','2025-10-02 04:43:08'),(6,2,'All basic features included','2025-10-02 04:43:08','2025-10-02 04:43:08'),(7,2,'Priority email support','2025-10-02 04:43:08','2025-10-02 04:43:08'),(8,2,'Up to 20 users','2025-10-02 04:43:08','2025-10-02 04:43:08'),(9,2,'Advanced analytics','2025-10-02 04:43:08','2025-10-02 04:43:08'),(10,2,'10 GB storage','2025-10-02 04:43:08','2025-10-02 04:43:08'),(11,3,'Custom number of users','2025-10-02 04:43:08','2025-10-02 04:43:08'),(12,3,'Dedicated account manager','2025-10-02 04:43:08','2025-10-02 04:43:08'),(13,3,'24/7 phone support','2025-10-02 04:43:08','2025-10-02 04:43:08'),(14,3,'Unlimited storage','2025-10-02 04:43:08','2025-10-02 04:43:08'),(15,3,'Tailored solutions for your business','2025-10-02 04:43:08','2025-10-02 04:43:08');
/*!40000 ALTER TABLE `plan_descriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plans`
--

DROP TABLE IF EXISTS `plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plans` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `type` enum('monthly','annual','custom') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plans`
--

LOCK TABLES `plans` WRITE;
/*!40000 ALTER TABLE `plans` DISABLE KEYS */;
INSERT INTO `plans` VALUES (1,'Basic Monthly',499.00,399.00,'monthly',NULL,1,'2025-10-02 04:43:08','2025-10-02 04:43:08'),(2,'Premium Monthly',999.00,799.00,'monthly',NULL,1,'2025-10-02 04:43:08','2025-10-02 04:43:08'),(3,'Enterprise Custom',NULL,NULL,'custom',NULL,1,'2025-10-02 04:43:08','2025-10-02 04:43:08');
/*!40000 ALTER TABLE `plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_primary` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (1,1,'/images/products/1759409848_68de76b87d7c6.png',1,'2025-10-02 04:57:28','2025-10-02 04:57:28'),(2,1,'/images/products/1759409848_68de76b87f5f9.png',0,'2025-10-02 04:57:28','2025-10-02 04:57:28'),(3,1,'/images/products/1759409848_68de76b8813ea.png',0,'2025-10-02 04:57:28','2025-10-02 04:57:28'),(4,1,'/images/products/1759409848_68de76b88358f.png',0,'2025-10-02 04:57:28','2025-10-02 04:57:28'),(5,1,'/images/products/1759409848_68de76b885839.png',0,'2025-10-02 04:57:28','2025-10-02 04:57:28'),(6,1,'/images/products/1759409848_68de76b886525.png',0,'2025-10-02 04:57:28','2025-10-02 04:57:28'),(7,2,'/images/products/1759410168_68de77f8549ad.png',1,'2025-10-02 05:02:48','2025-10-02 05:02:48'),(8,2,'/images/products/1759410168_68de77f85681e.png',0,'2025-10-02 05:02:48','2025-10-02 05:02:48'),(9,2,'/images/products/1759410168_68de77f85874b.png',0,'2025-10-02 05:02:48','2025-10-02 05:02:48'),(10,3,'/images/products/1759410332_68de789c36f15.png',1,'2025-10-02 05:05:32','2025-10-02 05:05:32'),(11,3,'/images/products/1759410332_68de789c392c9.png',0,'2025-10-02 05:05:32','2025-10-02 05:05:32'),(12,3,'/images/products/1759410332_68de789c3ab35.png',0,'2025-10-02 05:05:32','2025-10-02 05:05:32'),(13,3,'/images/products/1759410332_68de789c3baa4.png',0,'2025-10-02 05:05:32','2025-10-02 05:05:32'),(14,3,'/images/products/1759410332_68de789c3c66f.png',0,'2025-10-02 05:05:32','2025-10-02 05:05:32'),(15,4,'/images/products/1759410407_68de78e73b6ef.png',1,'2025-10-02 05:06:47','2025-10-02 05:06:47'),(16,5,'/images/products/1759410482_68de79326f24e.png',1,'2025-10-02 05:08:02','2025-10-02 05:08:02'),(17,5,'/images/products/1759410482_68de79327031d.png',0,'2025-10-02 05:08:02','2025-10-02 05:08:02'),(18,5,'/images/products/1759410482_68de7932711ca.png',0,'2025-10-02 05:08:02','2025-10-02 05:08:02'),(19,6,'/images/products/1759410671_68de79ef93829.png',1,'2025-10-02 05:11:11','2025-10-02 05:11:11'),(20,6,'/images/products/1759410671_68de79ef96263.png',0,'2025-10-02 05:11:11','2025-10-02 05:11:11'),(21,6,'/images/products/1759410671_68de79ef97b7b.png',0,'2025-10-02 05:11:11','2025-10-02 05:11:11'),(33,8,'/images/products/1759410927_68de7aefbc60a.png',1,'2025-10-02 05:15:27','2025-10-02 05:15:27'),(34,8,'/images/products/1759410927_68de7aefbe4e8.png',0,'2025-10-02 05:15:27','2025-10-02 05:15:27'),(35,8,'/images/products/1759410927_68de7aefc0817.png',0,'2025-10-02 05:15:27','2025-10-02 05:15:27'),(36,9,'/images/products/1759411271_68de7c4784498.png',1,'2025-10-02 05:21:11','2025-10-02 05:21:11'),(37,9,'/images/products/1759411271_68de7c4786318.png',0,'2025-10-02 05:21:11','2025-10-02 05:21:11'),(38,9,'/images/products/1759411271_68de7c4787e1b.png',0,'2025-10-02 05:21:11','2025-10-02 05:21:11'),(39,9,'/images/products/1759411271_68de7c478946d.png',0,'2025-10-02 05:21:11','2025-10-02 05:21:11'),(40,10,'/images/products/1759411447_68de7cf784af9.png',1,'2025-10-02 05:24:07','2025-10-02 05:24:07'),(41,10,'/images/products/1759411447_68de7cf787727.png',0,'2025-10-02 05:24:07','2025-10-02 05:24:07'),(42,10,'/images/products/1759411447_68de7cf789d02.png',0,'2025-10-02 05:24:07','2025-10-02 05:24:07'),(43,10,'/images/products/1759411447_68de7cf78b8de.png',0,'2025-10-02 05:24:07','2025-10-02 05:24:07'),(44,11,'/images/products/1759411631_68de7daf119e3.png',1,'2025-10-02 05:27:11','2025-10-02 05:27:11'),(45,11,'/images/products/1759411631_68de7daf1382c.png',0,'2025-10-02 05:27:11','2025-10-02 05:27:11'),(46,11,'/images/products/1759411631_68de7daf1543d.png',0,'2025-10-02 05:27:11','2025-10-02 05:27:11'),(47,11,'/images/products/1759411631_68de7daf16bea.png',0,'2025-10-02 05:27:11','2025-10-02 05:27:11'),(48,12,'/images/products/1759411817_68de7e6938232.png',1,'2025-10-02 05:30:17','2025-10-02 05:30:17'),(49,12,'/images/products/1759411817_68de7e6939e71.png',0,'2025-10-02 05:30:17','2025-10-02 05:30:17'),(50,12,'/images/products/1759411817_68de7e693b789.png',0,'2025-10-02 05:30:17','2025-10-02 05:30:17'),(51,12,'/images/products/1759411817_68de7e693cacc.png',0,'2025-10-02 05:30:17','2025-10-02 05:30:17'),(52,13,'/images/products/1759412089_68de7f795959e.png',1,'2025-10-02 05:34:49','2025-10-02 05:34:49'),(53,13,'/images/products/1759412089_68de7f795b37e.png',0,'2025-10-02 05:34:49','2025-10-02 05:34:49'),(54,13,'/images/products/1759412089_68de7f795c9e2.png',0,'2025-10-02 05:34:49','2025-10-02 05:34:49'),(55,14,'/images/products/1759412359_68de80879aa07.png',1,'2025-10-02 05:39:19','2025-10-02 05:39:19'),(56,14,'/images/products/1759412359_68de80879d374.png',0,'2025-10-02 05:39:19','2025-10-02 05:39:19'),(57,14,'/images/products/1759412359_68de80879e768.png',0,'2025-10-02 05:39:19','2025-10-02 05:39:19'),(58,15,'/images/products/1759412431_68de80cff0e4a.png',1,'2025-10-02 05:40:31','2025-10-02 05:40:32'),(59,15,'/images/products/1759412431_68de80cff2e9e.png',0,'2025-10-02 05:40:31','2025-10-02 05:40:31'),(60,15,'/images/products/1759412432_68de80d00027a.png',0,'2025-10-02 05:40:32','2025-10-02 05:40:32'),(61,16,'/images/products/1759412623_68de818ff3841.png',1,'2025-10-02 05:43:43','2025-10-02 05:43:44'),(62,17,'/images/products/1759412704_68de81e0c0deb.png',1,'2025-10-02 05:45:04','2025-10-02 05:45:04'),(63,17,'/images/products/1759412704_68de81e0c3717.png',0,'2025-10-02 05:45:04','2025-10-02 05:45:04'),(64,17,'/images/products/1759412704_68de81e0c51d2.png',0,'2025-10-02 05:45:04','2025-10-02 05:45:04'),(65,18,'/images/products/1759412767_68de821f9163b.png',1,'2025-10-02 05:46:07','2025-10-02 05:46:07'),(66,18,'/images/products/1759412767_68de821f93745.png',0,'2025-10-02 05:46:07','2025-10-02 05:46:07'),(67,18,'/images/products/1759412767_68de821f94f49.png',0,'2025-10-02 05:46:07','2025-10-02 05:46:07'),(69,20,'/images/products/1759412976_68de82f084eb3.png',1,'2025-10-02 05:49:36','2025-10-02 05:49:36'),(70,20,'/images/products/1759412976_68de82f087ae8.png',0,'2025-10-02 05:49:36','2025-10-02 05:49:36'),(71,20,'/images/products/1759412976_68de82f089fae.png',0,'2025-10-02 05:49:36','2025-10-02 05:49:36'),(72,20,'/images/products/1759412976_68de82f08b344.png',0,'2025-10-02 05:49:36','2025-10-02 05:49:36'),(73,20,'/images/products/1759412976_68de82f08c921.png',0,'2025-10-02 05:49:36','2025-10-02 05:49:36');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `discount_price` decimal(10,2) DEFAULT NULL,
  `stock` int DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_category_id_foreign` (`category_id`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'LogicOwl OJ-405','<ul><li><span style=\"background-color: transparent;\">There are 5 bill trays and 5 coin trays, with a bill entry, you can adjust the coin tray width freely.</span></li><li><span style=\"background-color: transparent;\">Support auto-open/manual open/lock, convenient; adopt 50 sets of code to ensure high security.</span></li><li><span style=\"background-color: transparent;\">Adopt highly elastic steel spring and pulley ball bearing shaft, designed for frequent opening/closing.</span></li><li><span style=\"background-color: transparent;\">Heavy-duty steel frame, heat-resistant, impact-resistant, durable, and safe.</span></li><li><span style=\"background-color: transparent;\">Compatible for RJ11 interface, 3 usages: independent cash drawer, connect with POS printer/driver + cash register/computer; recommended voltage: DC12V / D24V.</span></li></ul>',2062.00,1861.00,0,1,'2025-10-02 04:57:28','2025-10-02 04:57:28'),(2,1,'LogicOwl OJ-425','<ul><li><span style=\"background-color: transparent;\">RJ11 Interface for Automatic Opening</span></li><li><span style=\"background-color: transparent;\">2 Keys Included for Added Security</span></li><li><span style=\"background-color: transparent;\">High-grade stainless steel material, uneasy to rust or break</span></li><li><span style=\"background-color: transparent;\">3 Locking Modes (Controlled, Locked, Manual)</span></li><li><span style=\"background-color: transparent;\">Suitable Grocery Stores, Drugstores, Supermarkets</span></li><li><span style=\"background-color: transparent;\">With Rubber Feet for Stability and Less Friction</span></li><li><span style=\"background-color: transparent;\">Removable Coin Tray for Easier Cleaning</span></li></ul><p><br></p>',2679.00,2445.00,0,1,'2025-10-02 05:02:48','2025-10-02 05:02:48'),(3,2,'LogicOwl OJ-MP7000','<ul><li><span style=\"background-color: transparent;\">Type: Barcode Scanner</span></li><li><span style=\"background-color: transparent;\">Scan Element Type: CMOS</span></li><li><span style=\"background-color: transparent;\">Colour Depth: 32 Bit</span></li><li><span style=\"background-color: transparent;\">Interface: USB-HID, USB-COM, RS232</span></li><li><span style=\"background-color: transparent;\">Max Paper Size: A4</span></li><li><span style=\"background-color: transparent;\">Optical Resolution: 640*480</span></li><li><span style=\"background-color: transparent;\">Scan Speed: 120fps</span></li><li><span style=\"background-color: transparent;\">Application: POS Retail</span></li><li><span style=\"background-color: transparent;\">Scan Mode: Auto Scan</span></li><li><span style=\"background-color: transparent;\">Light source: RED LED</span></li><li><span style=\"background-color: transparent;\">Decode Capabilities: 1D + 2D + QR Code</span></li><li><span style=\"background-color: transparent;\">Operating System: Windows, Android, Linux, MAC</span></li></ul>',1880.00,1820.00,0,1,'2025-10-02 05:05:32','2025-10-02 06:04:56'),(4,2,'LogicOwl OJ-MP6300','<ul><li><span style=\"background-color: transparent;\">Plug and play without the need to install driver.</span></li><li><span style=\"background-color: transparent;\">Support 2D barcode from paper, film, mobile phone, and tablet, pc screen, etc.</span></li><li><span style=\"background-color: transparent;\">Support sleep automatically, wake up automatically function.</span></li></ul>',1620.00,1560.00,0,1,'2025-10-02 05:06:47','2025-10-02 06:04:51'),(5,2,'Logicowl OJ-MP6800','<ul><li><span style=\"background-color: transparent;\">IR Sensor Trigger (15cm Precise Trigger)</span></li><li><span style=\"background-color: transparent;\">Low Profile and Recessed LED Lights Bring Comfortable Experience</span></li><li><span style=\"background-color: transparent;\">Modern Styling</span></li><li><span style=\"background-color: transparent;\">High Quality</span></li><li><span style=\"background-color: transparent;\">Faster Scanning</span></li><li><strong style=\"background-color: transparent;\">Scan Element Type:</strong><span style=\"background-color: transparent;\"> CMOS</span></li><li><strong style=\"background-color: transparent;\">Colour Depth:</strong><span style=\"background-color: transparent;\"> 32 Bit</span></li><li><strong style=\"background-color: transparent;\">Interface Type:</strong><span style=\"background-color: transparent;\"> usb, COM</span></li><li><strong style=\"background-color: transparent;\">Max Paper Size: </strong><span style=\"background-color: transparent;\">A4</span></li><li><strong style=\"background-color: transparent;\">Optical Resolution</strong><span style=\"background-color: transparent;\">: 1600</span></li><li><strong style=\"background-color: transparent;\">Place of Origin: </strong><span style=\"background-color: transparent;\">Guangdong, China</span></li><li><strong style=\"background-color: transparent;\">After-sales Service: </strong><span style=\"background-color: transparent;\">Return and Replacement, Others</span></li><li><strong style=\"background-color: transparent;\">Software development kit (SDK):</strong><span style=\"background-color: transparent;\"> Yes</span></li><li><strong style=\"background-color: transparent;\">Product name: </strong><span style=\"background-color: transparent;\">Desktop 2D barcode scanner</span></li><li><strong style=\"background-color: transparent;\">Color: </strong><span style=\"background-color: transparent;\">Black</span></li><li><strong style=\"background-color: transparent;\">Dimensions (W x D x H): </strong><span style=\"background-color: transparent;\">85mm*88mm*139 mm</span></li><li><strong style=\"background-color: transparent;\">Interface:</strong><span style=\"background-color: transparent;\"> USB</span></li><li><strong style=\"background-color: transparent;\">Feature:</strong><span style=\"background-color: transparent;\"> High speed</span></li><li><strong style=\"background-color: transparent;\">Scan Mode: </strong><span style=\"background-color: transparent;\">1D/2D</span></li><li><strong style=\"background-color: transparent;\">Scanning method:</strong><span style=\"background-color: transparent;\"> COM</span></li></ul><p><br></p>',1996.00,1936.00,0,1,'2025-10-02 05:08:02','2025-10-02 05:08:02'),(6,2,'Barcode Scanner','<ul><li><em style=\"background-color: transparent;\">Processor: 32-Bit MCU</em></li><li><em style=\"background-color: transparent;\">Scanning Speed: 200 Scans/Sec</em></li><li><em style=\"background-color: transparent;\">Prompting Mode: Buzzer &amp; Indicator Light (LED)</em></li><li><em style=\"background-color: transparent;\">Material: ABS+PVC+PC</em></li><li><em style=\"background-color: transparent;\">Supported Interface: USB &amp; RS-232</em></li><li><em style=\"background-color: transparent;\">Sensor: Planar CMOS Sensor</em></li><li><em style=\"background-color: transparent;\">Light Source: Red LED (Aiming) + White LED (Lightning)</em></li><li><em style=\"background-color: transparent;\">Scanning Method: Manual Trigger, Auto-Sensing</em></li><li><em style=\"background-color: transparent;\">Printing Contrast: Atleast 35%</em></li><li><em style=\"background-color: transparent;\">IP Grade: IP54</em></li></ul>',0.00,0.00,0,0,'2025-10-02 05:11:11','2025-10-02 05:14:13'),(8,3,'Cordya Y-7600','<ul><li><em style=\"background-color: transparent;\">Processor: 32-Bit MCU</em></li><li><em style=\"background-color: transparent;\">Scanning Speed: 200 Scans/Sec</em></li><li><em style=\"background-color: transparent;\">Prompting Mode: Buzzer &amp; Indicator Light (LED)</em></li><li><em style=\"background-color: transparent;\">Material: ABS+PVC+PC</em></li><li><em style=\"background-color: transparent;\">Supported Interface: USB &amp; RS-232</em></li><li><em style=\"background-color: transparent;\">Sensor: Planar CMOS Sensor</em></li><li><em style=\"background-color: transparent;\">Light Source: Red LED (Aiming) + White LED (Lightning)</em></li><li><em style=\"background-color: transparent;\">Scanning Method: Manual Trigger, Auto-Sensing</em></li><li><em style=\"background-color: transparent;\">Printing Contrast: Atleast 35%</em></li><li><em style=\"background-color: transparent;\">IP Grade: IP54</em></li></ul>',1659.00,1599.00,0,1,'2025-10-02 05:15:27','2025-10-02 06:02:51'),(9,3,'LogicOwl OJ-M930Z','<ul><li>Compatible with Windows XP/7/8/10, Mac OS, Android, Linux.</li><li>CMOS Image Scanning Tech High-sensitive CMOS sensor</li><li>3 Scanning Modes:</li><li class=\"ql-indent-1\">Manual Trigger Mode - only trigger when the key is pressed</li><li class=\"ql-indent-1\">Continuous Scanning Mode - Scanning mode is always on when scanner is electrified. Scan barcodes without pressing trigger key</li><li class=\"ql-indent-1\">Auto-sensing Mode: Scanning light only turn on when a barcode is detected, extend the life of the CMOS lens to make the scanner more durable&nbsp;</li><li><span style=\"background-color: transparent;\">USB Wired Connection</span></li><li><span style=\"background-color: transparent;\">Easily capture 1D &amp; 2D barcodes on screen and paper. What more, it support recognize some special barcodes, including damaged, blurred, colored, inverse barcode</span></li><li><span style=\"background-color: transparent;\">Support connection with computers and laptops</span></li><li><span style=\"background-color: transparent;\">Compatible with all most common systems like Windows XP/7/8/10, Mac OS, Linux and Android</span></li><li><span style=\"background-color: transparent;\">Only works on devices with USB ports, not for smart phone, tablets</span></li></ul>',1920.00,1860.00,0,1,'2025-10-02 05:21:11','2025-10-02 06:02:56'),(10,3,'LogicOwl OJ-WM930','<ul><li><span style=\"background-color: transparent;\">Made of great ABS+PC materials,high shock-resistant</span></li><li>fast scanning speed, high sensitivity, stable performance and high recognition rate</li><li><span style=\"background-color: transparent;\">With USB cable for connection, plug and play, no need to install any software or drivers, simple operation.	</span></li><li>Multi-functional scanner, great for scanning most of the 1D barcode and 2D barcode on paper and screen.</li></ul>',1129.00,1069.00,0,1,'2025-10-02 05:24:07','2025-10-02 06:03:01'),(11,3,'Logicowl OJ-BWHS23','<ul><li><span style=\"background-color: transparent;\">Dimensions</span></li><li class=\"ql-indent-1\"><span style=\"background-color: transparent;\">Scanner: 96.5mm x 68mm x 175mm</span></li><li class=\"ql-indent-1\"><span style=\"background-color: transparent;\">Stand: 92mm x 135mm x 54mm</span></li><li><span style=\"background-color: transparent;\">Image Sensor: 640*480 CMOS</span></li><li><span style=\"background-color: transparent;\">Scan Mode: Auto Scan/Trigger Manual Scan</span></li><li><span style=\"background-color: transparent;\">Scan Angle: Horizontal: 45° Vertical: 34°</span></li><li><span style=\"background-color: transparent;\">Wireless Technology</span></li><li class=\"ql-indent-1\"><span style=\"background-color: transparent;\">Bluetooth</span></li><li class=\"ql-indent-1\"><span style=\"background-color: transparent;\">Wireless Range: 60m</span></li><li><span style=\"background-color: transparent;\">LED Indicators</span></li><li class=\"ql-indent-1\"><span style=\"background-color: transparent;\">Blue LED on: Power on</span></li><li class=\"ql-indent-1\"><span style=\"background-color: transparent;\">Red LED on: No Battery</span></li><li class=\"ql-indent-1\"><span style=\"background-color: transparent;\">Blue LED Flash: Decode</span></li><li><span style=\"background-color: transparent;\">Beeper: Startup Beep/Good Read Beep/Error Beep</span></li><li><span style=\"background-color: transparent;\">Net Weight: 202g</span></li><li><span style=\"background-color: transparent;\">Gross Weight: 335g</span></li><li><span style=\"background-color: transparent;\">Cable Length: 180CM(±3CM)</span></li><li><span style=\"background-color: transparent;\">Scan Times: 13000 scans after every charge</span></li><li><span style=\"background-color: transparent;\">Expected Operating Time: 15Hours</span></li><li><span style=\"background-color: transparent;\">Expected Charging Time: 4 Hours</span></li><li><span style=\"background-color: transparent;\">Battery Capacity: 1800MAH</span></li><li><span style=\"background-color: transparent;\">Scan Element Type: CMOS</span></li><li><span style=\"background-color: transparent;\">Colour Depth: 32 Bit</span></li><li><span style=\"background-color: transparent;\">Interface Type: Bluetooth</span></li><li><span style=\"background-color: transparent;\">Max Paper Size: A4</span></li><li><span style=\"background-color: transparent;\">Optical Resolution: 5 mil</span></li><li><span style=\"background-color: transparent;\">Scan Speed: 300 times/sec</span></li><li><span style=\"background-color: transparent;\">Brand Name: Logicowl</span></li><li><span style=\"background-color: transparent;\">Warranty(Year): 6 Months</span></li><li><span style=\"background-color: transparent;\">Software development kit (SDK): Yes</span></li><li><span style=\"background-color: transparent;\">color: black</span></li><li><span style=\"background-color: transparent;\">Product name: 2D Wireless Barcode Scanner</span></li><li><span style=\"background-color: transparent;\">Application: Retail Point of Sales, Inventory, Heathcare, Hospiblity</span></li><li><span style=\"background-color: transparent;\">Light source: White LED/Red LED</span></li><li><span style=\"background-color: transparent;\">Decode Capabilities: 1D + 2D + QR Code</span></li><li><span style=\"background-color: transparent;\">Resolution: ≥5mil</span></li><li><span style=\"background-color: transparent;\">Scan Mode: Handheld Rapid Scan</span></li><li><span style=\"background-color: transparent;\">Weight: 0.5kg</span></li><li><span style=\"background-color: transparent;\">Dimension: 185*110*83mm</span></li><li><span style=\"background-color: transparent;\">Voltage: 5 VDC±5%</span></li></ul>',1670.00,1610.00,0,1,'2025-10-02 05:27:11','2025-10-02 06:02:44'),(12,3,'LogicOwl OJ-BWHS26','<ul><li><span style=\"background-color: transparent;\">Brand Name: LOGICOWL</span></li><li><span style=\"background-color: transparent;\">Type: Barcode Scanner</span></li><li><span style=\"background-color: transparent;\">Optical Resolution: 600*600</span></li><li><span style=\"background-color: transparent;\">Scan Element Type: CMOS</span></li><li><span style=\"background-color: transparent;\">Certification: CE</span></li><li><span style=\"background-color: transparent;\">Scan Breadth: A4</span></li><li><span style=\"background-color: transparent;\">Scan Speed: 100 scans/second</span></li><li><span style=\"background-color: transparent;\">Interface Type: USB</span></li><li><span style=\"background-color: transparent;\">Origin: CN(Origin)</span></li><li><span style=\"background-color: transparent;\">Model Number: HS26</span></li><li><span style=\"background-color: transparent;\">Colour Depth: 32 Bit</span></li><li><span style=\"background-color: transparent;\">Product Type: Bar Code Scanner</span></li><li><span style=\"background-color: transparent;\">Scanning Light Source: Laser Light</span></li><li><span style=\"background-color: transparent;\">USB Handheld</span></li><li><span style=\"background-color: transparent;\">Bluetooth Enabled</span></li><li><span style=\"background-color: transparent;\">100% brand new.</span></li><li><span style=\"background-color: transparent;\">Plug and Play easily</span></li><li><span style=\"background-color: transparent;\">2D QR 1D Bar Code Reader</span></li><li><span style=\"background-color: transparent;\">Fit for Windows and Mac system</span></li><li><span style=\"background-color: transparent;\">Support scan barcode from Screen</span></li><li><span style=\"background-color: transparent;\">Two working mode: Instant upload mode / storage mode. Internal offline storage supports up to 100,00 barcodes in offline storage mode.</span></li><li><span style=\"background-color: transparent;\">Scan and store barcode when far away from the receiver, and then update the data to your device when you come back entering the wireless transmission range.</span></li></ul>',2720.00,2660.00,0,1,'2025-10-02 05:30:17','2025-10-02 06:02:39'),(13,3,'LogicOwl OJ-WHS26','<ul><li><span style=\"background-color: transparent;\">Brand Name: LOGICOWL</span></li><li><span style=\"background-color: transparent;\">Type: Barcode Scanner</span></li><li><span style=\"background-color: transparent;\">Optical Resolution: 600*600</span></li><li><span style=\"background-color: transparent;\">Scan Element Type: CMOS</span></li><li><span style=\"background-color: transparent;\">Certification: CE</span></li><li><span style=\"background-color: transparent;\">Scan Breadth: A4</span></li><li><span style=\"background-color: transparent;\">Scan Speed: 100 scans/second.</span></li><li><span style=\"background-color: transparent;\">Interface Type: USB</span></li><li><span style=\"background-color: transparent;\">Origin: CN(Origin)</span></li><li><span style=\"background-color: transparent;\">Model Number: HS26</span></li><li><span style=\"background-color: transparent;\">Colour Depth: 32 Bit</span></li><li><span style=\"background-color: transparent;\">Product Type: Bar Code Scanner</span></li><li><span style=\"background-color: transparent;\">Scanning Light Source: Laser Light</span></li><li><span style=\"background-color: transparent;\">USB Handheld</span></li><li><span style=\"background-color: transparent;\">100% brand new.</span></li><li><span style=\"background-color: transparent;\">Plug and Play easily</span></li><li><span style=\"background-color: transparent;\">2D QR 1D Bar Code Reader</span></li><li><span style=\"background-color: transparent;\">Fit for Windows and Mac system</span></li><li><span style=\"background-color: transparent;\">Support scan barcode from Screen</span></li><li><span style=\"background-color: transparent;\">Two working mode: Instant upload mode / storage mode. Internal offline storage supports up to 100,00 barcodes in offline storage mode.</span></li><li><span style=\"background-color: transparent;\">Scan and store barcode when far away from the receiver, and then update the data to your device when you come back entering the wireless transmission range.</span></li></ul>',2680.00,2620.00,0,1,'2025-10-02 05:34:49','2025-10-02 06:02:35'),(14,4,'XPrinter T80A','<ul><li><span style=\"background-color: transparent;\">Interface Type: USB+BLUETOOTH</span></li><li><span style=\"background-color: transparent;\">Printing Speed: 160mm/s (38ppm)</span></li><li><span style=\"background-color: transparent;\">Paper roll width: 20mm~80mm</span></li><li><span style=\"background-color: transparent;\">Paper Cut: Auto-cutter</span></li><li><span style=\"background-color: transparent;\">Type: Direct Thermal Cashier/Kitchen Receipt Printer</span></li><li><span style=\"background-color: transparent;\">Weight: 1.5kg</span></li><li><span style=\"background-color: transparent;\">Size: 378*215*180mm</span></li><li><span style=\"background-color: transparent;\">Dot Matrix Printer Type: Ticket printers</span></li><li><span style=\"background-color: transparent;\">Max. Resolution: 203dpi</span></li><li><span style=\"background-color: transparent;\">Black Print Speed: 160mm/second</span></li><li><span style=\"background-color: transparent;\">Fast printing of text and images</span></li><li><span style=\"background-color: transparent;\">Long-lasting auto-cutter with up to 1.5 Million cuts</span></li><li><span style=\"background-color: transparent;\">Friendly utilities, virtual com or USB-hid setting by utilities</span></li><li><span style=\"background-color: transparent;\">Support 8 kinds of different paper widths (Option)</span></li><li><span style=\"background-color: transparent;\">Support wall mounting</span></li><li><span style=\"background-color: transparent;\">Supports desktop mode and wall-mounted mode</span></li><li><span style=\"background-color: transparent;\">Easy paper loading structure, upon paper delivery design, more convenient and fast</span></li><li><span style=\"background-color: transparent;\">One-button design, quickly open the cover to replace consumables</span></li><li><span style=\"background-color: transparent;\">Stylish appearance</span></li><li><span style=\"background-color: transparent;\">High-quality hardware support</span></li><li><span style=\"background-color: transparent;\">Supports Pc, Laptop, Cash Register</span></li></ul>',2342.00,2282.00,0,1,'2025-10-02 05:39:19','2025-10-02 06:01:15'),(15,4,'XPrinter T80Q','<ul><li><span style=\"background-color: transparent;\">Print Method：Direct Line Thermal</span></li><li><span style=\"background-color: transparent;\">Interfaces：USB / Ethernet/Bluetooth (optional)</span></li><li><span style=\"background-color: transparent;\">Print Speed：220mm/s(max)</span></li><li><span style=\"background-color: transparent;\">Resolution：203DPI(8dot/mm)</span></li><li><span style=\"background-color: transparent;\">TPH Reliability：100km</span></li><li><span style=\"background-color: transparent;\">Auto Cutter：Partial</span></li><li><span style=\"background-color: transparent;\">Cutter Life：1.5 million cuts</span></li><li><span style=\"background-color: transparent;\">Printing method: direct line thermal sensitivity</span></li><li><span style=\"background-color: transparent;\">Printing width 72mm</span></li><li><span style=\"background-color: transparent;\">Printing speed 160mm/s</span></li><li><span style=\"background-color: transparent;\">Interface type standard configuration: USB, network port; Optional: USB+serial port, USB+network port,</span></li><li><span style=\"background-color: transparent;\">Paper roll width 79.5 ± 0.5mm × φ 80mm</span></li><li><span style=\"background-color: transparent;\">Paper thickness 0.06-0.08mm</span></li><li><span style=\"background-color: transparent;\">Line spacing 3.75mm (command can be used to adjust line spacing)</span></li></ul>',3051.00,2991.00,0,1,'2025-10-02 05:40:31','2025-10-02 06:01:22'),(16,4,'VOZY G80','<ul><li><span style=\"background-color: transparent;\">Printing speed: 220mm/sec</span></li><li><span style=\"background-color: transparent;\">Interface type: USB+Bluetooth</span></li><li><span style=\"background-color: transparent;\">Print command: compatible with ESC/POS commands</span></li><li><span style=\"background-color: transparent;\">Printing paper width: 79.5±0.5 mm (effective printing width 72 mm)</span></li><li><span style=\"background-color: transparent;\">Printing paper outer diameter: ≤80 mm</span></li><li><span style=\"background-color: transparent;\">Printing paper thickness: 0.06-0.08 mm</span></li><li><span style=\"background-color: transparent;\">Power supply: DC 24V/1.5A</span></li><li><span style=\"background-color: transparent;\">Automatic cutter: half cut</span></li><li><span style=\"background-color: transparent;\">Reliability: 100 kilometers</span></li><li><span style=\"background-color: transparent;\">Appearance size (L*W*H): 174.7*141.7*122.3(mm)</span></li><li><span style=\"background-color: transparent;\">Single unit net weight: 0.84 kg</span></li><li><span style=\"background-color: transparent;\">Gross weight of single unit: 1.22kg</span></li><li><span style=\"background-color: transparent;\">Number of single boxes: 12 units</span></li><li><span style=\"background-color: transparent;\">Gross weight of single box: 15kg</span></li><li><span style=\"background-color: transparent;\">Operating temperature: 0-45℃</span></li><li><span style=\"background-color: transparent;\">Relative humidity: 10-80%</span></li><li><span style=\"background-color: transparent;\">Driver: Win 9X, Win 2000, Win 2003, Win XP, Win Vista, Win 7, Win8, win10, win11, Linux, supports Android and iOS systems</span></li></ul><p><span style=\"background-color: transparent;\">High printing speed 220 mm per second Automatic cutting paper</span></p><p><br></p><p><span style=\"background-color: transparent;\">- Supports English and other 26 other languages. Can load loading logos or images. And can print out</span></p><p><br></p><p><span style=\"background-color: transparent;\">- Compatible with the Loyverse POS program. There are examples. Instructions on how to install and use with Loyverse POS.</span></p><p><br></p><p><br></p><p><span style=\"background-color: transparent;\">Loyverse POS applications can be used on our printer for Android / iOS / Windows systems.</span></p><p><br></p><p><span style=\"background-color: transparent;\">*NOTE: Bluetooth + USB printer does not support Loyverse on iOS system, while all other verisons support iOS**</span></p>',2459.00,2399.00,0,1,'2025-10-02 05:43:43','2025-10-02 06:01:28'),(17,4,'Xprinter 80T','<ul><li><span style=\"background-color: transparent;\">Printing method: Direct line thermal sensitive</span></li><li><span style=\"background-color: transparent;\">Printing width: 72mm</span></li><li><span style=\"background-color: transparent;\">Point density 576 points/row or 512 points/row</span></li><li><span style=\"background-color: transparent;\">Printing speed 200mm/s</span></li><li><span style=\"background-color: transparent;\">Interface type standard configuration: USB, USB+Ethernet port</span></li><li><span style=\"background-color: transparent;\">Paper roll width 79.5 ± 0.5mm φ 80mm (MAX)</span></li><li><span style=\"background-color: transparent;\">Paper thickness 0.06-0.08mm</span></li><li><span style=\"background-color: transparent;\">Row spacing: 3.75mm (can be adjusted with commands)</span></li><li><span style=\"background-color: transparent;\">Character size: ANK characters, Font A: 1.5 x 3.0mm (12 x 24 dots) Font B: 1.1 x 2.1mm (9 x 17 points)</span></li><li><span style=\"background-color: transparent;\">Simplified/Traditional: 3.0 x 3.0mm (24 x 24 dots)</span></li><li><span style=\"background-color: transparent;\">PC347（Standard Europe）、Katakana、PC850（Multilingual）、PC860（Portuguese）、PC863（Canadian-French）、PC865（Nordic）、West Europe、Greek、Hebrew、East Europe、Iran、WPC1252、PC866（Cyrillic#2）、PC852（Latin2）、PC858、IranII、Latvian、Arabic、PT151（1251）UPC-A / UPC-E / JAN13（EAN13）/ JAN8（EAN8）/ CODE39 / ITF / CODABAR / CODE93 / CODE128</span></li><li><span style=\"background-color: transparent;\">Power adapter input: AC 100-240V/50-60Hz, 1.0A</span></li><li><span style=\"background-color: transparent;\">Power output: DC 24V/1.25A</span></li><li><span style=\"background-color: transparent;\">Cash box output DC 24V/1.25A</span></li><li><span style=\"background-color: transparent;\">Physical characteristics weight 0.93kg</span></li><li><span style=\"background-color: transparent;\">Appearance dimensions: 165 * 130 * 124.5mm (depth x width x height)</span></li><li><span style=\"background-color: transparent;\">handphone Bluetooth connect need download \"4barcode\" app,if connect with USB ,need download driver ,then use it</span></li><li>Note, if you need driver,please leave us your email,i will send you the driver and manual,thank you</li></ul>',2940.00,2880.00,0,1,'2025-10-02 05:45:04','2025-10-02 06:01:35'),(18,4,'Xptinter XP-T80A','<ul><li><span style=\"background-color: transparent;\">Model: XP-T80A</span></li><li><span style=\"background-color: transparent;\">Interface type: Bluetooth + USB</span></li><li><span style=\"background-color: transparent;\">Printing Speed: 160mm/s (38ppm)</span></li><li><span style=\"background-color: transparent;\">Paper Roll Width: 20mm~80mm</span></li><li><span style=\"background-color: transparent;\">Paper Cut: Auto cutter</span></li><li><span style=\"background-color: transparent;\">Type: Direct Thermal Reception Printer</span></li><li><span style=\"background-color: transparent;\">Weight: 1.5kg</span></li><li><span style=\"background-color: transparent;\">Size: 378 x 215 x 180mm</span></li><li><span style=\"background-color: transparent;\">Max. Resolution: 203dpi</span></li></ul><p><span style=\"background-color: transparent;\">Ano ang sa Box?</span></p><p><span style=\"background-color: transparent;\">1. Printer</span></p><p><span style=\"background-color: transparent;\">2. User Manual</span></p><p><span style=\"background-color: transparent;\">3. Drive CD paper</span></p><p><span style=\"background-color: transparent;\">5. USB Cable</span></p><p><span style=\"background-color: transparent;\">6. Power Adapter</span></p>',3940.00,3880.00,0,1,'2025-10-02 05:46:07','2025-10-02 06:01:41'),(20,4,'Xprinter XP-N160II','<ul><li><span style=\"background-color: transparent;\">Max Paper Size: 79.5±0.5mm</span></li><li><span style=\"background-color: transparent;\">Max. Resolution: 576 dots/line or 512 dots/line</span></li><li><span style=\"background-color: transparent;\">black print speed: Max 160 mm /s</span></li><li><span style=\"background-color: transparent;\">Color Print Speed: Not supported</span></li><li><span style=\"background-color: transparent;\">brand name: Xprinter</span></li><li><span style=\"background-color: transparent;\">Printing method: Direct Thermal</span></li><li><span style=\"background-color: transparent;\">Max.print width: 72 mm</span></li><li><span style=\"background-color: transparent;\">Media width: 80 mm</span></li><li><span style=\"background-color: transparent;\">Media thickness: 0.06-0.08mm</span></li><li><span style=\"background-color: transparent;\">Auto cutter: Partial</span></li><li><span style=\"background-color: transparent;\">Dimensions: 190*140*131mm (D*W*H)</span></li><li><span style=\"background-color: transparent;\">Input: AC 100-240V 50~60Hz</span></li><li><span style=\"background-color: transparent;\">Output: DC 24V/2.5A</span></li><li><span style=\"background-color: transparent;\">Cash drawer: DC 24V/1A</span></li><li><span style=\"background-color: transparent;\">Driver: Window / Linux / iOS / Android</span></li></ul><p><br></p><p><br></p>',5540.00,5478.00,0,1,'2025-10-02 05:49:36','2025-10-02 05:49:36');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `user_type` enum('admin','manager','staff') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'staff',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mr. Pogi','Business Developement Manager','onpoint@admin.com',NULL,'admin',1,'$2y$10$oW49E3K6t6mNLSDK7rgZ2eDPyDC1l1IgMOmMYMSFK5JBZz3dEZLZ6',NULL,NULL,NULL),(2,'Den','Manager','sample@gmail.com',NULL,'admin',1,'$2y$10$nkBlS.PJl/QoAGlwcBumzewclxDvU.khSrC8UwoccORvmHAE/f7Hq',NULL,'2025-10-02 04:51:58','2025-10-02 04:52:20');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-02 22:05:55
