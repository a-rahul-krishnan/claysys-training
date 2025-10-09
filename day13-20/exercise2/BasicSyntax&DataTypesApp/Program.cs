/*
Basic Synatx 
    and 
Data Types in C#
 */

//(I) Data Types :
Console.WriteLine("Basic Data Types in C#:\n");
//1. int - Integer :
int age = 25;
Console.WriteLine("Integer: " + age);

//2. float - Floating Point Number :
float height = 5.9f;
Console.WriteLine("Float: " + height);

//3. double - Double Precision Floating Point Number :
double price = 19.99;  
Console.WriteLine("Double: " + price);

//4. char - Character :
char grade = 'A';
Console.WriteLine("Char: " + grade);

//5. string - String of Characters :
string name = "John Doe";
Console.WriteLine("String: " + name);

//6. bool - Boolean :
bool isStudent = true;
Console.WriteLine("Boolean: " + isStudent);

//7. long - Long Integer :
long population = 7800000000;
Console.WriteLine("Long: " + population);

// (II) Basic Arithmatic Operations :
Console.WriteLine("\n\nBasic Arithmatic Operations in C#:\n");

//1. Addtion :
Console.WriteLine("Addition : " + age + " + 10 = " + (age + 10));

//2. Subraction :
Console.WriteLine("Subraction : " + age + " - 15 = " + (age - 15));

//3. Multiplication : 
Console.WriteLine("Multiplication : " + age + " * 5 = " + (age * 5));

//4. Division : 
Console.WriteLine("Division : " + age + " / 5 = " + (age / 5));

//5. Remainder :
Console.WriteLine("Remainder : " + age + " % 4 = " + (age % 4));


// (III) Basic Operators in C# :
Console.WriteLine("\n\nBasic Comparison Operators Example in C#:\n");
Console.WriteLine("Age:"+age);
Console.Write("Voting Elegibility : ");
if (age >= 18) {
    Console.Write("Yes\n");
}
else {
    Console.Write("No\n");
}

Console.WriteLine("\n\nBasic Logical Operators Example in C#:\n");
Console.WriteLine("Age:" + age);
Console.WriteLine("Is Student:" + isStudent);
Console.Write("Offer Eligibility : ");
if (age >= 18 && isStudent)
{
    Console.Write("Yes\n");
}
else
{
    Console.Write("No\n");
}