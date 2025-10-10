using System;

delegate int MathOperation(int a, int b);


class Program
{
    static int Add(int a, int b) => a + b;
    static int Subtract(int a, int b) => a - b;
    static int Multiply(int a, int b) => a * b;
    static int Divide(int a, int b) => b != 0 ? a / b : 0;
    static void Main()
    {
        MathOperation op;
        Console.WriteLine("Delegate MathOperation demonstration:");

        op = Add;
        Console.WriteLine("Addition: 10 + 5 = " + op(10, 5));

        op = Subtract;
        Console.WriteLine("Subtraction: 10 - 5 = " + op(10, 5));

        op = Multiply;
        Console.WriteLine("Multiplication: 10 * 5 = " + op(10, 5));

        op = Divide;
        Console.WriteLine("Division: 10 / 5 = "+ op(10, 5));
    }


}