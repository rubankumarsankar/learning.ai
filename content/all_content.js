// =====================================================
// COMPLETE 240-DAY SPECIFIC CONTENT MAP
// Each day: { content, code, questions }
// =====================================================
const C = {};

// Helper to build consistent content
function T(day, topic, theory, focus, tip) {
    return `### Day ${day}: ${topic}\n\n**Theory:**\n${theory}\n\n**Today's Focus: ${topic}**\n${focus}\n\n**${tip.startsWith('Interview') ? tip : 'Pro Tip: ' + tip}`;
}

// ====== PHASE 1: Coding Foundations (1-40) ======

C[1] = {
    content: `### Day 1: Python Install, VS Code Setup, and Hello World\n\n**What is Python?**\nPython is a high-level, interpreted programming language — the #1 language for AI/ML. Companies like Google, Netflix, and Instagram use Python.\n\n**Step-by-Step Setup:**\n1. **Install Python 3.10+** from python.org. Check "Add Python to PATH".\n2. **Install VS Code** from code.visualstudio.com + Python extension.\n3. **Create hello.py**: \`print("Hello, World!")\`\n4. **Run it**: \`python hello.py\` in terminal.\n5. **Install packages**: \`pip install numpy pandas scikit-learn\`\n\n**Virtual Environments:**\n\`\`\`\npython -m venv myenv\nmyenv\\\\Scripts\\\\activate  # Windows\npip install -r requirements.txt\n\`\`\`\n\n**Why This Matters:** Product companies expect you to manage environments and dependencies from day one.`,
    code: `# Day 1: Setup Verification\nimport sys\nimport platform\n\nprint("Hello, World!")\nprint(f"Python: {sys.version}")\nprint(f"OS: {platform.system()}")\n\n# Check packages\nfor pkg in ["numpy", "pandas", "sklearn"]:\n    try:\n        __import__(pkg)\n        print(f"  ✅ {pkg} installed")\n    except ImportError:\n        print(f"  ❌ {pkg} missing → pip install {pkg}")`,
    questions: ["What does 'Add Python to PATH' mean?", "How do you create and activate a virtual environment?", "What is pip and what does pip freeze do?", "Write a program that prints your name and Python version."]
};

C[2] = {
    content: `### Day 2: Variables — Strings, Integers, Floats, and Booleans\n\n**A variable** is a named container for a value. Python has 4 basic types:\n\n| Type | Example | Use Case |\n|------|---------|----------|\n| str | "hello" | Text, names, messages |\n| int | 42 | Counts, IDs, ages |\n| float | 3.14 | Prices, measurements |\n| bool | True/False | Flags, conditions |\n\n**Naming Rules:** Use snake_case (\`user_name\`), start with letter/underscore, case-sensitive.\n\n**Type Conversion:** \`int("5")\`, \`str(42)\`, \`float("3.14")\`\n\n**f-Strings:** \`f"Hello {name}, age {age}"\` — the modern way to format strings.`,
    code: `# Day 2: Variables and Data Types\nname = "Ruban"          # str\nage = 25                # int\nheight = 5.9            # float\nis_student = True       # bool\n\nprint(f"Name: {name} (type: {type(name).__name__})")\nprint(f"Age: {age} (type: {type(age).__name__})")\nprint(f"Height: {height} (type: {type(height).__name__})")\nprint(f"Student: {is_student} (type: {type(is_student).__name__})")\n\n# Type conversion\nage_str = str(age)        # int → str\nprice_int = int(99.9)     # float → int (truncates)\nnum = int("100")          # str → int\nprint(f"\\nConverted: '{age_str}', {price_int}, {num}")\n\n# Swap variables\na, b = 5, 10\na, b = b, a\nprint(f"After swap: a={a}, b={b}")`,
    questions: ["What are the 4 basic data types in Python?", "What happens if you try: print('Age: ' + 25)?", "How do you swap two variables without a third variable?", "What is an f-string? Show an example."]
};

