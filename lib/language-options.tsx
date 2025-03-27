import { PythonIcon, Html5Icon, JavaIcon, CIcon, JavascriptIcon, GoIcon, PhpIcon } from "@/components/language-icons"

export const languageOptions = [
  {
    id: "javascript",
    name: "JavaScript",
    monaco: "javascript",
    fileName: "main.js",
    icon: <JavascriptIcon />,
    defaultCode: `// JavaScript Hello World
console.log("Hello, World!");
`,
  },
  {
    id: "python",
    name: "Python",
    monaco: "python",
    fileName: "main.py",
    icon: <PythonIcon />,
    defaultCode: `# Python Hello World
print("Hello, World!")
`,
  },
  {
    id: "java",
    name: "Java",
    monaco: "java",
    fileName: "Main.java",
    icon: <JavaIcon />,
    defaultCode: `// Java Hello World
public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}
`,
  },
  {
    id: "cpp",
    name: "C++",
    monaco: "cpp",
    fileName: "main.cpp",
    icon: <CIcon />,
    defaultCode: `// C++ Hello World
#include <iostream>
using namespace std;

int main() {
  cout << "Hello, World!" << endl;
  return 0;
}
`,
  },
  {
    id: "c",
    name: "C",
    monaco: "c",
    fileName: "main.c",
    icon: <CIcon />,
    defaultCode: `// C Hello World
#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}
`,
  },
  {
    id: "php",
    name: "PHP",
    monaco: "php",
    fileName: "index.php",
    icon: <PhpIcon />,
    defaultCode: `<?php
// PHP Hello World
echo "Hello, World!";
?>
`,
  },
  {
    id: "go",
    name: "Go",
    monaco: "go",
    fileName: "main.go",
    icon: <GoIcon />,
    defaultCode: `// Go Hello World
package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}
`,
  },
  {
    id: "html",
    name: "HTML",
    monaco: "html",
    fileName: "index.html",
    icon: <Html5Icon />,
    defaultCode: `<!DOCTYPE html>
<html>
<head>
  <title>Hello World</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>
`,
  },
]

