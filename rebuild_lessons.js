const fs = require('fs');
const path = require('path');
const { PHASES, TOPICS } = require('./roadmap_topics');
const HANDCRAFTED = require('./content/all_content');
const buildPhase2 = require('./content/phase2_sql_data');
const buildPhase3 = require('./content/phase3_ml');
const { buildPhase4, buildPhase5, buildPhase6, buildPhase7, buildPhase8 } = require('./content/phase4_8');

const LESSONS_DIR = path.join(__dirname, 'data', 'lessons');

function getPhase(day) {
    for (const p of PHASES) {
        if (day >= p.start && day <= p.end) return p.name;
    }
    return "Unknown";
}

// Smart content builder that uses the topic name to create relevant content
function buildSmartContent(day, topic, phase) {
    const t = topic.toLowerCase();

    // Extract the main subject from topic
    const subject = topic.split(':')[0].trim();
    const detail = topic.includes(':') ? topic.split(':').slice(1).join(':').trim() : topic;

    // Build theory based on actual topic keywords
    let theory = '';
    let code = '';
    let questions = [];

    // ---- PHASE 1: Coding Foundations ----
    if (phase === "Coding Foundations") {
        if (t.includes('two-pointer') || t.includes('arrays')) {
            theory = `**Two-Pointer Technique** uses two indices that move through an array to solve problems in O(n) time instead of O(n²).\n\n**When to Use:** Sorted arrays, finding pairs, removing duplicates, palindrome checks.\n\n**Pattern:** Start left=0, right=end. Compare values, move pointers based on comparison.`;
            code = `# DSA: Two-Pointer Technique\ndef two_sum_sorted(nums, target):\n    left, right = 0, len(nums) - 1\n    while left < right:\n        s = nums[left] + nums[right]\n        if s == target: return [left, right]\n        elif s < target: left += 1\n        else: right -= 1\n    return [-1, -1]\n\nprint(two_sum_sorted([1,3,5,7,9], 12))  # [1,4]\n\n# Remove duplicates from sorted array\ndef remove_dupes(nums):\n    if not nums: return 0\n    w = 1\n    for r in range(1, len(nums)):\n        if nums[r] != nums[r-1]:\n            nums[w] = nums[r]\n            w += 1\n    return w\n\narr = [1,1,2,2,3,4,4]\nprint(f"Unique count: {remove_dupes(arr)}")`;
            questions = ["Explain two-pointer technique.", "Time complexity vs brute force?", "Reverse array in-place with two pointers.", "Find pair with given difference in sorted array."];
        }
        else if (t.includes('hash map') || t.includes('frequency')) {
            theory = `**Hash Maps (Dictionaries)** provide O(1) average lookup. Perfect for counting, grouping, and caching.\n\n**Frequency Counting Pattern:** Loop through data, use dict to count occurrences.\n\n**Common Interview Problems:** Two Sum, Anagram check, First unique character.`;
            code = `# DSA: Hash Maps and Frequency Counting\n\n# Two Sum (classic interview problem)\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        complement = target - n\n        if complement in seen:\n            return [seen[complement], i]\n        seen[n] = i\n    return []\n\nprint(f"Two Sum: {two_sum([2,7,11,15], 9)}")  # [0,1]\n\n# Character frequency\ndef char_freq(s):\n    freq = {}\n    for c in s:\n        freq[c] = freq.get(c, 0) + 1\n    return freq\n\nprint(f"Freq: {char_freq('hello')}")\n\n# Anagram check\ndef is_anagram(s1, s2):\n    return char_freq(s1) == char_freq(s2)\n\nprint(f"Anagram: {is_anagram('listen', 'silent')}")`;
            questions = ["What is O(1) lookup?", "Solve Two Sum with hash map.", "Check if two strings are anagrams.", "Find first non-repeating character."];
        }
        else if (t.includes('file handling') || t.includes('reading and writing')) {
            theory = `**File I/O** is essential — reading CSV data, writing logs, saving results.\n\n**Always use \`with\` statement** — it automatically closes files.\n\n**Modes:** 'r' (read), 'w' (write/overwrite), 'a' (append), 'r+' (read+write)`;
            code = `# File Handling\nimport json, csv\n\n# Write text file\nwith open("log.txt", "w") as f:\n    f.write("Experiment 1: accuracy=0.87\\n")\n    f.write("Experiment 2: accuracy=0.91\\n")\n\n# Read text file\nwith open("log.txt", "r") as f:\n    for line in f:\n        print(line.strip())\n\n# Write JSON\ndata = {"name": "model_v1", "accuracy": 0.91}\nwith open("config.json", "w") as f:\n    json.dump(data, f, indent=2)\n\n# Read JSON\nwith open("config.json", "r") as f:\n    loaded = json.load(f)\n    print(f"Loaded: {loaded}")\n\n# Write CSV\nwith open("results.csv", "w", newline="") as f:\n    writer = csv.writer(f)\n    writer.writerow(["Model", "Accuracy"])\n    writer.writerow(["RF", 0.87])\n    writer.writerow(["XGB", 0.91])`;
            questions = ["Why use 'with' statement for files?", "Difference between 'w' and 'a' modes?", "How to read/write JSON files?", "Write a program that reads CSV and calculates average."];
        }
        else if (t.includes('error handling') || t.includes('try')) {
            theory = `**Try/Except** catches errors gracefully instead of crashing.\n\n**Structure:** try → except → else (no error) → finally (always runs)\n\n**Custom Exceptions:** Create your own error classes for specific cases.`;
            code = `# Error Handling\n\n# Basic try/except\ntry:\n    num = int("abc")\nexcept ValueError as e:\n    print(f"Error: {e}")\n\n# Multiple exceptions\ndef safe_divide(a, b):\n    try:\n        result = a / b\n    except ZeroDivisionError:\n        return "Cannot divide by zero"\n    except TypeError:\n        return "Invalid types"\n    else:\n        return round(result, 2)\n    finally:\n        print("  Division attempted")\n\nprint(safe_divide(10, 3))\nprint(safe_divide(10, 0))\n\n# Custom exception\nclass InvalidAgeError(Exception):\n    pass\n\ndef set_age(age):\n    if age < 0 or age > 150:\n        raise InvalidAgeError(f"Age {age} is invalid")\n    return age\n\ntry:\n    set_age(200)\nexcept InvalidAgeError as e:\n    print(f"Caught: {e}")`;
            questions = ["What is try/except?", "When does finally block run?", "How to create custom exceptions?", "Write safe input function with error handling."];
        }
        else if (t.includes('list comprehension')) {
            theory = `**List Comprehensions** create lists in one line. Cleaner and faster than loops.\n\n**Syntax:** \`[expression for item in iterable if condition]\`\n\n**Also:** Dict comprehensions \`{k:v for ...}\`, Set comprehensions \`{x for ...}\``;
            code = `# List Comprehensions\n\n# Basic\nsquares = [x**2 for x in range(1, 11)]\nprint(f"Squares: {squares}")\n\n# With filter\nevens = [x for x in range(20) if x % 2 == 0]\nprint(f"Evens: {evens}")\n\n# String processing\nnames = ["alice", "bob", "carol"]\nupper = [n.capitalize() for n in names]\nprint(f"Capitalized: {upper}")\n\n# Nested\nmatrix = [[i*j for j in range(1,4)] for i in range(1,4)]\nprint(f"Matrix: {matrix}")\n\n# Dict comprehension\nword = "hello"\nfreq = {c: word.count(c) for c in set(word)}\nprint(f"Freq: {freq}")\n\n# If-else in comprehension\nnums = [1, -2, 3, -4, 5]\nabs_nums = [n if n >= 0 else -n for n in nums]\nprint(f"Absolute: {abs_nums}")`;
            questions = ["What is a list comprehension?", "How to add a condition (filter)?", "Convert a for loop to list comprehension.", "What is a dict comprehension?"];
        }
        else if (t.includes('lambda') || t.includes('map/filter')) {
            theory = `**Lambda** creates small anonymous functions: \`lambda x: x * 2\`\n\n**map()** applies function to every element: \`map(func, iterable)\`\n\n**filter()** keeps elements where function returns True\n\n**reduce()** combines elements into single value (from functools)`;
            code = `# Lambda, Map, Filter, Reduce\nfrom functools import reduce\n\n# Lambda\nsquare = lambda x: x ** 2\nprint(f"5² = {square(5)}")\n\n# Map — apply to all\nnums = [1, 2, 3, 4, 5]\nsquared = list(map(lambda x: x**2, nums))\nprint(f"Squared: {squared}")\n\n# Filter — keep matching\nevens = list(filter(lambda x: x % 2 == 0, range(1, 11)))\nprint(f"Evens: {evens}")\n\n# Reduce — combine to one value\ntotal = reduce(lambda a, b: a + b, nums)\nprint(f"Sum: {total}")\n\n# Practical: Sort by custom key\nstudents = [("Alice", 88), ("Bob", 95), ("Carol", 72)]\nby_score = sorted(students, key=lambda s: s[1], reverse=True)\nprint(f"By score: {by_score}")`;
            questions = ["What is a lambda function?", "How does map() work?", "Difference between map and filter?", "Sort list of dicts by a specific key."];
        }
        else if (t.includes('decorator')) {
            theory = `**Decorators** wrap functions with reusable logic using \`@decorator\` syntax.\n\n**Use Cases:** Logging, timing, authentication, caching, validation.\n\n**How it works:** A decorator is a function that takes a function and returns a new function.`;
            code = `# Decorators\nimport time\n\n# Basic decorator\ndef log_call(func):\n    def wrapper(*args, **kwargs):\n        print(f"Calling {func.__name__}...")\n        result = func(*args, **kwargs)\n        print(f"  → returned {result}")\n        return result\n    return wrapper\n\n@log_call\ndef add(a, b):\n    return a + b\n\nadd(3, 5)\n\n# Timer decorator\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        elapsed = time.time() - start\n        print(f"  {func.__name__} took {elapsed:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow_sum(n):\n    return sum(range(n))\n\nprint(f"Result: {slow_sum(1000000)}")`;
            questions = ["What is a decorator?", "How does @ syntax work?", "Write a timer decorator.", "When are decorators useful?"];
        }
        else if (t.includes('generator') || t.includes('yielding')) {
            theory = `**Generators** produce values lazily using \`yield\`. They don't store all values in memory.\n\n**Why:** Process large datasets without loading everything into RAM.\n\n**Generator Expression:** \`(x**2 for x in range(1000000))\` — zero memory overhead.`;
            code = `# Generators\n\n# Generator function\ndef countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\n\nfor num in countdown(5):\n    print(num, end=" ")\nprint()\n\n# Fibonacci generator\ndef fibonacci(limit):\n    a, b = 0, 1\n    while a < limit:\n        yield a\n        a, b = b, a + b\n\nfibs = list(fibonacci(100))\nprint(f"Fibonacci: {fibs}")\n\n# Generator expression (memory efficient)\nsum_squares = sum(x**2 for x in range(1000000))\nprint(f"Sum of squares: {sum_squares}")\n\n# Reading large file line by line\ndef read_large_file(path):\n    with open(path, 'r') as f:\n        for line in f:\n            yield line.strip()`;
            questions = ["What is a generator?", "Difference between yield and return?", "Why are generators memory efficient?", "Write a generator for even numbers."];
        }
        else if (t.includes('stack') || t.includes('queue')) {
            theory = `**Stack** = LIFO (Last In, First Out). Use Python list: append() and pop().\n\n**Queue** = FIFO (First In, First Out). Use collections.deque for O(1) operations.\n\n**Uses:** Stack → undo, parentheses matching. Queue → BFS, task scheduling.`;
            code = `# Stacks and Queues\nfrom collections import deque\n\n# Stack (LIFO)\nstack = []\nstack.append("Page 1")\nstack.append("Page 2")\nstack.append("Page 3")\nprint(f"Stack: {stack}")\nprint(f"Pop: {stack.pop()}")  # Page 3\n\n# Balanced parentheses (classic interview)\ndef is_balanced(s):\n    stack = []\n    pairs = {')': '(', ']': '[', '}': '{'}\n    for c in s:\n        if c in '([{':\n            stack.append(c)\n        elif c in pairs:\n            if not stack or stack[-1] != pairs[c]:\n                return False\n            stack.pop()\n    return len(stack) == 0\n\nprint(f"'()[]{{}}' balanced: {is_balanced('()[]{}')}")\nprint(f"'([)]' balanced: {is_balanced('([)]')}")\n\n# Queue (FIFO)\nqueue = deque()\nqueue.append("Task 1")\nqueue.append("Task 2")\nqueue.append("Task 3")\nprint(f"\\nQueue: {list(queue)}")\nprint(f"Dequeue: {queue.popleft()}")  # Task 1`;
            questions = ["What is LIFO vs FIFO?", "Implement balanced parentheses checker.", "When to use stack vs queue?", "Why use deque instead of list for queue?"];
        }
        else if (t.includes('string method') || t.includes('regex')) {
            theory = `**String Methods:** split(), join(), strip(), replace(), find(), startswith(), endswith(), upper(), lower()\n\n**Regex (re module):** Pattern matching for complex text processing.\n- \`re.search()\` — find first match\n- \`re.findall()\` — find all matches\n- \`re.sub()\` — replace matches`;
            code = `# String Methods and Regex\nimport re\n\ntext = "  Hello, World! Python is great.  "\n\n# String methods\nprint(text.strip())           # Remove whitespace\nprint(text.strip().lower())   # Lowercase\nprint(text.strip().split())   # Split to list\nprint("-".join(["2026","03","08"]))  # Join\nprint(text.replace("World", "Python"))\n\n# Regex basics\nemail_text = "Contact us at info@example.com or support@test.org"\nemails = re.findall(r'[\\w.]+@[\\w.]+', email_text)\nprint(f"\\nEmails found: {emails}")\n\n# Validate phone number\ndef is_valid_phone(phone):\n    pattern = r'^\\d{10}$'\n    return bool(re.match(pattern, phone))\n\nprint(f"Valid phone: {is_valid_phone('9876543210')}")\nprint(f"Valid phone: {is_valid_phone('123')}")`;
            questions = ["5 most useful string methods?", "How does split() and join() work?", "Write regex to extract emails.", "Difference between re.search and re.findall?"];
        }
        else if (t.includes('module') || t.includes('package')) {
            theory = `**Modules** = Python files you can import. **Packages** = folders with __init__.py.\n\n**import:** \`import math\`, \`from os import path\`, \`import numpy as np\`\n\n**Organizing Code:** Split large programs into modules for clarity and reusability.`;
            code = `# Modules and Packages\nimport math\nimport os\nimport json\nfrom datetime import datetime\n\n# Using standard library\nprint(f"Pi: {math.pi:.4f}")\nprint(f"Sqrt(144): {math.sqrt(144)}")\nprint(f"Current dir: {os.getcwd()}")\nprint(f"Now: {datetime.now().strftime('%Y-%m-%d %H:%M')}")\n\n# Creating your own module\nmodule_code = '''\ndef add(a, b): return a + b\ndef multiply(a, b): return a * b\nPI = 3.14159\n'''\nprint(f"\\nSample module code: {module_code.strip()[:50]}...")\nprint("Save as mymath.py, then: from mymath import add")`;
            questions = ["What is a module vs package?", "3 ways to import in Python?", "What is __init__.py for?", "How to create your own module?"];
        }
        else if (t.includes('virtual environment') || t.includes('venv')) {
            theory = `**Virtual Environments** isolate project dependencies. Every project should have its own venv.\n\n**Commands:**\n- Create: \`python -m venv venv\`\n- Activate: \`venv\\\\Scripts\\\\activate\` (Windows)\n- Freeze: \`pip freeze > requirements.txt\`\n- Install: \`pip install -r requirements.txt\``;
            code = `# Virtual Environment Commands (run in terminal)\n# 1. Create\n# python -m venv venv\n\n# 2. Activate\n# Windows: venv\\\\Scripts\\\\activate\n# Mac/Linux: source venv/bin/activate\n\n# 3. Install packages\n# pip install numpy pandas scikit-learn\n\n# 4. Save dependencies\n# pip freeze > requirements.txt\n\n# 5. Install from requirements\n# pip install -r requirements.txt\n\n# Example requirements.txt content:\nreq = """numpy==1.24.0\npandas==2.0.0\nscikit-learn==1.3.0\nfastapi==0.100.0\nuvicorn==0.23.0"""\nprint("requirements.txt:")\nprint(req)`;
            questions = ["Why use virtual environments?", "How to create and activate venv?", "What does pip freeze do?", "How to share project dependencies?"];
        }
        else if (t.includes('sorting algorithm')) {
            theory = `**Bubble Sort** — O(n²): Compare adjacent, swap if needed. Simple but slow.\n\n**Merge Sort** — O(n log n): Divide in half, sort each, merge. Stable and reliable.\n\n**Quick Sort** — O(n log n) avg: Pick pivot, partition, recurse. Fast in practice.`;
            code = `# Sorting Algorithms\n\n# Bubble Sort — O(n²)\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\n# Merge Sort — O(n log n)\ndef merge_sort(arr):\n    if len(arr) <= 1: return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(l, r):\n    result = []\n    i = j = 0\n    while i < len(l) and j < len(r):\n        if l[i] <= r[j]:\n            result.append(l[i]); i += 1\n        else:\n            result.append(r[j]); j += 1\n    return result + l[i:] + r[j:]\n\narr = [64, 34, 25, 12, 22, 11, 90]\nprint(f"Bubble: {bubble_sort(arr.copy())}")\nprint(f"Merge: {merge_sort(arr.copy())}")`;
            questions = ["Time complexity of each sort?", "Why is merge sort O(n log n)?", "When to use which sort?", "Is Python's built-in sort stable?"];
        }
        else if (t.includes('binary search')) {
            theory = `**Binary Search** finds target in sorted array in O(log n) by repeatedly halving the search space.\n\n**Steps:** 1) Set left=0, right=end. 2) Check mid. 3) If target < mid, search left half. 4) If target > mid, search right half.`;
            code = `# Binary Search — O(log n)\ndef binary_search(arr, target):\n    left, right = 0, len(arr) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1\n\narr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint(f"Find 23: index {binary_search(arr, 23)}")\nprint(f"Find 99: index {binary_search(arr, 99)}")\n\n# Find insertion point\ndef find_insert_pos(arr, target):\n    left, right = 0, len(arr)\n    while left < right:\n        mid = (left + right) // 2\n        if arr[mid] < target:\n            left = mid + 1\n        else:\n            right = mid\n    return left\n\nprint(f"Insert 20 at: {find_insert_pos(arr, 20)}")`;
            questions = ["Why must array be sorted?", "Time complexity of binary search?", "Binary search vs linear search?", "Find first occurrence of target."];
        }
        else if (t.includes('linked list')) {
            theory = `**Linked List** stores elements in nodes, each pointing to the next. Unlike arrays, insertion/deletion is O(1) at head.\n\n**Node:** Contains data + pointer to next node.\n**Head:** First node in the list.\n\n**Tradeoffs:** LL has O(1) insert/delete but O(n) access. Arrays have O(1) access but O(n) insert.`;
            code = `# Linked List Implementation\nclass Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, data):\n        new = Node(data)\n        if not self.head:\n            self.head = new\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = new\n    \n    def display(self):\n        vals = []\n        curr = self.head\n        while curr:\n            vals.append(str(curr.data))\n            curr = curr.next\n        print(" → ".join(vals))\n    \n    def reverse(self):\n        prev, curr = None, self.head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        self.head = prev\n\nll = LinkedList()\nfor x in [1, 2, 3, 4, 5]: ll.append(x)\nll.display()       # 1 → 2 → 3 → 4 → 5\nll.reverse()\nll.display()       # 5 → 4 → 3 → 2 → 1`;
            questions = ["What is a linked list?", "Array vs linked list tradeoffs?", "How to reverse a linked list?", "Time complexity of insert at head?"];
        }
        else if (t.includes('recursion')) {
            theory = `**Recursion** = function calling itself. Must have a **base case** (stops recursion) and **recursive case** (makes progress).\n\n**Call Stack:** Each call adds a frame. Too many calls = StackOverflow.\n\n**Classic Problems:** Factorial, Fibonacci, tree traversal, binary search.`;
            code = `# Recursion Fundamentals\n\n# Factorial\ndef factorial(n):\n    if n <= 1: return 1      # base case\n    return n * factorial(n-1)  # recursive case\n\nprint(f"5! = {factorial(5)}")  # 120\n\n# Fibonacci\ndef fib(n):\n    if n <= 1: return n\n    return fib(n-1) + fib(n-2)\n\nprint(f"fib(10) = {fib(10)}")  # 55\n\n# Sum of list (recursive)\ndef rec_sum(lst):\n    if not lst: return 0\n    return lst[0] + rec_sum(lst[1:])\n\nprint(f"Sum: {rec_sum([1,2,3,4,5])}")  # 15\n\n# Binary search (recursive)\ndef rec_binary_search(arr, target, lo, hi):\n    if lo > hi: return -1\n    mid = (lo + hi) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: return rec_binary_search(arr, target, mid+1, hi)\n    else: return rec_binary_search(arr, target, lo, mid-1)\n\narr = [1,3,5,7,9,11]\nprint(f"Find 7: {rec_binary_search(arr, 7, 0, len(arr)-1)}")`;
            questions = ["What is a base case?", "What causes stack overflow?", "Write recursive factorial.", "Recursion vs iteration tradeoffs?"];
        }
        else if (t.includes('debug')) {
            theory = `**Debugging** is systematic problem solving — not random changes.\n\n**Tools:** print() statements, VS Code debugger (F5), breakpoints, Python pdb.\n\n**Process:** 1) Read the error message. 2) Find the line. 3) Check variable values. 4) Fix and test.`;
            code = `# Debugging Techniques\n\n# 1. Read the traceback\ndef buggy_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        print(f"ERROR: Cannot divide {a} by {b}")\n        return None\n\nresult = buggy_divide(10, 0)\n\n# 2. Print debugging\ndef find_avg(nums):\n    print(f"DEBUG: nums = {nums}")        # debug print\n    print(f"DEBUG: len = {len(nums)}")     # debug print\n    if not nums:\n        return 0\n    total = sum(nums)\n    print(f"DEBUG: total = {total}")       # debug print\n    return total / len(nums)\n\nfind_avg([10, 20, 30])\n\n# 3. Assert statements\ndef set_age(age):\n    assert 0 <= age <= 150, f"Invalid age: {age}"\n    return age\n\ntry:\n    set_age(200)\nexcept AssertionError as e:\n    print(f"Assertion failed: {e}")`;
            questions = ["3 debugging techniques?", "How to read a Python traceback?", "What are assert statements for?", "How to use VS Code debugger?"];
        }
        else if (t.includes('clean code') || t.includes('pep 8')) {
            theory = `**PEP 8** is Python's style guide. Following it makes code readable and professional.\n\n**Key Rules:** snake_case for variables/functions, PascalCase for classes, 4-space indent, max 79 chars per line.\n\n**Docstrings:** Document every function and class. Use type hints.`;
            code = `# Clean Code: PEP 8 Style\n\n# BAD ❌\ndef calcAvg(l):\n  s=0\n  for i in l:s+=i\n  return s/len(l)\n\n# GOOD ✅\ndef calculate_average(numbers: list[float]) -> float:\n    \"\"\"Calculate the arithmetic mean of a list of numbers.\n    \n    Args:\n        numbers: List of numeric values.\n    \n    Returns:\n        The average value.\n    \n    Raises:\n        ValueError: If the list is empty.\n    \"\"\"\n    if not numbers:\n        raise ValueError("Cannot calculate average of empty list")\n    \n    total = sum(numbers)\n    count = len(numbers)\n    return total / count\n\n# Type hints\ndef greet(name: str, times: int = 1) -> str:\n    return (f"Hello, {name}! " * times).strip()\n\nprint(calculate_average([10, 20, 30]))\nprint(greet("Ruban", 2))`;
            questions = ["What is PEP 8?", "snake_case vs PascalCase?", "Why write docstrings?", "What are type hints?"];
        }
        else if (t.includes('git basics') || t.includes('init')) {
            theory = `**Git** tracks code changes. Every product company uses it.\n\n**Core Commands:** git init, git add, git commit, git status, git log.\n\n**.gitignore:** List files Git should never track (data files, secrets, __pycache__).`;
            code = `# Git Commands (run in terminal)\n\n# Initialize repo\n# git init\n\n# Check status\n# git status\n\n# Stage files\n# git add .                    # all files\n# git add src/model.py         # specific file\n\n# Commit\n# git commit -m "Add churn prediction model"\n\n# View history\n# git log --oneline -5\n\n# .gitignore for ML projects\ngitignore = \"\"\"# Python\n__pycache__/\n*.pyc\n.env\nvenv/\n\n# Data\n*.csv\n*.pkl\ndata/raw/\n\n# IDE\n.vscode/\n.idea/\n\n# Notebooks\n.ipynb_checkpoints/\"\"\"\nprint(gitignore)`;
            questions = ["What is git init, add, commit?", "What goes in .gitignore?", "Why meaningful commit messages?", "What is git log?"];
        }
        else if (t.includes('github') || t.includes('readme')) {
            theory = `**GitHub** hosts your code and serves as your portfolio. Hiring managers check your GitHub profile.\n\n**Key Actions:** Create repo, push code, write README, pin best projects.\n\n**Good README:** Title, description, setup instructions, screenshots, tech stack.`;
            code = `# GitHub Workflow (terminal commands)\n\n# Connect to GitHub\n# git remote add origin https://github.com/you/project.git\n# git branch -M main\n# git push -u origin main\n\n# README template\nreadme = \"\"\"# Project Name\n\nBrief description of what this project does.\n\n## Setup\n\\x60\\x60\\x60bash\npip install -r requirements.txt\npython main.py\n\\x60\\x60\\x60\n\n## Features\n- Feature 1\n- Feature 2\n\n## Tech Stack\n- Python 3.10\n- scikit-learn\n- FastAPI\n\n## Results\n| Model | Accuracy | F1 |\n|-------|----------|----|\n| RF    | 0.87     | 0.83 |\n| XGB   | 0.91     | 0.88 |\n\"\"\"\nprint(readme)`;
            questions = ["How to push code to GitHub?", "What makes a good README?", "Why pin projects on GitHub?", "How to write a project description?"];
        }
        else if (t.includes('capstone') || t.includes('task manager')) {
            theory = `**Capstone Project: CLI Task Manager**\n\nCombine everything learned: functions, file I/O, JSON, error handling, clean code.\n\n**Features:** Add task, list tasks, mark complete, delete task, save to JSON.`;
            code = `# CLI Task Manager\nimport json, os\n\nTASKS_FILE = "tasks.json"\n\ndef load_tasks():\n    if os.path.exists(TASKS_FILE):\n        with open(TASKS_FILE, 'r') as f:\n            return json.load(f)\n    return []\n\ndef save_tasks(tasks):\n    with open(TASKS_FILE, 'w') as f:\n        json.dump(tasks, f, indent=2)\n\ndef add_task(title):\n    tasks = load_tasks()\n    tasks.append({"title": title, "done": False})\n    save_tasks(tasks)\n    print(f"✅ Added: {title}")\n\ndef list_tasks():\n    tasks = load_tasks()\n    if not tasks:\n        print("No tasks yet!")\n        return\n    for i, t in enumerate(tasks, 1):\n        status = "✅" if t["done"] else "⬜"\n        print(f"  {i}. {status} {t['title']}")\n\ndef complete_task(index):\n    tasks = load_tasks()\n    if 0 < index <= len(tasks):\n        tasks[index-1]["done"] = True\n        save_tasks(tasks)\n        print(f"✅ Completed: {tasks[index-1]['title']}")\n\nadd_task("Learn Python basics")\nadd_task("Build ML pipeline")\nadd_task("Write API tests")\ncomplete_task(1)\nlist_tasks()`;
            questions = ["How to structure a CLI project?", "Why use JSON for storage?", "How to handle file not found?", "What features would you add next?"];
        }
        // Default for remaining Phase 1
        else {
            return buildGenericSmart(day, topic, phase);
        }

        return { content: `### Day ${day}: ${topic}\n\n${theory}`, code: `# Day ${day}: ${topic}\n${code}`, questions };
    }

    // Phase 2: Data Handling & SQL — use specific builder
    if (phase === "Data Handling & SQL") {
        const result = buildPhase2(day, topic, t);
        if (result) return result;
    }

    // Phase 3: Machine Learning Core — use specific builder
    if (phase === "Machine Learning Core") {
        const result = buildPhase3(day, topic, t);
        if (result) return result;
    }

    // Phase 4: Deep Learning & Applied AI
    if (phase === "Deep Learning & Applied AI") {
        const result = buildPhase4(day, topic, t);
        if (result) return result;
    }

    // Phase 5: Backend & AI Engineering
    if (phase === "Backend & AI Engineering") {
        const result = buildPhase5(day, topic, t);
        if (result) return result;
    }

    // Phase 6: Deployment & MLOps
    if (phase === "Deployment & MLOps") {
        const result = buildPhase6(day, topic, t);
        if (result) return result;
    }

    // Phase 7: Portfolio Projects
    if (phase === "Portfolio Projects") {
        const result = buildPhase7(day, topic, t);
        if (result) return result;
    }

    // Phase 8: Interview & Job Launch
    if (phase === "Interview & Job Launch") {
        const result = buildPhase8(day, topic, t);
        if (result) return result;
    }

    // For all other phases, use the generic smart builder
    return buildGenericSmart(day, topic, phase);
}