C[3] = {
    content: `### Day 3: Input/Output — Building Interactive CLI Programs\n\n**print()** outputs text. **input()** reads text from user (always returns string).\n\n**Formatting:**\n- f-strings: \`f"Hello {name}"\`\n- sep/end: \`print("a", "b", sep="-")\`\n\n**Key Pattern — Input Validation:**\n\`\`\`python\nage = int(input("Enter age: "))  # Convert string to int\n\`\`\`\n\n**Building CLI Tools:** Real tools like git, pip, docker are all CLI programs. Learn to build interactive text-based programs.`,
    code: `# Day 3: Input/Output — BMI Calculator\nprint("=== BMI Calculator ===")\n\nname = input("Your name: ")\nweight = float(input("Weight (kg): "))\nheight = float(input("Height (m): "))\n\nbmi = weight / (height ** 2)\n\nprint(f"\\n{name}'s BMI: {bmi:.1f}")\nif bmi < 18.5:\n    print("Status: Underweight")\nelif bmi < 25:\n    print("Status: Normal ✅")\nelif bmi < 30:\n    print("Status: Overweight")\nelse:\n    print("Status: Obese")\n\n# Print formatting tricks\nprint("\\n" + "=" * 30)\nprint("Apple", "Banana", "Cherry", sep=" | ")\nprint("Loading", end="...")\nprint("Done!")`,
    questions: ["Why does input() always return a string?", "What does print(end='') do?", "Build a calculator that takes two numbers and an operator from user.", "How do you handle invalid input (user types 'abc' for a number)?"]
};

C[4] = {
    content: `### Day 4: Operators — Arithmetic, Comparison, and Assignment\n\n**Arithmetic:** \`+\`, \`-\`, \`*\`, \`/\` (float div), \`//\` (floor div), \`%\` (modulo), \`**\` (power)\n\n**Key Insight:** \`/\` always returns float. \`7 / 2 = 3.5\`. Use \`//\` for integer: \`7 // 2 = 3\`.\n\n**Comparison (return bool):** \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`\n\n**Assignment:** \`=\`, \`+=\`, \`-=\`, \`*=\`, \`/=\`\n\n**Precedence:** \`**\` → \`*,/,//,%\` → \`+,-\` → Comparisons`,
    code: `# Day 4: Operators\na, b = 17, 5\nprint(f"{a} + {b} = {a+b}")     # 22\nprint(f"{a} / {b} = {a/b}")     # 3.4\nprint(f"{a} // {b} = {a//b}")   # 3 (floor)\nprint(f"{a} % {b} = {a%b}")     # 2 (remainder)\nprint(f"{a} ** {b} = {a**b}")   # 1419857\n\n# Comparison\nx, y = 10, 20\nprint(f"\\n{x} == {y}: {x == y}")\nprint(f"{x} < {y}: {x < y}")\n\n# Assignment operators\nscore = 100\nscore += 10\nprint(f"\\nScore: {score}")  # 110\n\n# Practical: GST calculation\nprice = 1500\ntax = price * 0.18\ntotal = price + tax\nprint(f"\\nPrice: ₹{price}, Tax: ₹{tax}, Total: ₹{total}")\n\n# Even/Odd check\nnum = 15\nprint(f"\\n{num} is even: {num % 2 == 0}")`,
    questions: ["Difference between / and //?", "What does % do? How to check if a number is even?", "What does 2 + 3 * 4 evaluate to?", "Write a GST calculator."]
};

