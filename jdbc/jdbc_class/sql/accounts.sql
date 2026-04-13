USE lyte_bank;

CREATE TABLE `accounts`(
	id INT PRIMARY KEY AUTO_INCREMENT,
    balance DECIMAL(15, 2)
);

INSERT INTO accounts(balance)
VALUES (1000);