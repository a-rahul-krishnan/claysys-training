using System;
using System.Collections.Generic;
using System.Linq;

Console.WriteLine("Lambda Expressions:");

List<int> numbers = new List<int> { 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 };
Console.WriteLine("Original Numbers in the List: " + string.Join(", ", numbers));

var evenNumbers = numbers.Where(n => n % 2 == 0).ToList();
Console.WriteLine("Even Numbers in the List: " + string.Join(", ", evenNumbers));
