const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'data', 'resources');

// Clean up existing resources to avoid duplicates or old formats
if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        if (file.endsWith('.json')) {
            fs.unlinkSync(path.join(dir, file));
        }
    }
} else {
    fs.mkdirSync(dir, { recursive: true });
}

const interviewModules = {
  "python-interview-prep": {
    "title": "Python Developer Interview Prep",
    "url": "https://docs.python.org/3/tutorial/index.html",
    "content": "### Crack the Interview: Python Developer Edition\n\nDirectly referenced from the **Official Python Documentation**, this comprehensive tutorial is designed to prepare you for technical interviews. We bypass generic high-level overviews and jump straight into core mechanics, edge cases, and algorithmic thinking expected in Big Tech interviews.\n\n**Theory: Variables & Memory Management**\n- **Core Concept:** In Python, variables are not 'containers' that store values; they are **labels or references** pointing to objects in memory.\n- **Application:** Knowing the difference between mutable (lists, dicts) and immutable (strings, ints) types is the #1 most frequently asked interview question regarding Python's core behavior.\n- **Interview Trick:** When an interviewer asks what happens when you pass a list to a function and modify it inside, you must explain that lists are passed by *object reference*, meaning the original list is permanently altered.",
    "codeExample": "# 💡 Crack the Interview: Variable References & Mutability\nx = 10\ny = x\nx += 1\n# Question: What is y?\n# Answer: y is still 10, because integers are immutable. x was pointed to a new object (11).\n\nlist_a = [1, 2, 3]\nlist_b = list_a\nlist_a.append(4)\n# Question: What is list_b?\n# Answer: list_b is [1, 2, 3, 4], because both labels point to the exact same memory object.",
    "practiceQuestions": [
      "Explain the difference between '==' and 'is' in Python.",
      "What is a Generator? How does the 'yield' keyword differ from 'return'?",
      "Explain the Global Interpreter Lock (GIL) and how it affects multi-threading."
    ],
    "keywords": ["Memory Management", "Mutability", "References", "Big Tech Prep"],
    "keyTakeaways": [
      "Variables are memory references, not buckets.",
      "Lists and Dictionaries are mutable; Strings and Integers are immutable.",
      "Never use mutable default arguments in Python function definitions."
    ]
  },
  "sql-interview-prep": {
    "title": "SQL Database Interview Prep",
    "url": "https://www.postgresql.org/docs/",
    "content": "### Crack the Interview: SQL & Database Design\n\nSQL interviews test your ability to think in sets, rather than imperative loops. Interviewers want to see how you handle joins, aggregations, and performance bottlenecks on massive tables.\n\n**Theory: Joins and Indexing**\n- **Core Concept:** Understand the exact difference between `INNER JOIN`, `LEFT JOIN`, and `FULL OUTER JOIN`. \n- **Application:** You must know how to use `GROUP BY` alongside `HAVING` (filtering after aggregation) rather than `WHERE` (filtering before aggregation).\n- **Interview Trick:** If asked how to optimize a slow query, the first answer should always be checking the **Execution Plan** (`EXPLAIN ANALYZE`) and ensuring appropriate **Indexes** exist on the joined or filtered columns.",
    "codeExample": "-- 💡 Crack the Interview: Top N per Group\n-- Question: Find the highest paid employee in EACH department.\n\nWITH RankedEmployees AS (\n  SELECT \n    department_id,\n    employee_name,\n    salary,\n    -- ROW_NUMBER() or RANK() over a partition is a classic interview pattern\n    DENSE_RANK() OVER(PARTITION BY department_id ORDER BY salary DESC) as rank\n  FROM employees\n)\nSELECT department_id, employee_name, salary \nFROM RankedEmployees\nWHERE rank = 1;",
    "practiceQuestions": [
      "What is the difference between WHERE and HAVING?",
      "Explain what an Index is under the hood (B-Tree vs Hash).",
      "How do you resolve a N+1 query problem?",
      "Write a query to find all duplicate records in a table."
    ],
    "keywords": ["Indexing", "Execution Plans", "Joins", "Aggregation"],
    "keyTakeaways": [
      "HAVING filters after aggregation; WHERE filters before.",
      "Always check the EXPLAIN ANALYZE execution plan before adding indexes.",
      "Window functions like ROW_NUMBER() are standard solutions for 'Top N' interview questions."
    ]
  },
  "pandas-interview-prep": {
    "title": "Pandas & Data Science Interview Prep",
    "url": "https://pandas.pydata.org/docs/",
    "content": "### Crack the Interview: Data Wrangling with Pandas\n\nData Science interviews heavily focus on your ability to clean and manipulate raw, messy CSVs using Pandas. They test for vectorized thinking rather than standard looping.\n\n**Theory: Vectorization vs Iteration**\n- **Core Concept:** Under the hood, Pandas is built on NumPy (C-arrays). You should NEVER use `iterrows()` or `for` loops on a DataFrame if a vectorized operation or `.apply()` exists.\n- **Application:** Handling missing data. Interviewers will ask how you handle NaNs. You must explain when to drop (`dropna`) versus when to impute (`fillna` with mean/median).\n- **Interview Trick:** Be comfortable explaining `groupby()` aggregations and how `merge()` differs from `concat()`.",
    "codeExample": "# 💡 Crack the Interview: Handling Missing Data Vectorized\nimport pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({'Age': [25, np.nan, 30, 22], 'Salary': [50000, 60000, np.nan, 45000]})\n\n# Bad (Looping):\n# for i in range(len(df)):\n#     if pd.isna(df['Age'][i]): ... \n\n# Good (Vectorized Imputation):\ndf['Age'] = df['Age'].fillna(df['Age'].median())\ndf['Salary'] = df['Salary'].fillna(df['Salary'].mean())\nprint(df)",
    "practiceQuestions": [
      "Why is iterating over DataFrame rows considered an anti-pattern?",
      "Explain the difference between `loc` and `iloc`.",
      "How do you merge two DataFrames on a specific column, similar to a SQL LEFT JOIN?"
    ],
    "keywords": ["Vectorization", "Data Imputation", "DataFrames", "NumPy Integration"],
    "keyTakeaways": [
      "Never use for-loops or iterrows() on massive datasets; use vectorization.",
      "Missing data (NaNs) must be purposefully dropped or filled via mean/median imputation.",
      "Pandas is just a high-level wrapper constructed on top of optimized C-compiled NumPy arrays."
    ]
  },
  "ml-interview-prep": {
      "title": "Machine Learning Interview Prep",
      "url": "https://scikit-learn.org/stable/",
      "content": "### Crack the Interview: Machine Learning Fundamentals\n\nML interviews test your mathematical intuition and your understanding of model trade-offs. You rarely code algorithms from scratch; you explain *why* you chose them.\n\n**Theory: Bias-Variance Tradeoff**\n- **Core Concept:** You must understand Overfitting (high variance) vs Underfitting (high bias). \n- **Application:** If a Random Forest has 100% training accuracy but 60% test accuracy, it is overfitting. You must suggest regularization, pruning, or cross-validation.\n- **Interview Trick:** Never trust Accuracy on an imbalanced dataset (e.g., fraud detection where 99% of data is 'not fraud'). You must propose **Precision, Recall, and the F1-Score** as your metrics.",
      "codeExample": "# 💡 Crack the Interview: Model Evaluation\nfrom sklearn.metrics import classification_report, confusion_matrix\n\n# Interviewers want you to look beyond simple 'accuracy'\ny_true = [0, 1, 0, 0, 1, 0] # 0: Normal, 1: Fraud\ny_pred = [0, 1, 0, 0, 0, 0] # Model missed a fraud case\n\nprint(\"Confusion Matrix:\\n\", confusion_matrix(y_true, y_pred))\nprint(\"\\nClassification Report:\\n\", classification_report(y_true, y_pred))\n# You must explain why 'Recall' matters more for Fraud detection than 'Precision'.",
      "practiceQuestions": [
        "Explain the Bias-Variance Tradeoff in your own words.",
        "When would you use a Random Forest instead of a Linear Regression model?",
        "What is Cross-Validation and why is it necessary before deploying a model?",
        "How do you handle severe class imbalance in a dataset?"
      ],
      "keywords": ["Bias-Variance", "Overfitting", "Precision", "Recall"],
      "keyTakeaways": [
        "High Variance equals Overfitting; High Bias equals Underfitting.",
        "Accuracy is a deceptive metric on imbalanced datasets. Calculate Precision, Recall, and the F1-Score instead.",
        "Cross-Validation ensures your model hasn't just memorized the specific training split."
      ]
  },
  "deeplearning-interview-prep": {
      "title": "Deep Learning & Neural Networks Prep",
      "url": "https://pytorch.org/",
      "content": "### Crack the Interview: Deep Learning Architectures\n\nFor advanced AI roles, you must understand the calculus behind the network. \n\n**Theory: Backpropagation & Activation Functions**\n- **Core Concept:** Backpropagation uses the chain rule of calculus to calculate gradients backward from the output layer to update weights. \n- **Application:** Knowing why we use ReLU (Rectified Linear Unit) over Sigmoid in hidden layers. Sigmoid causes the **Vanishing Gradient Problem** in deep networks.\n- **Interview Trick:** If asked about CNNs (Convolutional Neural Networks) for images, explain how *pooling layers* reduce spatial dimensions and *convolution operations* extract features independently of location.",
      "codeExample": "# 💡 Crack the Interview: Implementing a basic Forward/Backward pass concept\nimport torch\n\n# PyTorch is the industry standard for DL interviews\nx = torch.tensor([2.0], requires_grad=True)\ny = torch.tensor([8.0]) # Target\n\n# Forward Pass: y_pred = x^2\ny_pred = x**2\n\n# Loss Function (MSE)\nloss = (y_pred - y)**2 \n\n# Backward Pass (Calculate Gradients automatically)\nloss.backward()\n\n# The interviewer will ask: What is x.grad mathematically here?\nprint(f\"Gradient of x: {x.grad.item()}\")",
      "practiceQuestions": [
        "What is the Vanishing Gradient Problem and how does ReLU solve it?",
        "Explain what Dropout layers do and why they are used.",
        "What is the difference between a CNN and an RNN/Transformer architecture?",
        "How do you choose a Learning Rate, and what happens if it is too high?"
      ],
      "keywords": ["Backpropagation", "Loss Gradients", "ReLU", "Architecture"],
      "keyTakeaways": [
        "Backpropagation uses calculus chain rules to trace the source of errors backward through the network layers.",
        "Sigmoid activation causes Vanishing Gradients; ReLU passes active signals securely without decaying.",
        "Convolutional pooling actively reduces the parameters needed to calculate image matrices."
      ]
  },
  "systemdesign-interview-prep": {
       "title": "System Design & MLOps Prep",
       "url": "https://docker.com",
       "content": "### Crack the Interview: System Design & Deployment\n\nSenior engineering interviews rely heavily on how you design scalable systems. A model on your laptop is useless if it cannot serve 10,000 requests per second in production.\n\n**Theory: Scaling & Containerization**\n- **Core Concept:** Docker containers isolate environments. Kubernetes orchestrates these containers to scale up when traffic spikes.\n- **Application:** For ML, you usually wrap your model in a **FastAPI** REST endpoint, containerize it with **Docker**, and deploy it to cloud infrastructure.\n- **Interview Trick:** The interviewer will ask: \"What happens when 500 users hit your ML model endpoint simultaneously?\" Answer by introducing an async task queue (like Celery/Redis) or dynamic scaling, rather than locking the main thread.",
       "codeExample": "# 💡 Crack the Interview: Non-Blocking ML API (FastAPI)\nfrom fastapi import FastAPI, BackgroundTasks\nimport time\n\napp = FastAPI()\n\ndef heavy_model_inference(data):\n    # Simulate a deep learning model taking 5 seconds to run\n    time.sleep(5) \n    print(f\"Finished processing {data}\")\n\n@app.post(\"/predict\")\nasync def predict(data: str, background_tasks: BackgroundTasks):\n    # Interview Answer: We DO NOT block the API request waiting for the ML model.\n    # We send it to a background task (or queue) and return a 202 Accepted immediately.\n    background_tasks.add_task(heavy_model_inference, data)\n    return {\"status\": \"Processing started\", \"job_id\": \"12345\"}",
       "practiceQuestions": [
         "What is the difference between monolithic architecture and microservices?",
         "How does Docker prevent the 'It works on my machine' problem?",
         "What is a Load Balancer and why is it necessary for a high-traffic AI API?",
         "Explain the difference between Batch Processing and Real-Time Inference."
       ],
       "keywords": ["Docker", "Deployments", "Microservices", "Load Balancing"],
       "keyTakeaways": [
         "Docker containers guarantee runtime consistency across production clusters (like Kubernetes).",
         "Never block an API's main thread with heavy ML inference. Send it to a Background Task/Queue (Non-blocking).",
         "A single ML server crushes under traffic without stateless Load Balancers distributing the requests."
       ]
  }
};

for (const [slug, data] of Object.entries(interviewModules)) {
  fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(data, null, 2));
}

console.log('Successfully generated complete Interview Prep resource modules.');
