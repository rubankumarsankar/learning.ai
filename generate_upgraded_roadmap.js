const fs = require('fs');
const path = require('path');
const { PHASES, TOPICS } = require('./roadmap_topics');

// ============================================================
// CONFIGURATION
// ============================================================
const DATA_DIR = path.join(__dirname, 'data');
const LESSONS_DIR = path.join(DATA_DIR, 'lessons');
const DB_PATH = path.join(DATA_DIR, 'db.json');
const CSV_PATH = path.join(DATA_DIR, 'raw.csv');

// ============================================================
// HELPERS
// ============================================================
function getPhaseForDay(dayNum) {
  for (const phase of PHASES) {
    if (dayNum >= phase.start && dayNum <= phase.end) return phase.name;
  }
  return "Unknown";
}

function escapeCSV(str) {
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// ============================================================
// LESSON CONTENT GENERATOR
// ============================================================
function generateLessonContent(dayNum, topic, phase) {
  const content = buildContent(dayNum, topic, phase);
  const codeExample = buildCodeExample(dayNum, topic, phase);
  const practiceQuestions = buildPracticeQuestions(dayNum, topic, phase);
  
  return {
    id: dayNum,
    title: topic,
    content,
    codeExample,
    practiceQuestions,
    keywords: [],
    keyTakeaways: []
  };
}

function buildContent(day, topic, phase) {
  // Phase-specific content templates
  const templates = {
    "Coding Foundations": buildCodingFoundationsContent,
    "Data Handling & SQL": buildDataHandlingContent,
    "Machine Learning Core": buildMLCoreContent,
    "Deep Learning & Applied AI": buildDLContent,
    "Backend & AI Engineering": buildEngineeringContent,
    "Deployment & MLOps": buildDeploymentContent,
    "Portfolio Projects": buildPortfolioContent,
    "Interview & Job Launch": buildInterviewContent,
  };

  const builder = templates[phase] || buildGenericContent;
  return builder(day, topic, phase);
}

function buildCodingFoundationsContent(day, topic) {
  const intro = `### Day ${day}: ${topic}\n\nWelcome to Day ${day} of your AI/ML Engineering journey. Today's focus is on building a rock-solid programming foundation — the #1 skill product-based companies test in interviews.\n\n`;
  
  const topicLC = topic.toLowerCase();
  
  if (topicLC.includes('python install') || topicLC.includes('setup')) {
    return intro + `**Theory:**\n- **Python Interpreter:** A program that reads and executes Python code line by line. Product companies expect you to use Python 3.10+.\n- **VS Code:** The industry-standard editor for AI/ML engineers. Install the Python extension for IntelliSense, debugging, and linting.\n- **pip:** Python's package manager. You'll use it daily: \`pip install numpy pandas scikit-learn\`.\n- **Terminal Proficiency:** Get comfortable with the command line early — it's essential for Git, Docker, and deployment later.\n\n**Setup Steps:**\n1. Download Python from python.org (version 3.10+).\n2. Install VS Code from code.visualstudio.com.\n3. Install the Python extension in VS Code.\n4. Create a file called \`app.py\` and write your first program.\n5. Run it: \`python app.py\`\n\n**Product Company Mindset:** Clean environment setup is the foundation. Companies expect you to manage virtual environments, dependencies, and project structure from day one.`;
  }
  
  if (topicLC.includes('dsa') || topicLC.includes('leetcode') || topicLC.includes('sorting') || topicLC.includes('binary search') || topicLC.includes('linked list') || topicLC.includes('recursion') || topicLC.includes('stack') || topicLC.includes('queue') || topicLC.includes('hash map') || topicLC.includes('two-pointer')) {
    return intro + `**Theory:**\n- **Why DSA matters for AI/ML engineers:** Product companies like Google, Amazon, and Microsoft test DSA in coding rounds. Even for ML roles, you must pass the coding interview.\n- **Problem-Solving Pattern:** Read the problem → Identify the data structure → Choose the algorithm → Code the solution → Test edge cases.\n- **Time Complexity:** Always analyze your solution's Big-O complexity. O(n) beats O(n²) in interviews.\n\n**Today's Focus: ${topic}**\n- Understand the core concept and when to apply it.\n- Practice 2-3 LeetCode Easy problems using this pattern.\n- Write clean, readable code with meaningful variable names.\n\n**Interview Tip:** When solving coding problems, always talk through your approach before coding. Explain the time and space complexity of your solution.`;
  }
  
  if (topicLC.includes('oop') || topicLC.includes('class')) {
    return intro + `**Theory:**\n- **Object-Oriented Programming** is how real-world software is structured. ML frameworks like scikit-learn and PyTorch use OOP heavily.\n- **Why OOP matters:** In product companies, you'll work with codebases built using classes, inheritance, and design patterns — not just scripts.\n- **Clean Code:** Encapsulate related logic into classes. Use meaningful names. Follow the Single Responsibility Principle.\n\n**Today's Focus: ${topic}**\n- Understand how classes organize data and behavior together.\n- Practice creating classes that model real-world entities.\n- Learn when to use inheritance vs composition.\n\n**Interview Tip:** Be ready to design a class hierarchy in whiteboard interviews. Common questions: design a parking lot, a library system, or an ML experiment tracker.`;
  }
  
  if (topicLC.includes('git') || topicLC.includes('github')) {
    return intro + `**Theory:**\n- **Git** is not optional — it's the #1 collaboration tool in every tech company. Product companies check your GitHub profile.\n- **Why learn it early:** Every project you build from now on should be version-controlled. Build the habit now.\n- **Professional Git:** Use meaningful commit messages, branch for features, and keep your main branch clean.\n\n**Today's Focus: ${topic}**\n- Master the daily Git workflow: add → commit → push.\n- Understand why every company uses pull requests for code review.\n- Start building your GitHub portfolio from today.\n\n**Interview Tip:** Hiring managers look at your GitHub. A clean profile with pinned projects, good READMEs, and consistent commit history shows professionalism.`;
  }
  
  if (topicLC.includes('debug') || topicLC.includes('clean code') || topicLC.includes('pep')) {
    return intro + `**Theory:**\n- **Debugging is an engineering skill**, not just fixing errors. Product companies expect you to systematically isolate and fix bugs.\n- **Clean Code:** Code is read 10x more than it's written. Follow PEP 8, use type hints, write docstrings, and name variables descriptively.\n- **Professional Standards:** In companies, your code goes through code review. Write code that your teammates can understand without asking you.\n\n**Today's Focus: ${topic}**\n- Learn systematic debugging techniques.\n- Practice reading error tracebacks and fixing issues methodically.\n- Write code that passes code review standards.\n\n**Interview Tip:** During coding interviews, if your code has a bug, stay calm, read the error, and debug systematically. Panicking is the worst thing you can do.`;
  }
  
  // Generic coding foundations content
  return intro + `**Theory:**\n- **Core Concept:** ${topic} is a fundamental building block in Python programming that every AI/ML engineer must master.\n- **Product Company Relevance:** Writing clean, efficient Python code is tested in every technical interview. Companies don't just test ML knowledge — they test your ability to code.\n- **Best Practice:** Always write code that is readable, testable, and well-documented.\n\n**Today's Focus: ${topic}**\n- Understand the concept deeply — don't just memorize syntax.\n- Write multiple small programs that demonstrate the concept.\n- Think about edge cases and error handling.\n\n**Daily Challenge:** After learning today's topic, solve 1-2 related coding problems to reinforce the concepts. Clean code style is mandatory.`;
}

function buildDataHandlingContent(day, topic) {
  const intro = `### Day ${day}: ${topic}\n\nDay ${day} focuses on data handling — the skill that separates real data engineers from tutorial watchers. In product companies, 80% of your time is spent cleaning and understanding data.\n\n`;
  
  const topicLC = topic.toLowerCase();
  
  if (topicLC.includes('sql')) {
    return intro + `**Theory:**\n- **SQL is non-negotiable** for any data role. Every product company tests SQL in interviews — often as a separate round.\n- **Think in Sets:** SQL operates on sets of data, not individual rows. This mindset shift is critical for writing efficient queries.\n- **Real-World Application:** From analytics dashboards to feature engineering pipelines, SQL powers data access everywhere.\n\n**Today's Focus: ${topic}**\n- Write queries that solve real business problems, not toy examples.\n- Optimize for readability — use CTEs and meaningful aliases.\n- Practice on real datasets, not just textbook examples.\n\n**Interview Tip:** SQL interviews often give you a schema diagram and ask you to write 3-5 queries of increasing difficulty. Practice writing queries without an IDE — on paper or whiteboard.`;
  }
  
  if (topicLC.includes('pandas')) {
    return intro + `**Theory:**\n- **Pandas** is the workhorse of data manipulation in Python. Every data science and ML role requires Pandas proficiency.\n- **Vectorized Operations:** Never loop over DataFrame rows. Use vectorized operations and built-in methods — this is what companies look for.\n- **Data Pipeline Thinking:** Think of each operation as a step in a pipeline: load → inspect → clean → transform → analyze.\n\n**Today's Focus: ${topic}**\n- Master this Pandas operation with real-world datasets.\n- Understand when to use this technique vs alternatives.\n- Write clean, chainable Pandas code.\n\n**Interview Tip:** Pandas interviews often involve a messy dataset and 5-10 data manipulation tasks. Speed and accuracy both matter. Practice timing yourself.`;
  }
  
  if (topicLC.includes('numpy')) {
    return intro + `**Theory:**\n- **NumPy** is the foundation of all numerical computing in Python. Every ML library (scikit-learn, TensorFlow, PyTorch) is built on NumPy.\n- **Performance:** NumPy operations are 10-100x faster than Python loops because they're implemented in C.\n- **Array Thinking:** Shift from thinking about individual numbers to thinking about arrays and matrices.\n\n**Today's Focus: ${topic}**\n- Understand how NumPy arrays differ from Python lists.\n- Practice array operations without falling back to Python loops.\n- Build intuition for shapes, dimensions, and broadcasting.\n\n**Interview Tip:** NumPy knowledge is assumed in ML interviews. Be comfortable with array manipulation, matrix operations, and broadcasting rules.`;
  }
  
  if (topicLC.includes('eda') || topicLC.includes('insight') || topicLC.includes('business case')) {
    return intro + `**Theory:**\n- **Exploratory Data Analysis (EDA)** is how real data scientists understand a problem before modeling. Companies value insight generation over fancy models.\n- **Business Thinking:** Every chart and metric should answer a business question. \"What happened? Why? What should we do?\"\n- **Communication:** Writing clear insights from data is a top skill that separates junior from senior data professionals.\n\n**Today's Focus: ${topic}**\n- Load a real-world dataset and perform thorough EDA.\n- Generate at least 5 actionable business insights from the data.\n- Create visualizations that tell a clear story.\n\n**Interview Tip:** In data science interviews at product companies, you may be given a dataset and asked to present insights in 30 minutes. Practice this exact scenario.`;
  }
  
  return intro + `**Theory:**\n- **Data Handling** is the most time-consuming part of any ML project. Getting good at it makes you 10x more productive.\n- **Attention to Detail:** Missing values, wrong data types, and duplicates can destroy your model's performance. Always audit your data first.\n\n**Today's Focus: ${topic}**\n- Master this data handling technique with practical examples.\n- Understand common pitfalls and how to avoid them.\n- Practice on messy, real-world datasets — not clean textbook data.\n\n**Daily Challenge:** Apply today's technique to a real dataset from Kaggle. Document your findings in a Jupyter notebook.`;
}

function buildMLCoreContent(day, topic) {
  const intro = `### Day ${day}: ${topic}\n\nDay ${day} dives into core Machine Learning — the heart of what AI/ML engineers do. Product companies want engineers who understand the math AND can ship working models.\n\n`;
  
  const topicLC = topic.toLowerCase();
  
  if (topicLC.includes('stat') || topicLC.includes('probability') || topicLC.includes('hypothesis')) {
    return intro + `**Theory:**\n- **Statistics** is the language of data. Without it, you can't interpret model results, design experiments, or make data-driven decisions.\n- **Product Company Relevance:** A/B testing, significance testing, and confidence intervals are used daily at companies like Google, Meta, and Netflix.\n- **Applied Focus:** Don't memorize formulas — understand what they mean and when to use them.\n\n**Today's Focus: ${topic}**\n- Understand the intuition behind the concept, not just the formula.\n- Apply it to a real dataset using Python (scipy, statsmodels).\n- Connect it to practical ML applications.\n\n**Interview Tip:** Statistics questions are common in data science interviews. Be ready to explain concepts like p-value, confidence interval, and A/B testing without formulas.`;
  }
  
  if (topicLC.includes('regression')) {
    return intro + `**Theory:**\n- **Regression** predicts continuous values — prices, revenue, ratings. It's often the first model companies deploy because it's interpretable and fast.\n- **Production Mindset:** A simple regression model that works reliably is better than a complex model that breaks. Start simple, iterate.\n- **Evaluation Matters:** Use the right metric for the right problem. MAE, MSE, RMSE, and R² each tell different stories.\n\n**Today's Focus: ${topic}**\n- Implement the model using scikit-learn on a real dataset.\n- Evaluate properly using train-test split and cross-validation.\n- Interpret the results — what do the coefficients mean?\n\n**Interview Tip:** Regression interviews often test your understanding of assumptions (linearity, independence, normality of residuals). Know what happens when assumptions are violated.`;
  }
  
  if (topicLC.includes('classification') || topicLC.includes('logistic') || topicLC.includes('knn') || topicLC.includes('naive bayes') || topicLC.includes('svm')) {
    return intro + `**Theory:**\n- **Classification** predicts categories — spam/not spam, fraud/not fraud, churn/retain. It's the most common ML task in production.\n- **Threshold Matters:** The default 0.5 threshold is rarely optimal. In fraud detection, you might use 0.3. In medical diagnosis, 0.1. Business context decides.\n- **Class Imbalance:** Real-world data is almost always imbalanced. Learn to handle it with SMOTE, class weights, and proper evaluation metrics.\n\n**Today's Focus: ${topic}**\n- Implement the classifier using scikit-learn.\n- Evaluate with precision, recall, F1, and ROC-AUC — not just accuracy.\n- Think about which metric matters most for the business problem.\n\n**Interview Tip:** Classification questions often test precision vs recall tradeoff. Always ask: \"What's more costly — a false positive or false negative?\"`;
  }
  
  if (topicLC.includes('evaluation') || topicLC.includes('confusion') || topicLC.includes('precision') || topicLC.includes('f1') || topicLC.includes('roc') || topicLC.includes('cross-validation') || topicLC.includes('bias-variance')) {
    return intro + `**Theory:**\n- **Model Evaluation** is where junior and senior engineers diverge. Anyone can train a model — evaluating it properly is the real skill.\n- **No Single Metric:** Different problems need different metrics. Accuracy is misleading on imbalanced datasets.\n- **Validation Strategy:** How you split your data can make or break your results. Always use cross-validation for reliable estimates.\n\n**Today's Focus: ${topic}**\n- Understand when and why to use this evaluation technique.\n- Implement it in scikit-learn with a real dataset.\n- Interpret the results and explain what they mean for the model.\n\n**Interview Tip:** Expect to be asked: \"Your model has 95% accuracy but performs poorly. Why?\" The answer involves class imbalance, overfitting, or data leakage.`;
  }
  
  if (topicLC.includes('tree') || topicLC.includes('forest') || topicLC.includes('ensemble') || topicLC.includes('boost') || topicLC.includes('xgboost') || topicLC.includes('lightgbm') || topicLC.includes('catboost')) {
    return intro + `**Theory:**\n- **Tree-based models** dominate tabular data in production. XGBoost and LightGBM win most Kaggle competitions and power most enterprise ML systems.\n- **Interpretability:** Feature importance from tree models helps explain predictions to stakeholders — crucial in product companies.\n- **Tuning Matters:** The difference between a good and great tree model is often just hyperparameter tuning.\n\n**Today's Focus: ${topic}**\n- Implement the model and understand how it makes decisions.\n- Extract and interpret feature importance.\n- Compare performance against simpler models.\n\n**Interview Tip:** Be ready to explain bagging vs boosting, how random forest prevents overfitting, and when to use XGBoost vs LightGBM.`;
  }
  
  if (topicLC.includes('pipeline') || topicLC.includes('feature engineering') || topicLC.includes('capstone') || topicLC.includes('mini-project') || topicLC.includes('review')) {
    return intro + `**Theory:**\n- **End-to-End Thinking:** Product companies don't want people who can only call \`model.fit()\`. They want engineers who own the entire pipeline: data → features → model → evaluation → deployment.\n- **Reproducibility:** Use scikit-learn Pipelines to make your ML code reproducible, testable, and deployable.\n- **Documentation:** Write your experiments like a technical report — what you tried, why, and what worked.\n\n**Today's Focus: ${topic}**\n- Build or review a complete ML workflow from start to finish.\n- Think about every step: data cleaning, feature engineering, model selection, evaluation, and saving.\n- Practice explaining your approach clearly — this is what interviews test.\n\n**Interview Tip:** In ML system design interviews, you'll be asked to design an entire ML pipeline for a business problem. Practice thinking through data sources, features, models, metrics, and deployment strategy.`;
  }
  
  return intro + `**Theory:**\n- **Machine Learning** is about finding patterns in data to make predictions. The goal is always a model that generalizes well to unseen data.\n- **Product Focus:** In companies, ML is a tool to solve business problems — not an end in itself. Always start with the business question.\n\n**Today's Focus: ${topic}**\n- Understand the concept with intuition, not just code.\n- Implement it using scikit-learn with a real dataset.\n- Evaluate the results and think about how to improve them.\n\n**Daily Challenge:** After learning today's concept, apply it to a Kaggle dataset and document your results.`;
}

function buildDLContent(day, topic) {
  const intro = `### Day ${day}: ${topic}\n\nDay ${day} covers Deep Learning and Applied AI. Product companies use DL for vision, NLP, and recommendation systems. The key is knowing WHEN to use DL and how to deploy it.\n\n`;
  
  const topicLC = topic.toLowerCase();
  
  if (topicLC.includes('cnn') || topicLC.includes('image') || topicLC.includes('pixel') || topicLC.includes('transfer')) {
    return intro + `**Theory:**\n- **Convolutional Neural Networks (CNNs)** are the backbone of computer vision. They power image classification, object detection, and image segmentation.\n- **Transfer Learning:** In production, you almost never train from scratch. Pretrained models like ResNet, VGG16, and EfficientNet are fine-tuned on your data.\n- **Product Applications:** Medical imaging, autonomous driving, product photo classification, document OCR — CNNs are everywhere.\n\n**Today's Focus: ${topic}**\n- Understand the architecture and how convolutions extract features.\n- Implement using TensorFlow/Keras or PyTorch.\n- Think about practical deployment considerations (model size, inference time).\n\n**Interview Tip:** Be able to explain how a CNN works from pixels to prediction. Draw the architecture on a whiteboard and explain each layer's purpose.`;
  }
  
  if (topicLC.includes('nlp') || topicLC.includes('text') || topicLC.includes('sentiment') || topicLC.includes('tokeniz') || topicLC.includes('tf-idf') || topicLC.includes('embedding') || topicLC.includes('hugging')) {
    return intro + `**Theory:**\n- **Natural Language Processing (NLP)** enables machines to understand text. Chatbots, search engines, content moderation — all NLP-powered.\n- **Modern NLP:** The field has shifted from bag-of-words to transformers. Understanding both traditional and modern approaches is valuable.\n- **Pretrained Models:** HuggingFace has made state-of-the-art NLP accessible. Learn to use pretrained models effectively before building from scratch.\n\n**Today's Focus: ${topic}**\n- Understand the NLP pipeline: text → preprocess → vectorize → model → output.\n- Implement the technique using Python libraries.\n- Think about real-world applications and limitations.\n\n**Interview Tip:** Common NLP interview questions: \"How would you build a spam classifier? A sentiment analyzer? A chatbot?\" Practice explaining the end-to-end pipeline.`;
  }
  
  return intro + `**Theory:**\n- **Deep Learning** represents a powerful set of techniques for pattern recognition. But it's not always the right tool — simpler models often outperform DL on tabular data.\n- **Engineering Focus:** Understanding when to use DL, how to train efficiently, and how to deploy models is what separates ML engineers from ML learners.\n\n**Today's Focus: ${topic}**\n- Understand the concept deeply — draw diagrams if needed.\n- Implement using TensorFlow/Keras with clean, documented code.\n- Think about practical considerations: training time, data requirements, and inference speed.\n\n**Daily Challenge:** After learning today's concept, experiment with different hyperparameters and observe the effect on model performance.`;
}

function buildEngineeringContent(day, topic) {
  const intro = `### Day ${day}: ${topic}\n\nDay ${day} focuses on backend engineering and AI systems. This is where you transition from \"ML learner\" to \"ML engineer\" — the role product companies actually hire for.\n\n`;
  
  const topicLC = topic.toLowerCase();
  
  if (topicLC.includes('fastapi') || topicLC.includes('endpoint') || topicLC.includes('api') || topicLC.includes('predict')) {
    return intro + `**Theory:**\n- **APIs are how ML models reach users.** No company deploys a Jupyter notebook to production. Every model needs an API.\n- **FastAPI** is the modern Python web framework for ML — it's fast, type-safe, and auto-generates documentation.\n- **Production Patterns:** Input validation, error handling, logging, and structured responses are non-negotiable in production APIs.\n\n**Today's Focus: ${topic}**\n- Build production-quality API endpoints, not toy examples.\n- Handle edge cases: invalid inputs, model errors, missing fields.\n- Think about response format, status codes, and error messages.\n\n**Interview Tip:** In system design interviews, you'll be asked: \"How would you serve this ML model in production?\" The answer involves API design, containerization, load balancing, and monitoring.`;
  }
  
  if (topicLC.includes('docker') || topicLC.includes('container') || topicLC.includes('dockerfile')) {
    return intro + `**Theory:**\n- **Docker** ensures your app runs identically on your laptop, your CI server, and production. \"Works on my machine\" is not a valid excuse.\n- **Container Thinking:** Package your code, dependencies, and configuration into a single deployable unit.\n- **ML-Specific:** ML Docker images need careful dependency management (Python version, CUDA, library versions).\n\n**Today's Focus: ${topic}**\n- Build Docker images that are optimized for ML applications.\n- Understand multi-stage builds, caching, and image size optimization.\n- Practice the full workflow: Dockerfile → build → run → test.\n\n**Interview Tip:** Docker knowledge is expected for ML engineering roles. Be ready to write a Dockerfile from memory and explain the build process.`;
  }
  
  if (topicLC.includes('test') || topicLC.includes('pytest') || topicLC.includes('mock')) {
    return intro + `**Theory:**\n- **Testing** is the difference between amateur and professional code. Product companies have mandatory code review and testing requirements.\n- **ML Testing Challenge:** Testing ML systems is harder than regular software. You need to test data pipelines, model behavior, and API contracts.\n- **Test Pyramid:** Unit tests → Integration tests → End-to-end tests. Most of your tests should be fast unit tests.\n\n**Today's Focus: ${topic}**\n- Write tests that actually catch bugs, not just check happy paths.\n- Mock external dependencies (databases, APIs, model files).\n- Set up a testing workflow you can reuse in every project.\n\n**Interview Tip:** Companies value engineers who write tests. Mention your testing approach when discussing projects in interviews.`;
  }
  
  return intro + `**Theory:**\n- **AI Engineering** combines ML knowledge with software engineering best practices. Companies hire engineers who can build, test, and deploy — not just prototype.\n- **Quality Standards:** Production code has error handling, logging, tests, documentation, and monitoring. Practice these in every project.\n\n**Today's Focus: ${topic}**\n- Build with production standards in mind.\n- Write clean, documented, tested code.\n- Think about how this fits into a larger system.\n\n**Daily Challenge:** Apply today's engineering practice to one of your existing ML projects. Refactor it to production standards.`;
}

function buildDeploymentContent(day, topic) {
  const intro = `### Day ${day}: ${topic}\n\nDay ${day} covers deployment and MLOps — the skills that get models from Jupyter notebooks into the real world. Companies value engineers who can ship.\n\n`;
  
  return intro + `**Theory:**\n- **Deployment** is the final mile of ML engineering. A model that can't be deployed provides zero business value.\n- **MLOps** is DevOps for ML — it's about making ML systems reliable, reproducible, and maintainable in production.\n- **Monitoring:** A deployed model is a living system. It needs monitoring, alerting, and retraining strategies.\n\n**Today's Focus: ${topic}**\n- Learn the practical, hands-on aspects of deployment and MLOps.\n- Build skills that directly translate to real engineering roles.\n- Think about reliability, scalability, and maintenance.\n\n**Interview Tip:** MLOps knowledge is increasingly tested in AI/ML interviews. Be ready to discuss model versioning, experiment tracking, CI/CD for ML, and monitoring strategies.`;
}

function buildPortfolioContent(day, topic) {
  const intro = `### Day ${day}: ${topic}\n\nDay ${day} is project building time. These portfolio projects are designed to impress product company hiring managers — each one demonstrates a complete ML engineering workflow.\n\n`;
  
  const topicLC = topic.toLowerCase();
  
  if (topicLC.includes('churn')) {
    return intro + `**Project 1: Customer Churn Prediction System**\n\n**Business Context:** Telecom/SaaS companies lose millions to customer churn. A predictive system that identifies at-risk customers enables proactive retention — saving 5-25% of at-risk revenue.\n\n**Today's Focus: ${topic}**\n- Follow the end-to-end ML engineering workflow.\n- Focus on clean code, proper evaluation, and deployability.\n- Document everything for your portfolio.\n\n**Resume Bullet Template:** \"Built a customer churn prediction system using [model] achieving [metric]% [score], deployed as a FastAPI microservice with Streamlit dashboard, reducing predicted churn by X%.\"\n\n**GitHub Structure:**\n\`\`\`\nchurn-prediction/\n├── data/\n├── notebooks/\n├── src/\n│   ├── data_processing.py\n│   ├── model.py\n│   ├── api.py\n│   └── app.py\n├── tests/\n├── Dockerfile\n├── requirements.txt\n└── README.md\n\`\`\``;
  }
  
  if (topicLC.includes('resume screening') || topicLC.includes('resume screen')) {
    return intro + `**Project 2: Resume Screening / Job Matching NLP App**\n\n**Business Context:** HR teams review thousands of resumes manually. An NLP-based screening system ranks candidates by relevance to job descriptions — saving hours of manual work.\n\n**Today's Focus: ${topic}**\n- Apply NLP techniques to a real recruitment use case.\n- Build a system that's practical and demonstrable.\n- Create a recruiter-friendly UI.\n\n**Resume Bullet Template:** \"Developed an NLP-powered resume screening system using TF-IDF/embeddings for job-candidate matching, with FastAPI backend and interactive demo, processing X resumes per second.\"\n\n**GitHub Structure:**\n\`\`\`\nresume-screener/\n├── data/\n├── notebooks/\n├── src/\n│   ├── preprocessing.py\n│   ├── matching.py\n│   ├── api.py\n│   └── ui.py\n├── tests/\n├── Dockerfile\n├── requirements.txt\n└── README.md\n\`\`\``;
  }
  
  if (topicLC.includes('sales forecast') || topicLC.includes('forecasting')) {
    return intro + `**Project 3: Sales / Demand Forecasting Dashboard**\n\n**Business Context:** Retail and e-commerce companies need accurate demand forecasts for inventory planning, staffing, and marketing budgets. Poor forecasts mean lost sales or wasted inventory.\n\n**Today's Focus: ${topic}**\n- Work with time-series data and forecasting models.\n- Build a business-focused dashboard with actionable insights.\n- Deploy with clear documentation.\n\n**Resume Bullet Template:** \"Built a sales forecasting dashboard using [model] with X% MAPE, deployed on [platform] with interactive Streamlit visualizations, enabling data-driven inventory decisions.\"\n\n**GitHub Structure:**\n\`\`\`\nsales-forecasting/\n├── data/\n├── notebooks/\n├── src/\n│   ├── feature_engineering.py\n│   ├── model.py\n│   ├── dashboard.py\n│   └── api.py\n├── tests/\n├── Dockerfile\n├── requirements.txt\n└── README.md\n\`\`\``;
  }
  
  if (topicLC.includes('github profile') || topicLC.includes('resume bullet')) {
    return intro + `**Portfolio Polish Day**\n\n**Today's Focus: ${topic}**\n- Clean up your GitHub profile with a professional README.\n- Pin your 3 best projects with clear descriptions.\n- Write impactful resume bullets using the XYZ formula:\n  \"Accomplished [X] by doing [Y] which resulted in [Z]\"\n\n**GitHub Profile Checklist:**\n- [ ] Professional profile photo\n- [ ] Bio with your target role\n- [ ] Profile README with skills and project links\n- [ ] 3-6 pinned repositories with excellent READMEs\n- [ ] Consistent commit history (green squares)\n- [ ] Each project has: description, tech stack, demo link, and setup instructions`;
  }
  
  return intro + `**Today's Focus: ${topic}**\n- Build with production quality and portfolio presentation in mind.\n- Each project step should result in a commit with a clear message.\n- Document your decisions: what you tried, what worked, and why.\n\n**Portfolio Tip:** Product companies evaluate projects based on:\n1. Was the problem well-defined and relevant?\n2. Is the code clean, tested, and documented?\n3. Can they run it themselves?\n4. Does the README clearly explain the project?`;
}

function buildInterviewContent(day, topic) {
  const intro = `### Day ${day}: ${topic}\n\nDay ${day} is dedicated to converting your learning into job offers. The final phase focuses on interview preparation and professional presentation.\n\n`;
  
  return intro + `**Today's Focus: ${topic}**\n- Practice with real interview questions and scenarios.\n- Time yourself — interviews have time pressure.\n- Explain your answers out loud, as if talking to an interviewer.\n\n**Interview Success Formula:**\n1. **Technical Skills:** Python, SQL, ML, DL, API, Docker — you've built these.\n2. **Problem Solving:** DSA and system design — show your thought process.\n3. **Projects:** Walk through your portfolio projects end-to-end.\n4. **Communication:** Explain complex concepts simply and confidently.\n5. **Culture Fit:** Show curiosity, collaboration, and ownership.\n\n**Common Interview Structure at Product Companies:**\n- Round 1: Online coding test (DSA + SQL)\n- Round 2: Technical ML interview (theory + coding)\n- Round 3: System design / ML design\n- Round 4: Hiring manager / HR round`;
}

function buildGenericContent(day, topic, phase) {
  return `### Day ${day}: ${topic}\n\nWelcome to Day ${day} of the Mastery Tracker. Today's focus is on **${phase}** concepts.\n\n**Theory:**\n- **Core Concept:** ${topic} is an essential skill in modern AI/ML engineering.\n- **Product Company Relevance:** This skill is directly tested in interviews and used daily in engineering roles.\n- **Best Practice:** Focus on practical application over pure theory.\n\n**Today's Focus: ${topic}**\n- Learn the concept with hands-on practice.\n- Build something small that demonstrates your understanding.\n- Connect it to your portfolio projects.`;
}

// ============================================================
// CODE EXAMPLE GENERATOR
// ============================================================
function buildCodeExample(day, topic, phase) {
  const topicLC = topic.toLowerCase();
  
  // Phase 1 examples
  if (phase === "Coding Foundations") {
    if (topicLC.includes('setup') || topicLC.includes('hello world')) return `# 💡 Day ${day}: Hello World + Environment Check\nimport sys\nimport platform\n\nprint("Hello World!")\nprint(f"Python Version: {sys.version}")\nprint(f"Platform: {platform.system()}")\n\n# Verify packages are installed\ntry:\n    import numpy as np\n    print(f"NumPy: {np.__version__} ✅")\nexcept ImportError:\n    print("NumPy: Not installed ❌ → pip install numpy")`;
    if (topicLC.includes('variable')) return `# 💡 Day ${day}: Variables and Data Types\nname = "Ruban"      # str\nage = 25            # int\nheight = 5.9        # float\nis_student = True   # bool\n\nprint(f"Name: {name}, Type: {type(name).__name__}")\nprint(f"Age: {age}, Type: {type(age).__name__}")\nprint(f"Height: {height}, Type: {type(height).__name__}")\nprint(f"Student: {is_student}, Type: {type(is_student).__name__}")\n\n# Type conversion\nage_str = str(age)\nprint(f"Age as string: '{age_str}'")`;
    if (topicLC.includes('list')) return `# 💡 Day ${day}: Lists — The Most Used Data Structure\nfruits = ["apple", "banana", "cherry", "date"]\n\n# Indexing and Slicing\nprint(fruits[0])      # apple\nprint(fruits[-1])     # date\nprint(fruits[1:3])    # ['banana', 'cherry']\n\n# Common methods\nfruits.append("elderberry")\nfruits.insert(1, "avocado")\nfruits.remove("banana")\nprint(fruits)\n\n# List comprehension (preview)\nsquares = [x**2 for x in range(1, 6)]\nprint(f"Squares: {squares}")`;
    if (topicLC.includes('dsa') || topicLC.includes('two-pointer')) return `# 💡 Day ${day}: DSA — Two Pointer Technique\n# Problem: Find two numbers that sum to target\n\ndef two_sum_sorted(nums, target):\n    """Two pointer approach — O(n) time, O(1) space"""\n    left, right = 0, len(nums) - 1\n    while left < right:\n        current = nums[left] + nums[right]\n        if current == target:\n            return [left, right]\n        elif current < target:\n            left += 1\n        else:\n            right -= 1\n    return [-1, -1]\n\n# Test\nnums = [1, 2, 4, 6, 8, 11, 15]\ntarget = 10\nresult = two_sum_sorted(nums, target)\nprint(f"Indices: {result}")  # [1, 4] → 2+8=10`;
    if (topicLC.includes('oop') || topicLC.includes('class')) return `# 💡 Day ${day}: OOP — Building Real Classes\nclass MLExperiment:\n    """Track ML experiment runs — a real-world OOP example"""\n    \n    experiment_count = 0  # Class attribute\n    \n    def __init__(self, name, model_type):\n        self.name = name\n        self.model_type = model_type\n        self.metrics = {}\n        MLExperiment.experiment_count += 1\n    \n    def log_metric(self, name, value):\n        self.metrics[name] = round(value, 4)\n    \n    def summary(self):\n        print(f"Experiment: {self.name}")\n        print(f"Model: {self.model_type}")\n        for k, v in self.metrics.items():\n            print(f"  {k}: {v}")\n\n# Usage\nexp = MLExperiment("churn_v1", "RandomForest")\nexp.log_metric("accuracy", 0.8723)\nexp.log_metric("f1_score", 0.8451)\nexp.summary()`;
    if (topicLC.includes('git')) return `# 💡 Day ${day}: Git Commands You'll Use Daily\n# These are terminal commands, not Python code\n\n# Initialize a new repository\n# git init\n\n# Check status\n# git status\n\n# Stage files\n# git add .                    # Stage everything\n# git add src/model.py         # Stage specific file\n\n# Commit with a meaningful message\n# git commit -m "Add churn prediction model with 87% F1"\n\n# Push to GitHub\n# git remote add origin https://github.com/you/project.git\n# git push -u origin main\n\n# .gitignore essentials for ML projects\ngitignore_content = """\n# Python\n__pycache__/\n*.pyc\n.env\nvenv/\n\n# Data (track with DVC instead)\n*.csv\n*.pkl\ndata/raw/\n\n# Notebooks checkpoints\n.ipynb_checkpoints/\n"""\nprint(gitignore_content)`;
    if (topicLC.includes('capstone') || topicLC.includes('task manager')) return `# 💡 Day ${day}: CLI Task Manager — Capstone Project\nimport json\nimport os\n\nTASKS_FILE = "tasks.json"\n\ndef load_tasks():\n    if os.path.exists(TASKS_FILE):\n        with open(TASKS_FILE, 'r') as f:\n            return json.load(f)\n    return []\n\ndef save_tasks(tasks):\n    with open(TASKS_FILE, 'w') as f:\n        json.dump(tasks, f, indent=2)\n\ndef add_task(title):\n    tasks = load_tasks()\n    tasks.append({"title": title, "done": False})\n    save_tasks(tasks)\n    print(f"✅ Added: {title}")\n\ndef list_tasks():\n    tasks = load_tasks()\n    for i, t in enumerate(tasks, 1):\n        status = "✅" if t["done"] else "⬜"\n        print(f"{i}. {status} {t['title']}")\n\n# Example usage\nadd_task("Build ML pipeline")\nadd_task("Write API tests")\nlist_tasks()`;
  }
  
  // Phase 2 examples
  if (phase === "Data Handling & SQL") {
    if (topicLC.includes('numpy')) return `# 💡 Day ${day}: NumPy — ${topic}\nimport numpy as np\n\n# Create arrays\narr1d = np.array([1, 2, 3, 4, 5])\narr2d = np.array([[1, 2, 3], [4, 5, 6]])\n\n# Basic operations (vectorized — no loops needed)\nprint(f"Mean: {arr1d.mean()}")\nprint(f"Std:  {arr1d.std():.2f}")\nprint(f"Shape: {arr2d.shape}")\n\n# Broadcasting: add scalar to array\nresult = arr2d * 2 + 1\nprint(f"Transformed:\\n{result}")\n\n# Random data generation\nsynthetic_data = np.random.normal(loc=50, scale=10, size=1000)\nprint(f"Synthetic mean: {synthetic_data.mean():.1f}")\nprint(f"Synthetic std:  {synthetic_data.std():.1f}")`;
    if (topicLC.includes('sql')) return `# 💡 Day ${day}: SQL — ${topic}\n# Practice these queries in PostgreSQL/MySQL\n\n# -- Example: E-commerce Database Queries --\n\nsql_examples = """\n-- Find top 5 customers by total spend\nSELECT customer_id, SUM(amount) as total_spend\nFROM orders\nGROUP BY customer_id\nORDER BY total_spend DESC\nLIMIT 5;\n\n-- Monthly revenue with window function\nSELECT \n  DATE_TRUNC('month', order_date) as month,\n  SUM(amount) as revenue,\n  LAG(SUM(amount)) OVER (ORDER BY DATE_TRUNC('month', order_date)) as prev_month\nFROM orders\nGROUP BY month\nORDER BY month;\n"""\nprint(sql_examples)`;
    if (topicLC.includes('pandas')) return `# 💡 Day ${day}: Pandas — ${topic}\nimport pandas as pd\nimport numpy as np\n\n# Create sample business data\ndf = pd.DataFrame({\n    'customer_id': range(1, 101),\n    'name': [f'Customer_{i}' for i in range(1, 101)],\n    'revenue': np.random.uniform(100, 5000, 100).round(2),\n    'region': np.random.choice(['North', 'South', 'East', 'West'], 100),\n    'signup_date': pd.date_range('2024-01-01', periods=100, freq='D')\n})\n\n# Quick audit\nprint(df.info())\nprint(df.describe())\n\n# Business analysis\nregion_stats = df.groupby('region')['revenue'].agg(['mean', 'sum', 'count'])\nprint(f"\\nRevenue by Region:\\n{region_stats}")`;
    if (topicLC.includes('eda') || topicLC.includes('business case') || topicLC.includes('insight') || topicLC.includes('capstone')) return "# \u{1F4A1} Day " + day + ": EDA \u2014 " + topic + "\\nimport pandas as pd\\nimport numpy as np\\n\\n# Simulating a real business dataset analysis\\nnp.random.seed(42)\\nn = 500\\n\\ndf = pd.DataFrame({\\n    'order_id': range(1, n+1),\\n    'amount': np.random.lognormal(4, 1, n).round(2),\\n    'category': np.random.choice(['Electronics', 'Clothing', 'Food', 'Books'], n),\\n    'is_returned': np.random.choice([0, 1], n, p=[0.85, 0.15]),\\n    'customer_age': np.random.normal(35, 10, n).astype(int)\\n})\\n\\n# Business Insights\\nprint('=== KEY INSIGHTS ===')\\ntotal_rev = df['amount'].sum()\\nprint(f'Total Revenue: ${total_rev:,.2f}')\\nprint(f'Return Rate: {df[\"is_returned\"].mean()*100:.1f}%')\\navg_order = df['amount'].mean()\\nprint(f'Avg Order Value: ${avg_order:,.2f}')\\nprint('\\\\nRevenue by Category:')\\nprint(df.groupby('category')['amount'].sum().sort_values(ascending=False))";
  }
  
  // Phase 3 examples
  if (phase === "Machine Learning Core") {
    if (topicLC.includes('regression')) return `# 💡 Day ${day}: ${topic}\nfrom sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport numpy as np\n\n# Generate sample data\nnp.random.seed(42)\nX = np.random.rand(200, 3) * 100\ny = 3*X[:, 0] + 1.5*X[:, 1] - 2*X[:, 2] + np.random.randn(200)*10\n\n# Train-test split\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Train\nmodel = LinearRegression()\nmodel.fit(X_train, y_train)\n\n# Evaluate\ny_pred = model.predict(X_test)\nprint(f"R² Score: {r2_score(y_test, y_pred):.4f}")\nprint(f"RMSE: {np.sqrt(mean_squared_error(y_test, y_pred)):.2f}")\nprint(f"\\nCoefficients: {model.coef_.round(3)}")\n\n# Cross-validation\ncv_scores = cross_val_score(model, X, y, cv=5, scoring='r2')\nprint(f"CV R² Mean: {cv_scores.mean():.4f} ± {cv_scores.std():.4f}")`;
    if (topicLC.includes('classification') || topicLC.includes('logistic')) return `# 💡 Day ${day}: ${topic}\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import classification_report, roc_auc_score\n\n# Generate imbalanced classification data\nX, y = make_classification(n_samples=1000, n_features=10, \n                           weights=[0.7, 0.3], random_state=42)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# Train with class weight balancing\nmodel = LogisticRegression(class_weight='balanced', max_iter=1000)\nmodel.fit(X_train, y_train)\n\n# Evaluate properly\ny_pred = model.predict(X_test)\ny_proba = model.predict_proba(X_test)[:, 1]\n\nprint(classification_report(y_test, y_pred))\nprint(f"ROC-AUC: {roc_auc_score(y_test, y_proba):.4f}")`;
    if (topicLC.includes('pipeline') || topicLC.includes('capstone')) return `# 💡 Day ${day}: Full ML Pipeline\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import cross_val_score\nfrom sklearn.datasets import make_classification\nimport joblib\n\n# Data\nX, y = make_classification(n_samples=1000, n_features=15, random_state=42)\n\n# Production-ready pipeline\npipeline = Pipeline([\n    ('scaler', StandardScaler()),\n    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))\n])\n\n# Cross-validation\nscores = cross_val_score(pipeline, X, y, cv=5, scoring='f1')\nprint(f"F1 Score: {scores.mean():.4f} ± {scores.std():.4f}")\n\n# Train and save\npipeline.fit(X, y)\njoblib.dump(pipeline, 'model_pipeline.pkl')\nprint("Model saved to model_pipeline.pkl")`;
    return `# 💡 Day ${day}: ${topic}\nfrom sklearn.datasets import make_classification\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, f1_score\nimport numpy as np\n\n# Generate sample data\nX, y = make_classification(n_samples=500, n_features=10, random_state=42)\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\n# Today's concept applied\nprint(f"Training samples: {len(X_train)}")\nprint(f"Testing samples: {len(X_test)}")\nprint(f"Feature shape: {X_train.shape}")\nprint(f"Class distribution: {np.bincount(y_train)}")`;
  }
  
  // Phase 5 examples  
  if (phase === "Backend & AI Engineering") {
    if (topicLC.includes('fastapi') || topicLC.includes('endpoint') || topicLC.includes('predict')) return `# 💡 Day ${day}: ${topic}\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel, Field\nimport uvicorn\n\napp = FastAPI(title="ML Prediction API")\n\nclass PredictionInput(BaseModel):\n    feature_1: float = Field(..., description="First feature")\n    feature_2: float = Field(..., description="Second feature")\n    feature_3: float = Field(..., ge=0, le=100, description="Score (0-100)")\n\nclass PredictionOutput(BaseModel):\n    prediction: int\n    confidence: float\n    model_version: str\n\n@app.post("/predict", response_model=PredictionOutput)\nasync def predict(data: PredictionInput):\n    # In production: load model and predict\n    prediction = 1 if data.feature_1 > 0.5 else 0\n    return PredictionOutput(\n        prediction=prediction,\n        confidence=0.87,\n        model_version="1.0.0"\n    )\n\n@app.get("/health")\nasync def health():\n    return {"status": "healthy"}\n\n# Run: uvicorn main:app --reload`;
    if (topicLC.includes('docker')) return `# 💡 Day ${day}: ${topic}\n# Dockerfile for ML API\n\ndockerfile_content = """\nFROM python:3.10-slim\n\nWORKDIR /app\n\n# Install dependencies first (Docker layer caching)\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Copy application code\nCOPY . .\n\n# Expose port\nEXPOSE 8000\n\n# Run the API\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]\n"""\nprint(dockerfile_content)\n\n# docker-compose.yml\ncompose_content = """\nversion: '3.8'\nservices:\n  api:\n    build: .\n    ports:\n      - "8000:8000"\n    environment:\n      - MODEL_PATH=/app/models/model.pkl\n    volumes:\n      - ./models:/app/models\n"""\nprint(compose_content)`;
  }
  
  // Default code example
  return `# 💡 Day ${day}: ${topic}\n# Phase: ${phase}\n\ndef explore_concept():\n    """Explore today's concept with practical code"""\n    print(f"Day ${day}: ${topic}")\n    print(f"Phase: ${phase}")\n    \n    # TODO: Practice implementation\n    # 1. Understand the concept\n    # 2. Write a small working example\n    # 3. Test edge cases\n    # 4. Document what you learned\n\nif __name__ == '__main__':\n    explore_concept()`;
}

// ============================================================
// PRACTICE QUESTIONS GENERATOR
// ============================================================
function buildPracticeQuestions(day, topic, phase) {
  const topicLC = topic.toLowerCase();
  
  if (phase === "Coding Foundations") {
    if (topicLC.includes('variable')) return ["What are the 4 basic data types in Python? Give an example of each.", "What happens when you add an integer and a float in Python?", "Write a program that swaps two variables without using a third variable.", "Explain the difference between mutable and immutable types in Python."];
    if (topicLC.includes('list')) return ["What is the difference between append() and extend() methods?", "How do you reverse a list in Python? Show 3 different ways.", "Write a list comprehension that filters even numbers from a list.", "What is the time complexity of accessing an element by index in a list?"];
    if (topicLC.includes('dict')) return ["How do you safely access a dictionary key that might not exist?", "What is the difference between dict.items(), dict.keys(), and dict.values()?", "Write a function that counts character frequency in a string using a dictionary.", "Can a list be used as a dictionary key? Why or why not?"];
    if (topicLC.includes('function')) return ["What is the difference between parameters and arguments?", "Explain what *args and **kwargs do with examples.", "What is a pure function and why is it preferred in clean code?", "Write a function that takes any number of arguments and returns their sum."];
    if (topicLC.includes('oop') || topicLC.includes('class')) return ["What is the difference between a class and an object (instance)?", "Explain the purpose of the __init__ method.", "When would you use inheritance vs composition?", "Write a class with at least 2 methods that models a real-world entity."];
    if (topicLC.includes('git')) return ["What is the difference between git add, git commit, and git push?", "Why should you write meaningful commit messages? Give examples.", "What should always be in a .gitignore for a Python ML project?", "Explain the purpose of branches in Git."];
    if (topicLC.includes('dsa') || topicLC.includes('sorting') || topicLC.includes('binary search') || topicLC.includes('linked list') || topicLC.includes('recursion') || topicLC.includes('stack') || topicLC.includes('hash map') || topicLC.includes('two-pointer')) return ["What is the time complexity of your solution? Can you optimize it?", "Explain the algorithm step by step before coding it.", "What are the edge cases you need to handle?", "Write a clean solution with proper variable names and comments."];
  }
  
  if (phase === "Data Handling & SQL") {
    if (topicLC.includes('sql')) return ["Write a SQL query to find the top 3 customers by total purchases.", "Explain the difference between INNER JOIN and LEFT JOIN with examples.", "When would you use a window function instead of GROUP BY?", "How would you optimize a slow SQL query? List 3 techniques."];
    if (topicLC.includes('pandas')) return ["Why is iterating over DataFrame rows considered an anti-pattern?", "Explain the difference between .loc and .iloc with examples.", "How do you handle missing values in a real dataset? List 3 strategies.", "Write Pandas code to merge two DataFrames like a SQL LEFT JOIN."];
    if (topicLC.includes('numpy')) return ["Why are NumPy operations faster than Python for-loops?", "Explain broadcasting rules with a concrete example.", "How do you generate a random dataset with a specific distribution?", "What is vectorization and why does it matter for ML?"];
  }
  
  if (phase === "Machine Learning Core") {
    if (topicLC.includes('regression')) return ["What assumptions does linear regression make? List at least 3.", "When would you use Ridge vs Lasso regularization?", "How do you interpret the R² score? What does a negative R² mean?", "Explain the difference between MSE, RMSE, and MAE as evaluation metrics."];
    if (topicLC.includes('classification')) return ["Explain the precision-recall tradeoff with a real-world example.", "When is accuracy a misleading metric?", "How does changing the classification threshold affect precision and recall?", "Write code to handle class imbalance in a fraud detection dataset."];
    if (topicLC.includes('tree') || topicLC.includes('forest') || topicLC.includes('boost')) return ["How does a decision tree decide where to split?", "Explain bagging vs boosting in simple terms.", "Why does Random Forest reduce overfitting compared to a single decision tree?", "When would you choose XGBoost over LightGBM?"];
  }
  
  if (phase === "Deep Learning & Applied AI") {
    return ["Explain the concept covered today in simple terms, as if teaching a junior developer.", "What are the practical applications of this concept in product companies?", "What are the common pitfalls or mistakes when implementing this?", "Write a complete working example demonstrating this concept."];
  }
  
  if (phase === "Backend & AI Engineering") {
    return ["How would you implement this in a production environment?", "What error handling and edge cases should you consider?", "How would you test this component? Write a pytest test case.", "How does this fit into the larger ML system architecture?"];
  }
  
  if (phase === "Deployment & MLOps") {
    return ["Why is this important for production ML systems?", "What could go wrong if you skip this step in a real deployment?", "Describe how you would set this up for a team of 5 ML engineers.", "What monitoring or alerts would you add to catch issues early?"];
  }
  
  if (phase === "Portfolio Projects") {
    return ["How would you explain this project to a hiring manager in 2 minutes?", "What was the most challenging part and how did you solve it?", "What metric did you optimize for and why?", "How would you improve this project with more time?"];
  }
  
  if (phase === "Interview & Job Launch") {
    return ["Practice answering: 'Tell me about yourself' in 90 seconds.", "Walk through your best project end-to-end: problem → approach → results.", "How would you design an ML system for this problem? Think through data, model, metrics, and deployment.", "What questions should you ask the interviewer to show genuine interest?"];
  }
  
  return ["Explain this concept in your own words.", "How is this used in real-world product companies?", "Write a practical code example demonstrating this concept.", "What are the interview-relevant aspects of this topic?"];
}

// ============================================================
// MAIN GENERATION
// ============================================================
function generate() {
  console.log("🚀 Generating upgraded 240-day roadmap...\n");
  
  // Ensure directories exist
  if (!fs.existsSync(LESSONS_DIR)) fs.mkdirSync(LESSONS_DIR, { recursive: true });
  
  const dbEntries = [];
  const csvLines = [];
  
  for (let i = 0; i < 240; i++) {
    const dayNum = i + 1;
    const topic = TOPICS[i];
    const phase = getPhaseForDay(dayNum);
    
    // DB entry
    dbEntries.push({
      id: dayNum,
      date: "",
      topic: topic,
      status: "⬜ To-Do",
      phase: phase,
      lessonId: dayNum
    });
    
    // CSV line
    csvLines.push(`${dayNum},${escapeCSV(phase)},${escapeCSV(topic)},⬜ To-Do`);
    
    // Lesson JSON
    const lesson = generateLessonContent(dayNum, topic, phase);
    const lessonPath = path.join(LESSONS_DIR, `${dayNum}.json`);
    fs.writeFileSync(lessonPath, JSON.stringify(lesson, null, 2));
  }
  
  // Write db.json
  fs.writeFileSync(DB_PATH, JSON.stringify(dbEntries, null, 2));
  console.log(`✅ Generated db.json with ${dbEntries.length} entries`);
  
  // Write raw.csv
  fs.writeFileSync(CSV_PATH, csvLines.join('\r\n') + '\r\n');
  console.log(`✅ Generated raw.csv with ${csvLines.length} rows`);
  
  console.log(`✅ Generated ${240} lesson files in data/lessons/`);
  console.log("\n🎯 Roadmap upgrade complete!");
  console.log("Next step: Run 'node enhance_lessons.js' to add keywords and takeaways");
}

generate();
