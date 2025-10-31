
-- Database: order-management
-- TABLE: Products

CREATE TABLE Products (
    ProductId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Price DECIMAL(10,2) NOT NULL CHECK (Price >= 0),
    Stock INT NOT NULL CHECK (Stock > 0)
);
GO

-- TABLE: Orders

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

-- POPULATE Products

INSERT INTO Products (Name, Price, Stock) VALUES
('Cheese Stack', 2.00, 120),
('Greek Style Salad', 4.00, 80),
('30 Chicken Satay & Peanut Dip', 11.00, 50),
('Wrap Platter', 15.00, 40),
('Moroccan Style Couscous', 3.00, 90),
('BBQ Chicken Burger', 9.00, 70),
('Veggie Delight Sandwich', 5.00, 100),
('Classic Caesar Salad', 7.00, 85),
('Spicy Paneer Wrap', 8.00, 65),
('Chocolate Brownie', 4.50, 150),
('Fresh Fruit Bowl', 6.00, 75),
('Grilled Salmon Meal', 14.00, 35),
('Pasta Alfredo', 12.00, 60),
('Beef Steak', 18.00, 30),
('Margherita Pizza', 10.00, 50),
('Tandoori Chicken Platter', 13.00, 45),
('Avocado Toast', 6.50, 95),
('Berry Smoothie', 5.00, 110),
('Garlic Breadsticks', 3.50, 130),
('Mushroom Risotto', 11.50, 55);
GO