// Generic smart builder that uses topic name to create relevant content
function buildGenericSmart(day, topic, phase) {
    const t = topic.toLowerCase();
    const subject = topic.split(':')[0].trim();
    const detail = topic.includes(':') ? topic.split(':').slice(1).join(':').trim() : topic;

    // Extract key concepts from topic name
    const concepts = topic.replace(/[—–:]/g, ',').split(',').map(s => s.trim()).filter(s => s.length > 2);

    let theoryPoints = concepts.map(c => `- **${c}:** Study this concept deeply — learn the syntax, see real-world examples, and practice writing code for it.`).join('\n');

    let phaseContext = '';
    if (phase === "Data Handling & SQL") {
        if (t.includes('numpy')) phaseContext = `NumPy is the foundation of numerical computing in Python. Every ML library is built on NumPy arrays.`;
        else if (t.includes('sql')) phaseContext = `SQL is tested in every data role interview. Master this concept to ace the SQL round.`;
        else if (t.includes('pandas')) phaseContext = `Pandas is the workhorse of data manipulation. Never loop over rows — use vectorized operations.`;
        else if (t.includes('eda') || t.includes('insight') || t.includes('business')) phaseContext = `EDA is how real data scientists understand problems before modeling. Focus on generating actionable business insights.`;
        else if (t.includes('matplotlib') || t.includes('seaborn')) phaseContext = `Data visualization communicates insights to stakeholders. Every chart should answer a business question.`;
        else if (t.includes('capstone') || t.includes('review')) phaseContext = `Apply everything you've learned in this phase to a real dataset. Focus on clean, documented analysis.`;
        else phaseContext = `Data handling is 80% of any ML project. Getting good at it makes you 10x more productive.`;
    }
    else if (phase === "Machine Learning Core") {
        if (t.includes('stat') || t.includes('probability') || t.includes('hypothesis')) phaseContext = `Statistics is the language of data science. A/B testing, significance testing, and confidence intervals are used daily at product companies.`;
        else if (t.includes('regression')) phaseContext = `Regression predicts continuous values. It's often the first model deployed because it's interpretable and fast.`;
        else if (t.includes('classification') || t.includes('logistic') || t.includes('knn') || t.includes('naive bayes') || t.includes('svm')) phaseContext = `Classification is the most common ML task in production. Always evaluate with precision, recall, and F1 — not just accuracy.`;
        else if (t.includes('evaluation') || t.includes('confusion') || t.includes('precision') || t.includes('f1') || t.includes('roc') || t.includes('cross-validation') || t.includes('bias-variance')) phaseContext = `Model evaluation separates junior from senior engineers. Understanding when accuracy is misleading is critical.`;
        else if (t.includes('tree') || t.includes('forest') || t.includes('ensemble') || t.includes('boost') || t.includes('xgboost') || t.includes('lightgbm')) phaseContext = `Tree-based models dominate tabular data in production. XGBoost and LightGBM are the most-used models in industry.`;
        else if (t.includes('pipeline') || t.includes('feature') || t.includes('capstone') || t.includes('review') || t.includes('mini-project')) phaseContext = `Product companies want engineers who own the entire pipeline: data → features → model → evaluation → deployment.`;
        else if (t.includes('unsupervised') || t.includes('clustering') || t.includes('pca')) phaseContext = `Unsupervised learning finds hidden patterns without labels. Used for customer segmentation, anomaly detection, and dimensionality reduction.`;
        else if (t.includes('hyperparameter') || t.includes('grid') || t.includes('random')) phaseContext = `The difference between a good and great model is often just hyperparameter tuning. Use GridSearchCV or RandomizedSearchCV.`;
        else if (t.includes('saving') || t.includes('joblib') || t.includes('pickle')) phaseContext = `A model that can't be saved and loaded is useless in production. Use joblib for scikit-learn models.`;
        else phaseContext = `Machine Learning is about finding patterns in data. The goal is always generalization to unseen data.`;
    }
    else if (phase === "Deep Learning & Applied AI") {
        if (t.includes('cnn') || t.includes('image') || t.includes('pixel') || t.includes('kernel') || t.includes('pooling')) phaseContext = `CNNs are the backbone of computer vision — image classification, object detection, and segmentation.`;
        else if (t.includes('nlp') || t.includes('text') || t.includes('tokeniz') || t.includes('tf-idf') || t.includes('embedding') || t.includes('sentiment') || t.includes('hugging')) phaseContext = `NLP enables machines to understand text. The field has shifted from bag-of-words to transformers and pretrained models.`;
        else if (t.includes('transfer')) phaseContext = `Transfer learning uses pretrained models (ResNet, BERT) fine-tuned on your data. In production, you almost never train from scratch.`;
        else if (t.includes('tensorflow') || t.includes('keras') || t.includes('pytorch')) phaseContext = `Modern deep learning frameworks provide high-level APIs for building, training, and deploying neural networks.`;
        else phaseContext = `Deep learning is powerful for vision, NLP, and complex pattern recognition, but simpler models often win on tabular data.`;
    }
    else if (phase === "Backend & AI Engineering") {
        if (t.includes('fastapi') || t.includes('endpoint') || t.includes('api')) phaseContext = `APIs are how ML models reach users. No company deploys Jupyter notebooks. FastAPI is the modern Python framework for ML APIs.`;
        else if (t.includes('docker') || t.includes('container') || t.includes('dockerfile')) phaseContext = `Docker ensures your app runs identically everywhere. "Works on my machine" is not acceptable in production.`;
        else if (t.includes('test') || t.includes('pytest') || t.includes('mock')) phaseContext = `Testing separates amateur from professional code. Product companies have mandatory testing requirements.`;
        else if (t.includes('git') || t.includes('github') || t.includes('branch') || t.includes('pull request')) phaseContext = `Git branching, code reviews, and CI/CD are daily workflows at every product company.`;
        else phaseContext = `AI Engineering combines ML with software engineering. Companies hire engineers who can build, test, and deploy.`;
    }
    else if (phase === "Deployment & MLOps") {
        phaseContext = `Deployment gets models from notebooks into the real world. MLOps makes ML systems reliable and maintainable in production.`;
    }
    else if (phase === "Portfolio Projects") {
        if (t.includes('churn')) phaseContext = `**Customer Churn Prediction** — Telecom/SaaS companies lose millions to churn. Build a predictive system with FastAPI + Streamlit.`;
        else if (t.includes('resume screen')) phaseContext = `**Resume Screening NLP App** — HR teams review thousands of resumes. Build an NLP system that ranks candidates by relevance.`;
        else if (t.includes('sales forecast')) phaseContext = `**Sales Forecasting Dashboard** — Retail needs accurate demand forecasts. Build a time-series model with interactive dashboard.`;
        else if (t.includes('github profile') || t.includes('resume bullet')) phaseContext = `Portfolio polish time — clean GitHub profile, pin best projects, write resume bullets using the XYZ formula.`;
        else phaseContext = `Build portfolio-quality projects that demonstrate end-to-end ML engineering skills to hiring managers.`;
    }
    else if (phase === "Interview & Job Launch") {
        phaseContext = `Convert your learning into job offers. Practice real interview questions, whiteboard problems, and project walkthroughs.`;
    }
    else {
        phaseContext = `This is an essential skill for modern AI/ML engineering roles at product companies.`;
    }

    const content = `### Day ${day}: ${topic}\n\n${phaseContext}\n\n**Key Concepts:**\n${theoryPoints}\n\n**Today's Focus:**\n- Study each concept with hands-on practice\n- Write working code examples\n- Connect to real-world applications\n- Think about how this would be tested in an interview`;

    // Build meaningful code based on phase
    let code;
    if (phase === "Machine Learning Core") {
        code = `# Day ${day}: ${topic}\nimport numpy as np\nfrom sklearn.model_selection import train_test_split\n\n# Today's topic: ${detail}\nprint("Day ${day}: ${topic}")\nprint("Phase: ${phase}")\n\n# Generate sample data\nnp.random.seed(42)\nX = np.random.randn(200, 5)\ny = (X[:, 0] + X[:, 1] * 0.5 > 0).astype(int)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\nprint(f"Train: {X_train.shape}, Test: {X_test.shape}")\nprint(f"Target distribution: {np.bincount(y_train)}")\n\n# YOUR TASK: Implement today's concept here\n# Key areas: ${concepts.join(', ')}`;
    } else if (phase === "Deep Learning & Applied AI") {
        code = `# Day ${day}: ${topic}\nimport numpy as np\n\n# Today's topic: ${detail}\nprint("Day ${day}: ${topic}")\nprint("Phase: ${phase}")\n\n# Deep Learning concepts to implement:\n# ${concepts.join('\\n# ')}\n\n# Example: Setting up the foundation\ndef demonstrate_concept():\n    \"\"\"Demonstrate ${detail}\"\"\"\n    print("Implementing: ${topic}")\n    # Add your implementation here\n    \ndemonstrate_concept()`;
    } else if (phase === "Backend & AI Engineering") {
        code = `# Day ${day}: ${topic}\n\"\"\"\nBackend Engineering: ${detail}\n\nKey concepts:\n${concepts.map((c, i) => `${i + 1}. ${c}`).join('\\n')}\n\"\"\"\n\nprint("Day ${day}: ${topic}")\nprint("Phase: ${phase}")\n\n# Implementation for: ${detail}\n# Follow the tutorial above for step-by-step guidance`;
    } else if (phase === "Portfolio Projects") {
        let projectName = "Portfolio Project";
        if (t.includes('churn')) projectName = "Customer Churn Prediction";
        else if (t.includes('resume')) projectName = "Resume Screening NLP";
        else if (t.includes('sales')) projectName = "Sales Forecasting";
        code = `# Day ${day}: ${topic}\n# Project: ${projectName}\n\"\"\"\nToday's task: ${detail}\n\nProject structure:\n${projectName.toLowerCase().replace(/ /g, '_')}/\n├── data/\n├── notebooks/\n├── src/\n│   ├── data_processing.py\n│   ├── model.py\n│   └── api.py\n├── tests/\n├── Dockerfile\n└── README.md\n\"\"\"\nprint("Day ${day}: ${topic}")\nprint("Project: ${projectName}")`;
    } else {
        code = `# Day ${day}: ${topic}\n# Phase: ${phase}\n\nprint("Day ${day}: ${topic}")\nprint("Phase: ${phase}")\n\n# Key concepts to practice:\n${concepts.map((c, i) => `# ${i + 1}. ${c}`).join('\\n')}\n\n# Follow the tutorial above for implementation guidance`;
    }

    const questions = [
        `Explain ${concepts[0] || topic} in your own words with a real-world example.`,
        `How would you use ${concepts[0] || topic} in a product company project?`,
        `Write working code that demonstrates ${detail || topic}.`,
        `What interview questions could be asked about ${concepts[0] || topic}?`
    ];

    return { content, code, questions };
}

