Random random = new Random();
int target = random.Next(1, 101);
Console.WriteLine("Guess a number between 1 and 100:");
int num= Convert.ToInt32(Console.ReadLine());
while (num != target)
{
    if (num < target)
    {
        Console.WriteLine("Too low!:");
    }
    else if (num > target)
    {
        Console.WriteLine("Too high!:");
    }
    num = Convert.ToInt32(Console.ReadLine());
}
Console.WriteLine("You guessed it!");