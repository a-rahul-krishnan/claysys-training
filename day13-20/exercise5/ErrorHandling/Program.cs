Console.WriteLine("Enter Num1:");
int num1 = Convert.ToInt32(Console.ReadLine());

Console.WriteLine("Enter Num2:");
int num2 = Convert.ToInt32(Console.ReadLine());

float result=Division(num1, num2);
Console.WriteLine(num1+ " / " + num2+" = " + result);
static float Division(int x, int y)
{
    try
    {
         return x / y;

    }
    catch (DivideByZeroException e)
    {
        //Division by zero Error
        Console.WriteLine(e.Message);
        return -1;
    }
}