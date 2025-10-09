using System;
using System.Collections.Generic;

// ----------- Test with integers -----------
Stack<int> intStack = new Stack<int>();
intStack.Push(10);
intStack.Push(20);
intStack.Push(30);

Console.WriteLine("Integer Stack:");
Console.WriteLine("Peek: " + intStack.Peek()); // 30
Console.WriteLine("Pop: " + intStack.Pop());   // 30
Console.WriteLine("Pop: " + intStack.Pop());   // 20

// ----------- Test with strings -----------
Stack<string> stringStack = new Stack<string>();
stringStack.Push("Alice");
stringStack.Push("Bob");
stringStack.Push("Charlie");

Console.WriteLine("\nString Stack:");
Console.WriteLine("Peek: " + stringStack.Peek()); // Charlie
Console.WriteLine("Pop: " + stringStack.Pop());   // Charlie
Console.WriteLine("Pop: " + stringStack.Pop());   // Bob

Console.WriteLine("\nIs string stack empty? " + stringStack.IsEmpty());


// Generic Stack<T> class
public class Stack<T>
{
    private List<T> elements = new List<T>();

    public void Push(T item)
    {
        elements.Add(item);
    }

    public T Pop()
    {
        if (elements.Count == 0)
            throw new InvalidOperationException("Stack is empty.");

        T top = elements[^1]; // ^1 is the last element
        elements.RemoveAt(elements.Count - 1);
        return top;
    }

    public T Peek()
    {
        if (elements.Count == 0)
            throw new InvalidOperationException("Stack is empty.");

        return elements[^1];
    }

    public bool IsEmpty() => elements.Count == 0;
}