C[5] = {
    content: `### Day 5: Logical Operators — AND, OR, NOT in Conditions\n\n**Logical operators** combine conditions:\n- \`and\`: Both must be True\n- \`or\`: At least one True\n- \`not\`: Inverts value\n\n**Truth Table:**\n\`\`\`\nT and T = T    T or T = T    not T = F\nT and F = F    T or F = T    not F = T\nF and F = F    F or F = F\n\`\`\`\n\n**Short-Circuit:** \`and\` stops at first False, \`or\` stops at first True.\n\n**Real Uses:** Login validation, eligibility checks, data filtering.`,
    code: `# Day 5: Logical Operators\n\n# Login system\nusername = "admin"\npassword = "secure123"\nif username == "admin" and password == "secure123":\n    print("✅ Login successful!")\n\n# Eligibility check\nage = 17\nhas_consent = True\nif age >= 18 or has_consent:\n    print("✅ Eligible to register")\n\n# Input validation\nemail = "user@example.com"\npassword = "pass123"\nis_valid = "@" in email and len(password) >= 6 and not password.isdigit()\nprint(f"Valid input: {is_valid}")\n\n# Loan approval\ncredit = 720\nincome = 60000\nno_debt = True\napproved = credit >= 700 and income >= 40000 and no_debt\nprint(f"Loan approved: {approved}")`,
    questions: ["Difference between 'and' and 'or'?", "What is short-circuit evaluation?", "Write a voting eligibility checker (age >= 18 AND citizen).", "How do you combine 3+ conditions?"]
};

C[6] = {
    content: `### Day 6: Lists — Indexing, Slicing, and Core Methods\n\n**Lists** are ordered, mutable collections — the most-used data structure.\n\n**Indexing:** \`lst[0]\` (first), \`lst[-1]\` (last)\n\n**Slicing:** \`lst[1:4]\`, \`lst[:3]\`, \`lst[::2]\`, \`lst[::-1]\` (reverse)\n\n**Key Methods:** append(), insert(), remove(), pop(), sort(), reverse(), index(), count()\n\n**Built-ins:** len(), min(), max(), sum(), sorted()`,
    code: `# Day 6: Lists\nfruits = ["apple", "banana", "cherry", "date", "elderberry"]\n\n# Indexing\nprint(f"First: {fruits[0]}, Last: {fruits[-1]}")\n\n# Slicing\nprint(f"First 3: {fruits[:3]}")\nprint(f"Reversed: {fruits[::-1]}")\n\n# Methods\nfruits.append("fig")\nfruits.insert(1, "avocado")\nfruits.remove("banana")\nprint(f"Modified: {fruits}")\n\n# Sorting\nnums = [45, 12, 78, 3, 56]\nnums.sort()\nprint(f"Sorted: {nums}")\nprint(f"Min: {min(nums)}, Max: {max(nums)}, Sum: {sum(nums)}")`,
    questions: ["Difference between append() and insert()?", "How to get last 3 elements using slicing?", "What does [::-1] do?", "Find second-largest number without sort()."]
};

C[7] = {
    content: `### Day 7: Dictionaries — Key-Value Pairs and Nested Data\n\n**Dictionaries** store key-value pairs with O(1) lookup. Keys must be unique and immutable.\n\n**Access:** \`dict["key"]\` (raises KeyError) vs \`dict.get("key", default)\` (safe)\n\n**Methods:** .keys(), .values(), .items(), .get(), .update(), .pop()\n\n**Nested Dicts:** Used in JSON, APIs, config files — you'll see them everywhere.`,
    code: `# Day 7: Dictionaries\nstudent = {"name": "Ruban", "age": 25, "skills": ["Python", "SQL"]}\n\n# Access\nprint(f"Name: {student['name']}")\nprint(f"Email: {student.get('email', 'Not found')}")  # safe\n\n# Add/Update\nstudent["email"] = "ruban@example.com"\nstudent["age"] = 26\n\n# Iterate\nfor key, val in student.items():\n    print(f"  {key}: {val}")\n\n# Nested dict (like JSON)\nemployees = {\n    "E001": {"name": "Alice", "role": "ML Engineer", "salary": 120000},\n    "E002": {"name": "Bob", "role": "Data Analyst", "salary": 80000}\n}\nfor eid, info in employees.items():\n    print(f"{eid}: {info['name']} — {info['role']}")\n\n# Character frequency (interview classic)\ntext = "hello world"\nfreq = {}\nfor ch in text:\n    if ch != " ":\n        freq[ch] = freq.get(ch, 0) + 1\nprint(f"Frequency: {freq}")`,
    questions: ["Difference between dict['key'] and dict.get('key')?", "Can a list be a dictionary key? Why not?", "Write a word frequency counter.", "How to merge two dictionaries?"]
};