// ============================================================
// MAIN: Rebuild all 240 lesson files
// ============================================================
function rebuild() {
    console.log("🔧 Rebuilding all 240 lessons with specific content...\n");

    let handcraftedCount = 0;
    let smartCount = 0;

    for (let i = 0; i < 240; i++) {
        const day = i + 1;
        const topic = TOPICS[i];
        const phase = getPhase(day);

        let lessonContent, lessonCode, lessonQuestions;

        // Check if handcrafted content exists
        if (HANDCRAFTED[day] && HANDCRAFTED[day].content) {
            lessonContent = HANDCRAFTED[day].content;
            lessonCode = HANDCRAFTED[day].code;
            lessonQuestions = HANDCRAFTED[day].questions;
            handcraftedCount++;
        } else {
            // Use smart builder
            const smart = buildSmartContent(day, topic, phase);
            lessonContent = smart.content;
            lessonCode = smart.code;
            lessonQuestions = smart.questions;
            smartCount++;
        }

        // Read existing lesson to preserve keywords/takeaways if present
        const lessonPath = path.join(LESSONS_DIR, `${day}.json`);
        let existing = {};
        if (fs.existsSync(lessonPath)) {
            existing = JSON.parse(fs.readFileSync(lessonPath, 'utf8'));
        }

        const lesson = {
            id: day,
            title: topic,
            content: lessonContent,
            codeExample: lessonCode,
            practiceQuestions: lessonQuestions,
            keywords: existing.keywords || [],
            keyTakeaways: existing.keyTakeaways || []
        };

        fs.writeFileSync(lessonPath, JSON.stringify(lesson, null, 2));
    }

    console.log(`✅ Handcrafted: ${handcraftedCount} lessons`);
    console.log(`✅ Smart-generated: ${smartCount} lessons`);
    console.log(`✅ Total: ${handcraftedCount + smartCount} lessons rebuilt`);
    console.log("\nNext: Run 'node enhance_lessons.js' to refresh keywords/takeaways");
}

rebuild();
