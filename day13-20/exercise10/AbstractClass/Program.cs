using System;
using System.Collections.Generic;

Console.WriteLine("=== Shapes Area & Perimeter Demo ===\n");

// Create a list of shapes
var shapes = new List<Shape>
{
    new Rectangle { Width = 5, Height = 10 },
    new Triangle { A = 3, B = 4, C = 5 },
    new Circle { Radius = 7 }
};

double totalArea = 0;
double totalPerimeter = 0;

// Calculate and display area & perimeter for each shape
foreach (var shape in shapes)
{
    double area = shape.GetArea();
    double perimeter = shape.GetPerimeter();

    totalArea += area;
    totalPerimeter += perimeter;

    Console.WriteLine($"{shape.GetType().Name}:");
    Console.WriteLine($"  Area = {area:F2}");
    Console.WriteLine($"  Perimeter = {perimeter:F2}\n");
}

// Display totals
Console.WriteLine($"Total Area of all shapes: {totalArea:F2}");
Console.WriteLine($"Total Perimeter of all shapes: {totalPerimeter:F2}\n");

// -----------------
// Abstract base class
// -----------------
public abstract class Shape
{
    public abstract double GetArea();
    public abstract double GetPerimeter();
}

// Rectangle
public class Rectangle : Shape
{
    public double Width { get; set; }
    public double Height { get; set; }

    public override double GetArea() => Width * Height;
    public override double GetPerimeter() => 2 * (Width + Height);
}

// Triangle
public class Triangle : Shape
{
    public double A, B, C;

    public override double GetArea()
    {
        double s = (A + B + C) / 2;
        return Math.Sqrt(s * (s - A) * (s - B) * (s - C));
    }

    public override double GetPerimeter() => A + B + C;
}

// Circle
public class Circle : Shape
{
    public double Radius;

    public override double GetArea() => Math.PI * Radius * Radius;
    public override double GetPerimeter() => 2 * Math.PI * Radius;
}
