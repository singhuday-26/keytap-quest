
import { CodeSnippet } from "@/types";

export const codeSnippets: CodeSnippet[] = [
  {
    id: "js-1",
    language: "javascript",
    title: "Array Map Function",
    difficulty: "easy",
    code: `// Map an array of numbers to their squared values
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(num => num * num);

console.log(squared); // [1, 4, 9, 16, 25]`,
  },
  {
    id: "js-2",
    language: "javascript",
    title: "Promise Chain",
    difficulty: "medium",
    code: `// Fetch data and process it with promises
fetch('https://api.example.com/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Data:', data);
    return processData(data);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });`,
  },
  {
    id: "py-1",
    language: "python",
    title: "List Comprehension",
    difficulty: "easy",
    code: `# Generate a list of squares using list comprehension
numbers = [1, 2, 3, 4, 5]
squared = [num * num for num in numbers]

print(squared)  # [1, 4, 9, 16, 25]`,
  },
  {
    id: "py-2",
    language: "python",
    title: "Class Definition",
    difficulty: "medium",
    code: `# Define a simple class with methods
class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age
        
    def greet(self):
        return f"Hello, my name is {self.name} and I'm {self.age} years old."
        
    def celebrate_birthday(self):
        self.age += 1
        return f"Happy Birthday! Now I'm {self.age} years old."

# Create an instance
person = Person("Alice", 30)
print(person.greet())`,
  },
  {
    id: "ts-1",
    language: "typescript",
    title: "Interface Definition",
    difficulty: "easy",
    code: `// Define an interface for a User
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  role?: 'admin' | 'user' | 'guest';
}

// Implement the interface
const newUser: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  isActive: true,
  role: 'user'
};

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`;
}`,
  },
  {
    id: "java-1",
    language: "java",
    title: "Java Stream API",
    difficulty: "medium",
    code: `// Using Java Stream API to filter and map a list
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StreamExample {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        List<Integer> evenSquares = numbers.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .collect(Collectors.toList());
            
        System.out.println(evenSquares); // [4, 16, 36, 64, 100]
    }
}`,
  },
  {
    id: "cpp-1",
    language: "cpp",
    title: "Vector Operations",
    difficulty: "medium",
    code: `#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    // Create a vector with some elements
    std::vector<int> numbers = {5, 2, 8, 1, 9, 3};
    
    // Sort the vector
    std::sort(numbers.begin(), numbers.end());
    
    // Print the sorted vector
    std::cout << "Sorted vector: ";
    for (const auto& num : numbers) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    // Find an element
    auto it = std::find(numbers.begin(), numbers.end(), 8);
    if (it != numbers.end()) {
        std::cout << "Found 8 at position: " 
                  << (it - numbers.begin()) << std::endl;
    }
    
    return 0;
}`,
  }
];

export const getSnippetsByLanguage = (language: string): CodeSnippet[] => {
  return codeSnippets.filter(snippet => snippet.language === language);
};

export const getSnippetById = (id: string): CodeSnippet | undefined => {
  return codeSnippets.find(snippet => snippet.id === id);
};