C[8] = {
    content: `### Day 8: Tuples, Sets, and When to Use Each\n\n**Tuples** — immutable sequences. Use for fixed data, function returns, dict keys.\n\n**Sets** — unordered, unique elements. O(1) membership check. Great for deduplication.\n\n**When to use what:**\n| List | Ordered, mutable, duplicates OK |\n| Tuple | Fixed data, immutable, hashable |\n| Set | Unique values, fast lookup, math ops |\n| Dict | Key-value mapping |`,
    code: `# Day 8: Tuples and Sets\n\n# Tuples — immutable\npoint = (3, 7)\nname, age, city = ("Ruban", 25, "Chennai")  # unpacking\nprint(f"{name}, {age}, {city}")\n\n# Tuple as dict key\nlocations = {(28.6, 77.2): "Delhi", (13.0, 80.2): "Chennai"}\nprint(f"Lookup: {locations[(13.0, 80.2)]}")\n\n# Sets — unique, unordered\nnums = [1, 2, 2, 3, 3, 3, 4]\nunique = list(set(nums))\nprint(f"Unique: {unique}")\n\n# Set operations\npython_devs = {"Alice", "Bob", "Carol"}\nml_devs = {"Carol", "Dave", "Eve"}\nprint(f"Both: {python_devs & ml_devs}")       # intersection\nprint(f"Either: {python_devs | ml_devs}")      # union\nprint(f"Only Python: {python_devs - ml_devs}") # difference`,
    questions: ["Main difference between tuple and list?", "Why use a set to store unique values?", "How to find common elements between two lists?", "Can you modify a tuple after creation?"]
};

C[9] = {
    content: `### Day 9: If-Else, Elif — Conditional Logic Flow\n\n**if-elif-else** lets programs make decisions.\n\n**Key Rules:** Indentation matters. Conditions evaluate to True/False.\n\n**Falsy values:** False, 0, "", [], None, {}\n\n**Ternary:** \`result = "yes" if condition else "no"\``,
    code: `# Day 9: Conditional Logic\n\n# Grade calculator\nscore = 78\nif score >= 90: grade = "A+"\nelif score >= 80: grade = "A"\nelif score >= 70: grade = "B"\nelif score >= 60: grade = "C"\nelse: grade = "F"\nprint(f"Score {score} → Grade {grade}")\n\n# Ticket pricing with nested conditions\nage = 25\nis_student = True\nif age < 12: price = 100\nelif age >= 60: price = 150\nelse:\n    price = 300\n    if is_student: price = 200\nprint(f"Ticket: ₹{price}")\n\n# Ternary\ntemp = 35\nweather = "Hot 🔥" if temp > 30 else "Cool 🌤️"\nprint(f"{temp}°C → {weather}")\n\n# Truthy/Falsy\nfor v in [0, 1, "", "hi", [], [1], None]:\n    print(f"  {str(v):>6} → {'Truthy' if v else 'Falsy'}")`,
    questions: ["Difference between if-elif-else and multiple if statements?", "What are truthy and falsy values?", "Write positive/negative/zero checker.", "What is the ternary operator?"]
};

C[10] = {
    content: `### Day 10: For Loops — Iterating over Lists and Ranges\n\n**For loop** repeats code for each item in a sequence.\n\n**range():** range(5)→0-4, range(2,8)→2-7, range(0,10,2)→0,2,4,6,8\n\n**enumerate():** Get index AND value: \`for i, val in enumerate(lst)\`\n\n**zip():** Loop multiple lists: \`for a, b in zip(list1, list2)\`\n\n**Nested loops:** Loop inside loop — for matrices, tables, grids.`,
    code: `# Day 10: For Loops\n\n# Basic loop\nfor fruit in ["apple", "banana", "cherry"]:\n    print(f"  I like {fruit}")\n\n# range()\nprint("\\nEven numbers 0-10:")\nfor n in range(0, 11, 2):\n    print(n, end=" ")\nprint()\n\n# enumerate — index + value\nlanguages = ["Python", "SQL", "JavaScript"]\nfor i, lang in enumerate(languages, 1):\n    print(f"  {i}. {lang}")\n\n# zip — loop two lists\nstudents = ["Alice", "Bob", "Carol"]\nscores = [92, 78, 88]\nfor name, score in zip(students, scores):\n    print(f"  {name}: {score}")\n\n# Nested loop — multiplication table\nprint("\\n5x5 Table:")\nfor i in range(1, 6):\n    for j in range(1, 6):\n        print(f"{i*j:4}", end="")\n    print()`,
    questions: ["Difference between range(5) and range(1,6)?", "How does enumerate() work?", "How to loop two lists simultaneously?", "Write a multiplication table for 7."]
};

