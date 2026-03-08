// Phase 1: Coding Foundations (Days 1-40) — Specific content per day
module.exports = {
1: {
  content: `### Day 1: Python Install, VS Code Setup, and Hello World

**What is Python?**
Python is a high-level, interpreted programming language. It is the #1 language for AI, ML, data science, and automation. Product companies like Google, Netflix, and Instagram use Python extensively.

**Step-by-Step Setup:**

**1. Install Python 3.10+**
- Go to [python.org](https://python.org) → Downloads → Download the latest version.
- During installation, **check "Add Python to PATH"** (very important!).
- Open your terminal and verify: \`python --version\`

**2. Install VS Code**
- Download from [code.visualstudio.com](https://code.visualstudio.com).
- Install the **Python extension** by Microsoft from the Extensions tab.
- Enable **auto-save** in settings for convenience.

**3. Write Your First Program**
- Create a new file: \`hello.py\`
- Type: \`print("Hello, World!")\`
- Run it: Press \`Ctrl + F5\` or use the terminal: \`python hello.py\`

**4. Install Essential Packages**
\`\`\`
pip install numpy pandas matplotlib scikit-learn
\`\`\`

**5. Virtual Environments (Best Practice)**
\`\`\`
python -m venv myenv
myenv\\Scripts\\activate    # Windows
source myenv/bin/activate  # Mac/Linux
\`\`\`

**Why This Matters:** Clean setup = fewer bugs later. Product companies expect you to manage environments and dependencies from day one.`,

  code: `# Day 1: Your First Python Program
# Run this file: python hello.py

# 1. Basic output
print("Hello, World!")
print("Welcome to your AI/ML journey!")

# 2. Check Python version
import sys
print(f"Python version: {sys.version}")

# 3. Check if key packages are installed
packages = ["numpy", "pandas", "sklearn"]
for pkg in packages:
    try:
        __import__(pkg)
        print(f"  ✅ {pkg} is installed")
    except ImportError:
        print(f"  ❌ {pkg} NOT installed → pip install {pkg}")

# 4. Simple math to verify Python works
result = 2 + 3
print(f"\\n2 + 3 = {result}")
print("Setup complete! You're ready to code.")`,

  questions: [
    "What does 'Add Python to PATH' mean and why is it important during installation?",
    "How do you check which version of Python is installed on your computer?",
    "What is a virtual environment and why should you use one for every project?",
    "Write a Python program that prints your name, age, and favorite programming language."
  ]
},

2: {
  content: `### Day 2: Variables — Strings, Integers, Floats, and Booleans

**What is a Variable?**
A variable is a named container that stores a value. Think of it as a label on a box — the label is the variable name, and the contents are the value.

**Python's Core Data Types:**

| Type | Example | Use Case |
|------|---------|----------|
| \`str\` | \`"hello"\` | Names, text, messages |
| \`int\` | \`42\` | Counts, IDs, ages |
| \`float\` | \`3.14\` | Prices, percentages, measurements |
| \`bool\` | \`True\` / \`False\` | Flags, conditions, yes/no |

**Variable Rules:**
- Must start with a letter or underscore: \`age\`, \`_count\` ✅
- Cannot start with a number: \`2name\` ❌
- Case-sensitive: \`Name\` and \`name\` are different
- Use snake_case: \`user_name\`, \`total_price\` (Python convention)

**Type Checking and Conversion:**
- \`type(x)\` — returns the data type of x
- \`int("5")\` — converts string to integer
- \`str(42)\` — converts integer to string
- \`float("3.14")\` — converts string to float

**f-Strings (Formatted Strings):**
The modern way to embed variables inside strings:
\`\`\`python
name = "Ruban"
age = 25
print(f"My name is {name} and I am {age} years old.")
\`\`\`

**Why This Matters:** Every program uses variables. Understanding types prevents bugs like adding a string to a number.`,

  code: `# Day 2: Variables and Data Types

# String — text data
name = "Ruban"
city = "Chennai"
greeting = f"Hello, I'm {name} from {city}!"
print(greeting)

# Integer — whole numbers
age = 25
year = 2026
days_in_year = 365
print(f"Age: {age}, Year: {year}")

# Float — decimal numbers
height = 5.9
pi = 3.14159
price = 499.99
print(f"Height: {height} ft, Price: ₹{price}")

# Boolean — True or False
is_student = True
has_experience = False
print(f"Student: {is_student}, Experienced: {has_experience}")

# Type checking
print(f"\\nType of name: {type(name)}")       # <class 'str'>
print(f"Type of age: {type(age)}")           # <class 'int'>
print(f"Type of height: {type(height)}")     # <class 'float'>
print(f"Type of is_student: {type(is_student)}")  # <class 'bool'>

# Type conversion
age_str = str(age)         # int → str
price_int = int(price)     # float → int (truncates: 499)
num = int("100")           # str → int
print(f"\\nConverted: '{age_str}', {price_int}, {num}")

# Multiple assignment
x, y, z = 10, 20, 30
print(f"x={x}, y={y}, z={z}")

# Swap two variables (Pythonic way)
a, b = 5, 10
a, b = b, a
print(f"After swap: a={a}, b={b}")`,

  questions: [
    "What are the 4 basic data types in Python? Give an example of each.",
    "What is the difference between int and float? When would you use each?",
    "What happens if you try: print('Age: ' + 25)? How do you fix it?",
    "Write code to swap two variables without using a third variable."
  ]
},

3: {
  content: `### Day 3: Input/Output — Building Interactive CLI Programs

**The print() Function:**
\`print()\` outputs text to the terminal. It's your primary debugging tool.

**Formatting Options:**
- **f-strings:** \`f"Hello {name}"\` — cleanest, most modern
- **sep and end:** \`print("a", "b", sep="-", end="!\\n")\` → \`a-b!\`
- **Multi-line:** Triple quotes \`\"\"\"like this\"\"\"\`

**The input() Function:**
\`input()\` reads text from the user. It **always returns a string**.
\`\`\`python
name = input("Enter your name: ")
age = int(input("Enter your age: "))  # Convert to int
\`\`\`

**Building a CLI Program:**
A Command Line Interface (CLI) program interacts with users through text. Real tools like \`git\`, \`pip\`, and \`docker\` are all CLI programs.

**Best Practices:**
- Always show clear prompts: \`"Enter your age: "\`
- Validate input before using it
- Use f-strings for clean output formatting
- Handle errors with try/except for invalid input`,

  code: `# Day 3: Input/Output — Interactive Programs

# Basic output
print("Welcome to the BMI Calculator!")
print("=" * 35)

# Getting user input
name = input("Enter your name: ")
weight = float(input("Enter weight (kg): "))
height = float(input("Enter height (m): "))

# Calculate BMI
bmi = weight / (height ** 2)

# Output with formatting
print(f"\\nResults for {name}:")
print(f"  Weight: {weight} kg")
print(f"  Height: {height} m")
print(f"  BMI:    {bmi:.1f}")

# Conditional output
if bmi < 18.5:
    print("  Status: Underweight")
elif bmi < 25:
    print("  Status: Normal weight ✅")
elif bmi < 30:
    print("  Status: Overweight")
else:
    print("  Status: Obese")

# Print with separators
print("\\n" + "-" * 35)
print("Thank you for using BMI Calculator!")

# Useful print tricks
print("Apple", "Banana", "Cherry", sep=" | ")  # Custom separator
print("Loading", end="...")  # No newline
print("Done!")`,

  questions: [
    "Why does input() always return a string? How do you convert it to a number?",
    "What is the difference between print(end='') and print(end='\\n')?",
    "Build a simple calculator that takes two numbers and an operator (+,-,*,/) from the user.",
    "How would you handle the case where a user enters 'abc' when you expect a number?"
  ]
},

4: {
  content: `### Day 4: Operators — Arithmetic, Comparison, and Assignment

**Arithmetic Operators:**
| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| \`+\` | Addition | \`5 + 3\` | \`8\` |
| \`-\` | Subtraction | \`5 - 3\` | \`2\` |
| \`*\` | Multiplication | \`5 * 3\` | \`15\` |
| \`/\` | Division (float) | \`7 / 2\` | \`3.5\` |
| \`//\` | Floor Division | \`7 // 2\` | \`3\` |
| \`%\` | Modulo (remainder) | \`7 % 2\` | \`1\` |
| \`**\` | Exponentiation | \`2 ** 3\` | \`8\` |

**Comparison Operators (return True/False):**
\`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`

**Assignment Operators:**
\`=\`, \`+=\`, \`-=\`, \`*=\`, \`/=\`, \`//=\`, \`%=\`, \`**=\`

**Operator Precedence (PEMDAS):**
\`**\` → \`*\`, \`/\`, \`//\`, \`%\` → \`+\`, \`-\` → Comparisons → \`not\` → \`and\` → \`or\`

**Key Insight:** \`/\` always returns float. Use \`//\` for integer division.`,

  code: `# Day 4: Operators in Python

# Arithmetic Operators
a, b = 17, 5
print(f"{a} + {b} = {a + b}")     # 22
print(f"{a} - {b} = {a - b}")     # 12
print(f"{a} * {b} = {a * b}")     # 85
print(f"{a} / {b} = {a / b}")     # 3.4 (always float)
print(f"{a} // {b} = {a // b}")   # 3 (floor division)
print(f"{a} % {b} = {a % b}")     # 2 (remainder)
print(f"{a} ** {b} = {a ** b}")   # 1419857 (power)

# Comparison Operators
x, y = 10, 20
print(f"\\n{x} == {y}: {x == y}")   # False
print(f"{x} != {y}: {x != y}")     # True
print(f"{x} > {y}: {x > y}")       # False
print(f"{x} <= {y}: {x <= y}")     # True

# Assignment Operators
score = 100
score += 10   # score = score + 10
print(f"\\nScore after +=10: {score}")  # 110
score *= 2
print(f"Score after *=2: {score}")     # 220

# Practical: Calculate total with tax
price = 1500
tax_rate = 0.18
tax = price * tax_rate
total = price + tax
print(f"\\nPrice: ₹{price}")
print(f"Tax (18%): ₹{tax}")
print(f"Total: ₹{total}")

# Check if number is even or odd
num = 15
is_even = (num % 2 == 0)
print(f"\\n{num} is even: {is_even}")`,

  questions: [
    "What is the difference between / and // in Python? Give an example.",
    "What does the modulo operator % do? How can you use it to check if a number is even?",
    "What is operator precedence? What does 2 + 3 * 4 evaluate to and why?",
    "Write a program that calculates the total price after applying an 18% GST tax."
  ]
},

5: {
  content: `### Day 5: Logical Operators — AND, OR, NOT in Conditions

**What are Logical Operators?**
Logical operators combine multiple conditions into a single True/False result.

| Operator | Meaning | Example | Result |
|----------|---------|---------|--------|
| \`and\` | Both must be True | \`True and False\` | \`False\` |
| \`or\` | At least one True | \`True or False\` | \`True\` |
| \`not\` | Inverts the value | \`not True\` | \`False\` |

**Truth Tables:**
\`\`\`
AND:  T and T = T    OR:  T or T = T    NOT:  not T = F
      T and F = F          T or F = T          not F = T
      F and T = F          F or T = T
      F and F = F          F or F = F
\`\`\`

**Short-Circuit Evaluation:**
- \`and\` stops at the first False (why check further?)
- \`or\` stops at the first True

**Real-World Use Cases:**
- Login: \`if username == "admin" and password == "1234":\`
- Eligibility: \`if age >= 18 or has_guardian_consent:\`
- Validation: \`if not email.endswith("@"):\`

**Combining with Comparison Operators:**
\`\`\`python
age = 25
income = 50000
if age >= 21 and income >= 30000:
    print("Loan approved")
\`\`\``,

  code: `# Day 5: Logical Operators — AND, OR, NOT

# Basic logical operators
print("=== Truth Table Demo ===")
print(f"True and True  = {True and True}")
print(f"True and False = {True and False}")
print(f"True or False  = {True or False}")
print(f"False or False = {False or False}")
print(f"not True       = {not True}")
print(f"not False      = {not False}")

# Practical: Login system
print("\\n=== Login System ===")
username = "admin"
password = "secure123"

if username == "admin" and password == "secure123":
    print("✅ Login successful!")
else:
    print("❌ Invalid credentials")

# Practical: Age eligibility check
print("\\n=== Eligibility Check ===")
age = 17
has_parent_consent = True

if age >= 18 or has_parent_consent:
    print("✅ Eligible to register")
else:
    print("❌ Not eligible")

# Practical: Input validation
print("\\n=== Input Validation ===")
email = "user@example.com"
password = "pass123"

is_valid = (
    "@" in email
    and len(password) >= 6
    and not password.isdigit()  # not all digits
)
print(f"Email: {email}")
print(f"Valid input: {is_valid}")

# Chaining conditions
print("\\n=== Loan Approval ===")
credit_score = 720
income = 60000
has_debt = False

approved = credit_score >= 700 and income >= 40000 and not has_debt
print(f"Credit: {credit_score}, Income: ₹{income}, Debt: {has_debt}")
print(f"Loan approved: {approved}")`,

  questions: [
    "What is the difference between 'and' and 'or'? Write an example of each.",
    "What is short-circuit evaluation? How does Python evaluate: False and (1/0)?",
    "Write a program that checks if a person can vote (age >= 18 AND is_citizen == True).",
    "How do you combine 3 or more conditions in a single if statement? Show an example."
  ]
},

6: {
  content: `### Day 6: Lists — Indexing, Slicing, and Core Methods

**What is a List?**
A list is an ordered, mutable collection. It's the most-used data structure in Python.

**Creating Lists:**
\`\`\`python
numbers = [1, 2, 3, 4, 5]
mixed = ["hello", 42, 3.14, True]
empty = []
\`\`\`

**Indexing (zero-based):**
- \`nums[0]\` → first element
- \`nums[-1]\` → last element
- \`nums[-2]\` → second from last

**Slicing \`[start:stop:step]\`:**
- \`nums[1:4]\` → elements at index 1, 2, 3
- \`nums[:3]\` → first 3 elements
- \`nums[2:]\` → from index 2 to end
- \`nums[::-1]\` → reversed list

**Essential Methods:**
| Method | What it does |
|--------|-------------|
| \`.append(x)\` | Add x to end |
| \`.insert(i, x)\` | Insert x at index i |
| \`.remove(x)\` | Remove first x |
| \`.pop(i)\` | Remove and return item at i |
| \`.sort()\` | Sort in place |
| \`.reverse()\` | Reverse in place |
| \`len(list)\` | Number of items |
| \`x in list\` | Check membership |`,

  code: `# Day 6: Lists — Indexing, Slicing, and Methods

# Creating a list
fruits = ["apple", "banana", "cherry", "date", "elderberry"]

# Indexing
print("=== Indexing ===")
print(f"First:  {fruits[0]}")      # apple
print(f"Last:   {fruits[-1]}")     # elderberry
print(f"Third:  {fruits[2]}")      # cherry

# Slicing
print("\\n=== Slicing ===")
print(f"First 3:   {fruits[:3]}")     # [apple, banana, cherry]
print(f"Last 2:    {fruits[-2:]}")    # [date, elderberry]
print(f"Middle:    {fruits[1:4]}")    # [banana, cherry, date]
print(f"Reversed:  {fruits[::-1]}")   # reversed list

# Core Methods
print("\\n=== Methods ===")
fruits.append("fig")
print(f"After append('fig'):  {fruits}")

fruits.insert(1, "avocado")
print(f"After insert(1, 'avocado'): {fruits}")

fruits.remove("banana")
print(f"After remove('banana'):     {fruits}")

popped = fruits.pop()    # removes last
print(f"Popped: {popped}, List: {fruits}")

# Sorting
numbers = [45, 12, 78, 3, 56, 23]
numbers.sort()
print(f"\\nSorted: {numbers}")
numbers.sort(reverse=True)
print(f"Descending: {numbers}")

# Useful operations
print(f"\\nLength: {len(numbers)}")
print(f"Min: {min(numbers)}, Max: {max(numbers)}, Sum: {sum(numbers)}")
print(f"Is 78 in list? {'78' in str(numbers)}")

# Nested lists (2D data)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
print(f"\\nMatrix[1][2] = {matrix[1][2]}")  # 6`,

  questions: [
    "What is the difference between append() and insert()? When would you use each?",
    "How do you get the last 3 elements of a list using slicing?",
    "What does list[::-1] do? Is it the same as list.reverse()?",
    "Write code to find the second-largest number in a list without using sort()."
  ]
},

7: {
  content: `### Day 7: Dictionaries — Key-Value Pairs and Nested Data

**What is a Dictionary?**
A dictionary stores data as key-value pairs. Keys must be unique and immutable. Dictionaries provide O(1) lookup time.

**Creating Dictionaries:**
\`\`\`python
student = {"name": "Ruban", "age": 25, "city": "Chennai"}
empty = {}
from_constructor = dict(name="Ruban", age=25)
\`\`\`

**Accessing Values:**
- \`student["name"]\` → raises KeyError if key missing
- \`student.get("name", "default")\` → returns default if missing (safer)

**Methods:**
| Method | What it does |
|--------|-------------|
| \`.keys()\` | All keys |
| \`.values()\` | All values |
| \`.items()\` | All (key, value) pairs |
| \`.get(key, default)\` | Safe access |
| \`.update(dict2)\` | Merge dict2 into dict |
| \`.pop(key)\` | Remove and return value |

**Nested Dictionaries:**
Used heavily in JSON APIs, config files, and real-world data structures.`,

  code: `# Day 7: Dictionaries — Key-Value Pairs

# Creating a dictionary
student = {
    "name": "Ruban",
    "age": 25,
    "skills": ["Python", "SQL", "ML"],
    "is_active": True
}

# Accessing values
print("=== Access ===")
print(f"Name: {student['name']}")
print(f"Skills: {student['skills']}")
print(f"Safe get: {student.get('email', 'Not found')}")

# Adding and updating
student["email"] = "ruban@example.com"
student["age"] = 26
print(f"\\nUpdated: {student}")

# Dictionary methods
print(f"\\nKeys:   {list(student.keys())}")
print(f"Values: {list(student.values())}")

# Iterating
print("\\n=== Iterating ===")
for key, value in student.items():
    print(f"  {key}: {value}")

# Nested dictionary (like JSON data)
employees = {
    "E001": {"name": "Alice", "role": "ML Engineer", "salary": 120000},
    "E002": {"name": "Bob", "role": "Data Analyst", "salary": 80000},
    "E003": {"name": "Carol", "role": "Backend Dev", "salary": 95000}
}

print("\\n=== Employee Report ===")
for emp_id, info in employees.items():
    print(f"{emp_id}: {info['name']} — {info['role']} (₹{info['salary']:,})")

# Count character frequency (common interview question)
text = "hello world"
freq = {}
for char in text:
    if char != " ":
        freq[char] = freq.get(char, 0) + 1
print(f"\\nChar frequency of '{text}': {freq}")`,

  questions: [
    "What is the difference between dict['key'] and dict.get('key')? When should you use each?",
    "Can a list be used as a dictionary key? Why or why not?",
    "Write a function that counts the frequency of each word in a sentence using a dictionary.",
    "How do you merge two dictionaries in Python? Show 2 different methods."
  ]
},

8: {
  content: `### Day 8: Tuples, Sets, and When to Use Each

**Tuples — Immutable Sequences:**
- Created with \`()\` or just commas
- Cannot be modified after creation
- Useful for fixed data: coordinates, RGB colors, database rows
- Faster than lists for read-only data

**Sets — Unordered Unique Collections:**
- Created with \`{}\` or \`set()\`
- No duplicates allowed
- No indexing (unordered)
- Super fast membership testing: O(1) for \`in\`
- Set operations: union, intersection, difference

**When to Use What:**
| Type | Use When |
|------|----------|
| **List** | Ordered, allow duplicates, need to modify |
| **Tuple** | Fixed data, dict keys, function returns |
| **Set** | Remove duplicates, fast membership check, math operations |
| **Dict** | Key-value mapping, lookups by label |`,

  code: `# Day 8: Tuples, Sets, and When to Use Each

# === TUPLES ===
print("=== Tuples (Immutable) ===")
point = (3, 7)
rgb = (255, 128, 0)
person = ("Ruban", 25, "Chennai")

# Unpacking
name, age, city = person
print(f"Name: {name}, Age: {age}, City: {city}")

# Tuple as dictionary key (lists can't do this!)
locations = {(28.6, 77.2): "Delhi", (13.0, 80.2): "Chennai"}
print(f"Coordinate lookup: {locations[(13.0, 80.2)]}")

# Function returning multiple values
def get_stats(numbers):
    return min(numbers), max(numbers), sum(numbers) / len(numbers)

low, high, avg = get_stats([10, 20, 30, 40, 50])
print(f"Min: {low}, Max: {high}, Avg: {avg}")

# === SETS ===
print("\\n=== Sets (Unique, Unordered) ===")
colors = {"red", "blue", "green", "red", "blue"}
print(f"Set removes duplicates: {colors}")

# Remove duplicates from a list
nums = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
unique = list(set(nums))
print(f"Unique numbers: {unique}")

# Set operations
python_devs = {"Alice", "Bob", "Carol", "Dave"}
ml_devs = {"Carol", "Dave", "Eve", "Frank"}

print(f"\\nBoth: {python_devs & ml_devs}")        # intersection
print(f"Either: {python_devs | ml_devs}")          # union
print(f"Only Python: {python_devs - ml_devs}")     # difference

# Fast membership check
valid_emails = {"alice@co.com", "bob@co.com", "carol@co.com"}
check = "bob@co.com"
print(f"\\n'{check}' is valid: {check in valid_emails}")  # O(1)`,

  questions: [
    "What is the main difference between a tuple and a list?",
    "Why would you use a set instead of a list to store unique values?",
    "How do you find common elements between two lists? (Hint: use sets)",
    "Can you modify a tuple after creation? What happens if you try?"
  ]
},

9: {
  content: `### Day 9: If-Else, Elif — Conditional Logic Flow

**Conditional Statements:**
The \`if-elif-else\` structure lets your program make decisions based on conditions.

**Syntax:**
\`\`\`python
if condition1:
    # runs if condition1 is True
elif condition2:
    # runs if condition1 is False and condition2 is True
else:
    # runs if all conditions are False
\`\`\`

**Key Rules:**
- Indentation is mandatory (4 spaces)
- Conditions must evaluate to True/False
- \`elif\` is short for "else if"
- You can have multiple \`elif\` blocks but only one \`else\`
- \`else\` is optional

**Truthy and Falsy Values:**
- **Falsy:** \`False\`, \`0\`, \`""\`, \`[]\`, \`None\`, \`{}\`
- **Truthy:** Everything else

**Ternary Operator (one-line if):**
\`\`\`python
status = "adult" if age >= 18 else "minor"
\`\`\``,

  code: `# Day 9: If-Else, Elif — Conditional Logic

# Basic if-else
age = 20
if age >= 18:
    print("You are an adult ✅")
else:
    print("You are a minor")

# Multiple conditions with elif
print("\\n=== Grade Calculator ===")
score = 78

if score >= 90:
    grade = "A+"
elif score >= 80:
    grade = "A"
elif score >= 70:
    grade = "B"
elif score >= 60:
    grade = "C"
elif score >= 50:
    grade = "D"
else:
    grade = "F"

print(f"Score: {score} → Grade: {grade}")

# Nested conditions
print("\\n=== Ticket Pricing ===")
age = 25
is_student = True

if age < 12:
    price = 100
elif age < 18:
    price = 200
elif age >= 60:
    price = 150  # Senior discount
else:
    price = 300
    if is_student:
        price = 200  # Student discount
        
print(f"Ticket price: ₹{price}")

# Ternary operator (one-line if)
temperature = 35
weather = "Hot 🔥" if temperature > 30 else "Cool 🌤️"
print(f"\\nTemperature: {temperature}°C → {weather}")

# Truthy and Falsy
print("\\n=== Truthy/Falsy ===")
values = [0, 1, "", "hello", [], [1, 2], None, True]
for v in values:
    print(f"  {str(v):>10} → {'Truthy' if v else 'Falsy'}")`,

  questions: [
    "What is the difference between if-elif-else and multiple separate if statements?",
    "What are truthy and falsy values in Python? List 4 falsy values.",
    "Write a program that takes a number and prints whether it's positive, negative, or zero.",
    "What is the ternary operator? Rewrite this using a ternary: if x > 0: result = 'pos' else: result = 'neg'"
  ]
},

10: {
  content: `### Day 10: For Loops — Iterating over Lists and Ranges

**What is a For Loop?**
A for loop repeats a block of code for each item in a sequence (list, string, range, etc.).

**Syntax:**
\`\`\`python
for item in sequence:
    # do something with item
\`\`\`

**range() Function:**
- \`range(5)\` → 0, 1, 2, 3, 4
- \`range(2, 8)\` → 2, 3, 4, 5, 6, 7
- \`range(0, 10, 2)\` → 0, 2, 4, 6, 8

**enumerate() — Get Index + Value:**
\`\`\`python
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")
\`\`\`

**zip() — Loop Over Multiple Lists:**
\`\`\`python
for name, score in zip(names, scores):
    print(f"{name}: {score}")
\`\`\`

**Nested Loops:**
A loop inside a loop. Used for 2D data (matrices, grids, tables).`,

  code: `# Day 10: For Loops — Iterating over Lists and Ranges

# Basic for loop over a list
fruits = ["apple", "banana", "cherry", "date"]
print("=== Loop over list ===")
for fruit in fruits:
    print(f"  I like {fruit}")

# range() function
print("\\n=== range() examples ===")
for i in range(5):
    print(f"  Count: {i}")

# range with start, stop, step
print("\\nEven numbers 0-10:")
for n in range(0, 11, 2):
    print(f"  {n}", end=" ")
print()

# enumerate — get index AND value
print("\\n=== enumerate ===")
languages = ["Python", "SQL", "JavaScript", "R"]
for index, lang in enumerate(languages, start=1):
    print(f"  {index}. {lang}")

# zip — loop over multiple lists together
print("\\n=== zip ===")
students = ["Alice", "Bob", "Carol"]
scores = [92, 78, 88]
for name, score in zip(students, scores):
    print(f"  {name}: {score}")

# Sum of a list (manual)
numbers = [10, 20, 30, 40, 50]
total = 0
for num in numbers:
    total += num
print(f"\\nSum: {total}")

# Nested loop — multiplication table
print("\\n=== 5x5 Multiplication Table ===")
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i*j:4}", end="")
    print()

# Loop over string
word = "PYTHON"
for i, char in enumerate(word):
    print(f"  Index {i}: {char}")`,

  questions: [
    "What is the difference between range(5) and range(1, 6)?",
    "How does enumerate() work? Why is it better than using a counter variable?",
    "How do you loop over two lists at the same time? Show an example with zip().",
    "Write a for loop that prints the multiplication table for the number 7."
  ]
},
};
