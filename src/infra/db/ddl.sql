-- veiculosoperacionais.caminhoes definição

CREATE TABLE `caminhoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `placa` varchar(7) NOT NULL,
  `nome_condutor` varchar(255) NOT NULL,
  `municipio_uf` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;