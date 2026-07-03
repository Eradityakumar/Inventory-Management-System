-- Database: inventory
CREATE DATABASE IF NOT EXISTS inventory;
USE inventory;

-- inv_user
CREATE TABLE IF NOT EXISTS inv_user (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) DEFAULT 'staff',
  contact_no VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS Brands (
  brand_id INT PRIMARY KEY AUTO_INCREMENT,
  brand_name VARCHAR(100),
  description TEXT
);

CREATE TABLE IF NOT EXISTS Categories (
  category_id INT PRIMARY KEY AUTO_INCREMENT,
  category_name VARCHAR(100),
  description TEXT
);

CREATE TABLE IF NOT EXISTS Providers (
  provider_id INT PRIMARY KEY AUTO_INCREMENT,
  provider_name VARCHAR(150),
  address VARCHAR(255),
  contact_no VARCHAR(20),
  website VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Products (
  product_id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(150),
  brand_id INT,
  category_id INT,
  provider_id INT,
  price DECIMAL(10,2) DEFAULT 0,
  stock INT DEFAULT 0,
  active TINYINT(1) DEFAULT 1,
  description TEXT,
  FOREIGN KEY (brand_id) REFERENCES Brands(brand_id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES Categories(category_id) ON DELETE SET NULL,
  FOREIGN KEY (provider_id) REFERENCES Providers(provider_id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Customer_cart (
  cart_id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT,
  quantity INT,
  user_id INT,
  FOREIGN KEY (product_id) REFERENCES Products(product_id),
  FOREIGN KEY (user_id) REFERENCES inv_user(user_id)
);

CREATE TABLE IF NOT EXISTS Invoice (
  invoice_id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  total_amount DECIMAL(10,2),
  date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES inv_user(user_id)
);

CREATE TABLE IF NOT EXISTS Transaction (
  transaction_id INT PRIMARY KEY AUTO_INCREMENT,
  invoice_id INT,
  product_id INT,
  user_id INT,
  quantity INT,
  price DECIMAL(10,2),
  transaction_type VARCHAR(20),
  date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoice_id) REFERENCES Invoice(invoice_id),
  FOREIGN KEY (product_id) REFERENCES Products(product_id),
  FOREIGN KEY (user_id) REFERENCES inv_user(user_id)
);
