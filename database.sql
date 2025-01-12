-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: track
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `interv`
--

DROP TABLE IF EXISTS `interv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interv` (
  `Staff_ID` int NOT NULL AUTO_INCREMENT,
  `name_` varchar(255) DEFAULT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `district` varchar(255) DEFAULT NULL,
  `governorate` varchar(255) DEFAULT NULL,
  `gov_num` int DEFAULT NULL,
  `delegation` varchar(255) DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `lattitude` double DEFAULT NULL,
  `bounded_radius_km` decimal(5,2) DEFAULT NULL,
  PRIMARY KEY (`Staff_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interv`
--

LOCK TABLES `interv` WRITE;
/*!40000 ALTER TABLE `interv` DISABLE KEYS */;
INSERT INTO `interv` VALUES (1,'mohamed','lahmar','Grand Tunis','Ben Arous',3,'Radès',10.27380711,36.7738695,2.50),(2,'sana','labyadh','Nord Ouest','EL Kef',10,'Kef Est',8.69560967,36.1623812,3.00),(3,'youssef','ben abdallah','Nord Ouest','Jendouba',9,'Ghardimaou',8.43647861,36.449602,2.75),(4,'seif','omran','Centre Ouest','Kasserine',17,'El Ayoun',8.88485476,35.5392186,4.00),(5,'khalil','omran','Sud Est','Gabes',19,'Nouvelle Matmata',10.0144155,33.6670825,3.50),(6,'zeineb','khalil','Centre Ouest','Kasserine',17,'Sbiba',9.07397829,35.54187236,2.90),(7,'khalil','ahmad','Grand Tunis','Tunis',1,'El Omrane Supérieur',10.13301053,36.82933803,5.00),(8,'nour','abdallah','Grand Tunis','Manouba',4,'Oued Ellil',10.03996719,36.83440463,4.50),(9,'nour','helmi','Sud Ouest','Tozeur',23,'Degach',8.23761068,33.99996488,3.20),(10,'samira','metweli','Sud Est','Gabes',19,'Gabes Sud',10.11424603,33.8434111,2.80),(11,'zeineb','eskandar','Grand Tunis','Tunis',1,'El Hrairia',10.10945914,36.78366543,4.20),(12,'souhe','turki','Sud Ouest','Tozeur',23,'Tozeur',8.12260322,33.92195594,3.60),(13,'souhe','lahmar','Sud Ouest','Tozeur',23,'Nefta',7.8849641,33.87402701,2.50),(14,'Nour','souissi','Centre Est','Sfax',15,'Djebeniana',10.90972896,35.03153849,4.80),(15,'wassim','souissi','Centre Est','Sfax',15,'Sfax Ville',10.72666198,34.74105479,3.70),(16,'souhe','khadhar','Centre Est','Sfax',15,'Sfax Sud',10.72667281,34.74096352,2.90),(17,'wassim','kamoun','Sud Ouest','Kebili',24,'Souk El Ahed',9.012546667,33.57825167,4.00),(18,'khalil','kamoun','Centre Est','Sfax',15,'Sakiet Eddaïer',10.78152835,34.79768933,3.80),(19,'zeineb','ferjeni','Sud Ouest','Kebili',24,'Kebili Sud',8.97385381,33.70591065,2.60),(20,'khalil','charbti','Sud Ouest','Kebili',24,'Douz Nord',9.02665417,33.45740645,4.50),(21,'hedi','daoud','Centre Est','Sfax',15,'Menzel Chaker',10.37190398,34.96690585,3.30),(22,'Samira','ben ali','Grand Tunis','Ben Arous',3,'El Mourouj',10.27380711,36.7738695,2.40),(23,'ahmed','bousnina','Nord Ouest','EL Kef',10,'Kef Ouest',8.69560967,36.1623812,3.10),(24,'fatma','zohra','Nord Ouest','Jendouba',9,'Ain Draham',8.43647861,36.449602,2.80),(25,'mohamed','salah','Centre Ouest','Kasserine',17,'Kasserine Nord',8.88485476,35.5392186,4.20),(26,'nour','bousnina','Sud Est','Gabes',19,'Gabes Nord',10.0144155,33.6670825,3.90),(27,'sami','khalil','Centre Ouest','Kasserine',17,'Thala',9.07397829,35.54187236,2.70),(28,'hicham','ben ali','Grand Tunis','Tunis',1,'La Marsa',10.13301053,36.82933803,4.80),(29,'sara','ben hassen','Grand Tunis','Manouba',4,'Tebourba',10.03996719,36.83440463,3.50),(43,'Samira','metweli','Grand Tunis','Ben Arous',3,'Hammam Lif',10.34616443,36.72161712,3.30),(44,'wassim','lakhal','Nord Est','Nabeul',5,'Menzel Bouzelfa',10.58480427,36.67480955,4.50),(45,'youssef','geddech','Nord Est','Nabeul',5,'Hammamet',10.61169645,36.40599996,2.30),(46,'wassim','ben mouhamed','Nord Est','Nabeul',5,'Nabeul',10.73537109,36.45308878,2.60),(47,'Nour','souissi','Nord Est','Bizerte',7,'Zarzouna',9.8785202,37.26059491,2.40),(48,'wassim','lanjar','Nord Est','Bizerte',7,'Menzel Djemil',9.91649064,37.23567338,5.00),(49,'khalil','tangour','Nord Est','Zaghouan',6,'En-Nadhour',10.09506007,36.11634069,3.20),(50,'souhe','hacheni','Centre Est','Sousse',12,'Kalaâ Kebira',10.53396388,35.87122512,3.60),(51,'khalil','hdidane','Centre Est','Sousse',12,'Kalaâ Kebira',10.5337827,35.87125343,4.10),(52,'wassim','sinini','Centre Est','Mahdia',14,'Ksour Essef',10.99865468,35.4183752,4.23),(53,'souhe','khadhar','Centre Est','Sousse',12,'Sidi El Héni',10.30954704,35.68192871,3.60);
/*!40000 ALTER TABLE `interv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `staff`
--

DROP TABLE IF EXISTS `staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `staff` (
  `id` varchar(50) NOT NULL,
  `current_lat` decimal(10,8) DEFAULT NULL,
  `current_lng` decimal(11,8) DEFAULT NULL,
  `base_lat` decimal(10,8) DEFAULT NULL,
  `base_lng` decimal(11,8) DEFAULT NULL,
  `boundary_radius_km` decimal(10,2) DEFAULT '5.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `staff`
--

LOCK TABLES `staff` WRITE;
/*!40000 ALTER TABLE `staff` DISABLE KEYS */;
INSERT INTO `staff` VALUES ('5',36.80491697,10.09099952,NULL,NULL,5.00);
/*!40000 ALTER TABLE `staff` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-12 16:28:55
