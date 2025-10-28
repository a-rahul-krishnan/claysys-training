------------------------------------------------------------
-- TABLE: Products
------------------------------------------------------------
CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0)
);
GO

------------------------------------------------------------
-- TABLE: Orders
------------------------------------------------------------
CREATE TABLE Orders (
    OrderId INT IDENTITY(1,1) PRIMARY KEY,
    CustomerName NVARCHAR(100) NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50) DEFAULT 'Pending',
    TotalPrice DECIMAL(10,2) DEFAULT 0
);
GO

------------------------------------------------------------
-- TABLE: OrderItems
------------------------------------------------------------
CREATE TABLE OrderItems (
    OrderItemId INT IDENTITY(1,1) PRIMARY KEY,
    OrderId INT NOT NULL FOREIGN KEY REFERENCES Orders(OrderId) ON DELETE CASCADE,
    ProductId INT NOT NULL FOREIGN KEY REFERENCES Products(ProductId),
    Quantity INT NOT NULL CHECK (Quantity > 0),
    Price DECIMAL(10,2) NOT NULL,
    TotalPrice AS (Quantity * Price) PERSISTED
);
GO

------------------------------------------------------------
-- POPULATE Products (20 records)
------------------------------------------------------------
INSERT INTO Products (Name, Price) VALUES
('Cheese Stack', 2.00),
('Greek Style Salad', 4.00),
('30 Chicken Satay & Peanut Dip', 11.00),
('Wrap Platter', 15.00),
('Moroccan Style Couscous', 3.00),
('BBQ Chicken Burger', 9.00),
('Veggie Delight Sandwich', 5.00),
('Classic Caesar Salad', 7.00),
('Spicy Paneer Wrap', 8.00),
('Chocolate Brownie', 4.50),
('Fresh Fruit Bowl', 6.00),
('Grilled Salmon Meal', 14.00),
('Pasta Alfredo', 12.00),
('Beef Steak', 18.00),
('Margherita Pizza', 10.00),
('Tandoori Chicken Platter', 13.00),
('Avocado Toast', 6.50),
('Berry Smoothie', 5.00),
('Garlic Breadsticks', 3.50),
('Mushroom Risotto', 11.50);
GO
