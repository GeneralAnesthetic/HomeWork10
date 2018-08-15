drop database if exists bamazon_DB;

Create Database bamazon_DB;

use bamazon_DB;

Create Table products(
item_id INT auto_increment Not NULL,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
 price DECIMAL(10,2) NOT NULL,
stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
  );
  
Create Table departments (
  department_id INT auto_increment Not NULL,
  department_name VARCHAR(100) NOT NULL,
 over_head_costs DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (department_id));
  
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("nose-hair clippers", "clippers", 2.50, 10), ("artificial limbs", "limbs", 12.50, 7), ("little translucent animals", "holiday gifts", 14.85, 8), ("sepsis", "health-hackers", 9.50, 10), ("chunks of oderless plastic", "indoor recreation", 12.50, 7), ("tubs", "chickpeas & tubs", 200.85, 8), ("back-hair lather", "chickpeas & tubs", 8.98, 20), ("dinosaur memorabelia", "limb", 10.50, 300), ("hair-graying agents", "holiday gifts", 13.95, 6),  ("transparent air-free ballons", "indoor recreation", 42.20, 6);
 
 Select * from products;