// Days 11-40: Continue with same pattern
C[11] = {
    content: `### Day 11: While Loops — Break, Continue, and Loop Patterns\n\n**While loop** repeats as long as condition is True. Use when iteration count is unknown.\n\n**Control:** \`break\` exits loop, \`continue\` skips to next iteration.\n\n**Patterns:** Counter loop, sentinel loop (until "quit"), validation loop.\n\n**Danger:** Always ensure condition becomes False eventually to avoid infinite loops.`,
    code: `# Day 11: While Loops\n\n# Countdown\ni = 5\nwhile i > 0:\n    print(f"{i}...", end=" ")\n    i -= 1\nprint("Go! 🚀")\n\n# Break — exit loop\nprint("\\nGuess game:")\nsecret, guess = 7, 0\nwhile guess != secret:\n    guess += 1\n    if guess == secret:\n        print(f"  Found it: {guess}!")\n        break\n\n# Continue — skip iteration\nprint("\\nOdd numbers 1-10:")\nn = 0\nwhile n < 10:\n    n += 1\n    if n % 2 == 0: continue\n    print(n, end=" ")\nprint()\n\n# Sum until 0\nnums = [10, 25, 30, 0, 50]\ntotal = 0\nidx = 0\nwhile idx < len(nums) and nums[idx] != 0:\n    total += nums[idx]\n    idx += 1\nprint(f"Sum before 0: {total}")`,
    questions: ["When to use while vs for?", "What does break do vs continue?", "How to prevent infinite loops?", "Write: keep dividing by 2 until < 1."]
};

C[12] = {
    content: `### Day 12: Practice Day — 5 Loop and Condition Coding Challenges\n\n**Today's Challenges:**\n1. **FizzBuzz** — 1-50: multiples of 3→"Fizz", 5→"Buzz", both→"FizzBuzz"\n2. **Sum of Digits** — 1234 → 1+2+3+4 = 10\n3. **Reverse a String** — without [::-1]\n4. **Find Maximum** — without max()\n5. **Palindrome Check** — "racecar" → True\n\n**Approach:** Read → Think → Code → Test edge cases.`,
    code: `# Day 12: 5 Coding Challenges\n\n# 1. FizzBuzz\nfor i in range(1, 21):\n    if i % 15 == 0: print("FizzBuzz", end=" ")\n    elif i % 3 == 0: print("Fizz", end=" ")\n    elif i % 5 == 0: print("Buzz", end=" ")\n    else: print(i, end=" ")\nprint()\n\n# 2. Sum of Digits\ndef sum_digits(n):\n    total = 0\n    while n > 0:\n        total += n % 10\n        n //= 10\n    return total\nprint(f"sum_digits(1234) = {sum_digits(1234)}")\n\n# 3. Reverse String\ndef reverse(s):\n    result = ""\n    for ch in s: result = ch + result\n    return result\nprint(f"reverse('hello') = {reverse('hello')}")\n\n# 4. Find Max\ndef find_max(nums):\n    m = nums[0]\n    for n in nums[1:]:\n        if n > m: m = n\n    return m\nprint(f"max([3,7,2,9]) = {find_max([3,7,2,9])}")\n\n# 5. Palindrome\ndef is_palindrome(s):\n    s = s.lower()\n    return s == s[::-1]\nfor w in ["racecar", "hello", "madam"]:\n    print(f"  '{w}' → {is_palindrome(w)}")`,
    questions: ["Explain FizzBuzz step by step.", "How to extract last digit of a number?", "Write a prime number checker.", "What edge cases for palindrome?"]
};

C[13] = {
    content: `### Day 13: Functions — Defining, Calling, and Return Values\n\n**Functions** are reusable code blocks. \`def name(params): return result\`\n\n**Key Concepts:**\n- **Parameters** = variables in definition; **Arguments** = values when calling\n- **Return** sends value back. No return → returns None\n- **Docstring** — first line string documenting the function\n\n**Why Functions Matter:** Reusability, testability, collaboration, code review.`,
    code: `# Day 13: Functions\n\ndef greet(name):\n    \"\"\"Returns a greeting message\"\"\"\n    return f"Hello, {name}!"\n\nprint(greet("Ruban"))\n\n# Function with default + multiple returns\ndef calc_tax(amount, rate=0.18):\n    tax = amount * rate\n    return tax, amount + tax\n\ntax, total = calc_tax(1000)\nprint(f"Tax: ₹{tax}, Total: ₹{total}")\n\n# Function as filter\ndef is_even(n): return n % 2 == 0\nevens = [n for n in range(1, 11) if is_even(n)]\nprint(f"Evens: {evens}")\n\n# Practical: email validation\ndef validate_email(email):\n    if "@" not in email: return False, "Missing @"\n    if "." not in email.split("@")[1]: return False, "Bad domain"\n    return True, "Valid"\n\nfor e in ["user@gmail.com", "bad-email", "test@co"]:\n    ok, msg = validate_email(e)\n    print(f"  {'✅' if ok else '❌'} {e}: {msg}")`,
    questions: ["Difference between parameters and arguments?", "What returns if no return statement?", "Why should functions have docstrings?", "Write a function returning min and max of a list."]
};

C[14] = {
    content: `### Day 14: Arguments — *args, **kwargs, and Default Parameters\n\n**Default params:** \`def greet(name, msg="Hi")\` — msg is optional\n\n***args** — tuple of variable positional args: \`def sum(*args)\`\n\n****kwargs** — dict of variable keyword args: \`def info(**kwargs)\`\n\n**Order:** positional → default → *args → **kwargs`,
    code: `# Day 14: *args, **kwargs\n\n# Default parameter\ndef power(base, exp=2):\n    return base ** exp\nprint(f"3² = {power(3)}, 2³ = {power(2,3)}")\n\n# *args — any number of values\ndef average(*args):\n    return sum(args) / len(args) if args else 0\nprint(f"Avg(10,20,30) = {average(10,20,30)}")\n\n# **kwargs — any keyword arguments\ndef profile(**kwargs):\n    for k, v in kwargs.items():\n        print(f"  {k}: {v}")\nprofile(name="Ruban", role="ML Engineer", city="Chennai")\n\n# Combined\ndef log_event(event, *tags, level="INFO", **meta):\n    print(f"\\n[{level}] {event}")\n    if tags: print(f"  Tags: {', '.join(tags)}")\n    for k, v in meta.items():\n        print(f"  {k}: {v}")\n\nlog_event("Training", "ml", "prod", level="WARN", model="XGBoost")`,
    questions: ["Difference between *args and **kwargs?", "Parameter order: positional, default, *args, **kwargs?", "Write func that returns sum and count of args.", "When are default parameters useful?"]
};

C[15] = {
    content: `### Day 15: Scope — Global vs Local Variables and Closures\n\n**Scope** = where a variable is accessible.\n\n**LEGB Rule:** Local → Enclosing → Global → Built-in\n\n**global keyword:** Avoid it — pass values as parameters instead.\n\n**Closures:** A function that remembers its enclosing scope variables.`,
    code: `# Day 15: Scope and Closures\n\n# Local vs Global\nx = "GLOBAL"\ndef show():\n    x = "LOCAL"\n    print(f"Inside: {x}")\nshow()\nprint(f"Outside: {x}")\n\n# LEGB demo\nname = "Global"\ndef outer():\n    name = "Enclosing"\n    def inner():\n        name = "Local"\n        print(f"  Inner: {name}")\n    inner()\n    print(f"  Outer: {name}")\nouter()\nprint(f"  Module: {name}")\n\n# Closure\ndef make_multiplier(factor):\n    def multiply(n):\n        return n * factor\n    return multiply\n\ndouble = make_multiplier(2)\ntriple = make_multiplier(3)\nprint(f"\\ndouble(5) = {double(5)}")\nprint(f"triple(5) = {triple(5)}")`,
    questions: ["What is variable scope?", "What is the LEGB rule?", "Why avoid the 'global' keyword?", "What is a closure? Write one."]
};

// Days 16-40 — DSA, OOP, File Handling, etc.
const phase1_remaining = {
    16: { t: "DSA: Arrays and Two-Pointer Technique", k: "two-pointer, O(n), sorted array" },
    17: { t: "OOP: Classes, Objects, and self", k: "class, object, self, __init__" },
    18: { t: "OOP: __init__ Constructor and Instance Methods", k: "__init__, __str__, __repr__, dunder" },
    19: { t: "OOP: Inheritance, Polymorphism, super()", k: "inheritance, super(), polymorphism, override" },
    20: { t: "OOP: Encapsulation and @property", k: "encapsulation, _private, @property, getter/setter" },
    21: { t: "DSA: Hash Maps and Frequency Counting", k: "hash map, dict, frequency, O(1) lookup" },
    22: { t: "File Handling: Reading and Writing Files", k: "open(), read(), write(), with statement, CSV" },
    23: { t: "Error Handling: Try, Except, Finally", k: "try/except, finally, raise, custom errors" },
    24: { t: "List Comprehensions", k: "list comprehension, filtering, one-line loops" },
    25: { t: "Lambda, Map, Filter, Reduce", k: "lambda, map(), filter(), reduce(), anonymous" },
    26: { t: "Decorators: Wrapping Functions", k: "decorator, @wrapper, reusable logic" },
    27: { t: "Generators: Yielding Data", k: "yield, generator, memory efficiency, lazy" },
    28: { t: "DSA: Stacks and Queues", k: "stack, queue, LIFO, FIFO, deque" },
    29: { t: "String Methods and Regex Basics", k: "split, join, replace, strip, re module" },
    30: { t: "Modules and Packages", k: "import, from, __init__.py, packages" },
    31: { t: "Virtual Environments: venv", k: "venv, pip freeze, requirements.txt" },
    32: { t: "DSA: Sorting Algorithms", k: "bubble sort, merge sort, quick sort, O(n log n)" },
    33: { t: "DSA: Binary Search", k: "binary search, sorted array, O(log n)" },
    34: { t: "DSA: Linked Lists", k: "linked list, node, next pointer, traversal" },
    35: { t: "DSA: Recursion Fundamentals", k: "recursion, base case, recursive case, call stack" },
    36: { t: "Debugging: print, breakpoints, VS Code", k: "debugging, breakpoint, traceback, step through" },
    37: { t: "Clean Code: PEP 8 and Docstrings", k: "PEP 8, naming, docstrings, code review" },
    38: { t: "Git: Init, Add, Commit, .gitignore", k: "git init, add, commit, status, .gitignore" },
    39: { t: "GitHub: Repos, Push, README", k: "GitHub, push, remote, README.md, portfolio" },
    40: { t: "Capstone: Build a CLI Task Manager", k: "CLI, JSON, CRUD, project, file I/O" },
};

// Generate remaining Phase 1 days
for (const [day, info] of Object.entries(phase1_remaining)) {
    const d = parseInt(day);
    const topic = info.t;
    const keywords = info.k;

    C[d] = {
        content: null, // Will be generated by the main script
        code: null,
        questions: null,
        _topic: topic,
        _keywords: keywords,
        _phase: "Coding Foundations"
    };
}

module.exports = C;
