// Phase 4-8 Content Builders
// Phase 4: Deep Learning & Applied AI (131-165)
// Phase 5: Backend & AI Engineering (166-195)
// Phase 6: Deployment & MLOps (196-215)
// Phase 7: Portfolio Projects (216-235)
// Phase 8: Interview & Job Launch (236-240)

function buildPhase4(day, topic, t) {
    let theory, code, questions;

    if (t.includes('biological') || t.includes('artificial neuron')) {
        theory = `**Artificial Neuron:** Inspired by biological neurons.\n- Input × Weight + Bias → Activation Function → Output\n- Activation functions: Sigmoid (0-1), ReLU (max(0,x)), Tanh (-1 to 1)\n- Multiple neurons = layer. Multiple layers = deep network.`;
        code = `import numpy as np\n\n# Single neuron simulation\ndef sigmoid(z): return 1 / (1 + np.exp(-z))\ndef relu(z): return np.maximum(0, z)\n\n# Neuron: inputs × weights + bias\ninputs = np.array([0.5, 0.3, 0.8])\nweights = np.array([0.4, 0.7, 0.2])\nbias = 0.1\n\nz = np.dot(inputs, weights) + bias\nprint(f"z = {z:.3f}")\nprint(f"Sigmoid: {sigmoid(z):.3f}")\nprint(f"ReLU: {relu(z):.3f}")\n\n# Compare activations\nx = np.linspace(-5, 5, 11)\nprint("\\nx      | Sigmoid | ReLU")\nfor xi in x:\n    print(f"{xi:6.1f} | {sigmoid(xi):.3f}   | {relu(xi):.1f}")`;
        questions = ["How does an artificial neuron work?", "What are activation functions?", "ReLU vs Sigmoid: when to use each?", "What happens without activation functions?"];
    }
    else if (t.includes('forward propagation')) {
        theory = `**Forward Propagation:** Data flows through network layer by layer.\n1. Input → multiply by weights, add bias\n2. Apply activation function\n3. Output becomes input to next layer\n4. Final layer produces prediction`;
        code = `import numpy as np\n\ndef sigmoid(z): return 1 / (1 + np.exp(-z))\n\n# 2-layer neural network\nnp.random.seed(42)\nW1 = np.random.randn(3, 4) * 0.5  # 3 inputs → 4 hidden\nb1 = np.zeros(4)\nW2 = np.random.randn(4, 1) * 0.5  # 4 hidden → 1 output\nb2 = np.zeros(1)\n\n# Forward pass\nX = np.array([0.5, 0.3, 0.8])  # input\nz1 = X @ W1 + b1\na1 = sigmoid(z1)         # hidden layer output\nz2 = a1 @ W2 + b2\na2 = sigmoid(z2)         # final output\n\nprint(f"Input: {X}")\nprint(f"Hidden: {a1.round(3)}")\nprint(f"Output: {a2[0]:.4f}")`;
        questions = ["What is forward propagation?", "What happens at each layer?", "What does the output represent?", "Why use multiple layers?"];
    }
    else if (t.includes('loss function') && t.includes('mse')) {
        theory = `**Loss Functions** measure prediction error:\n- **MSE:** Regression — mean of squared errors\n- **Binary Cross-Entropy:** Binary classification\n- **Categorical Cross-Entropy:** Multi-class classification\n\nLower loss = better model. Training minimizes the loss.`;
        code = `import numpy as np\n\n# MSE for regression\ny_true = np.array([3.0, 5.0, 7.0, 9.0])\ny_pred = np.array([2.8, 5.2, 6.5, 9.1])\nmse = np.mean((y_true - y_pred) ** 2)\nprint(f"MSE: {mse:.4f}")\n\n# Binary cross-entropy\ndef bce(y_true, y_pred):\n    eps = 1e-15\n    y_pred = np.clip(y_pred, eps, 1 - eps)\n    return -np.mean(y_true * np.log(y_pred) + (1-y_true) * np.log(1-y_pred))\n\ny_t = np.array([1, 0, 1, 1])\ny_p = np.array([0.9, 0.1, 0.8, 0.7])\nprint(f"BCE (good): {bce(y_t, y_p):.4f}")\ny_p_bad = np.array([0.2, 0.8, 0.3, 0.4])\nprint(f"BCE (bad): {bce(y_t, y_p_bad):.4f}")`;
        questions = ["What is a loss function?", "MSE vs Cross-Entropy?", "Why minimize loss?", "What does high loss mean?"];
    }
    else if (t.includes('backpropagation')) {
        theory = `**Backpropagation:** How neural networks learn.\n1. Forward pass → calculate loss\n2. Backward pass → compute gradients (chain rule)\n3. Update weights: w = w - lr × gradient\n4. Repeat for many epochs`;
        code = `import numpy as np\n\ndef sigmoid(z): return 1/(1+np.exp(-z))\ndef sigmoid_deriv(z): return sigmoid(z)*(1-sigmoid(z))\n\n# Simple backpropagation\nnp.random.seed(42)\nX = np.array([[0,0],[0,1],[1,0],[1,1]])\ny = np.array([[0],[1],[1],[0]])  # XOR\n\nW1 = np.random.randn(2, 4)\nW2 = np.random.randn(4, 1)\nlr = 0.5\n\nfor epoch in range(5000):\n    # Forward\n    z1 = X @ W1; a1 = sigmoid(z1)\n    z2 = a1 @ W2; a2 = sigmoid(z2)\n    # Backward\n    d2 = (a2 - y) * sigmoid_deriv(z2)\n    d1 = (d2 @ W2.T) * sigmoid_deriv(z1)\n    W2 -= lr * a1.T @ d2\n    W1 -= lr * X.T @ d1\n\npred = sigmoid(sigmoid(X @ W1) @ W2)\nprint("XOR predictions:")\nfor x, p in zip(X, pred):\n    print(f"  {x} → {p[0]:.3f} ({'1' if p[0]>0.5 else '0'}")`;
        questions = ["What is backpropagation?", "What is the chain rule?", "Why do we need backward pass?", "How are weights updated?"];
    }
    else if (t.includes('optimizer') && (t.includes('sgd') || t.includes('adam'))) {
        theory = `**Optimizers** update weights to minimize loss:\n- **SGD:** Simple, uses gradient directly\n- **Momentum:** Adds velocity to avoid local minima\n- **Adam:** Adaptive learning rates per parameter — most popular`;
        code = `# Optimizers comparison (conceptual)\nimport numpy as np\n\ndef f(x): return x**2 + 3*np.sin(x)  # bumpy function\ndef grad_f(x): return 2*x + 3*np.cos(x)\n\n# SGD\nx_sgd = 5.0\nfor _ in range(50):\n    x_sgd -= 0.1 * grad_f(x_sgd)\n\n# Adam (simplified)\nx_adam, m, v = 5.0, 0, 0\nfor t in range(1, 51):\n    g = grad_f(x_adam)\n    m = 0.9*m + 0.1*g\n    v = 0.999*v + 0.001*g**2\n    m_hat = m / (1 - 0.9**t)\n    v_hat = v / (1 - 0.999**t)\n    x_adam -= 0.1 * m_hat / (np.sqrt(v_hat) + 1e-8)\n\nprint(f"SGD converged to: {x_sgd:.4f} (f={f(x_sgd):.4f})")\nprint(f"Adam converged to: {x_adam:.4f} (f={f(x_adam):.4f})")`;
        questions = ["How does Adam optimizer work?", "SGD vs Adam?", "What is momentum?", "Why is Adam most popular?"];
    }
    else if (t.includes('tensorflow') || t.includes('first neural network')) {
        theory = `**TensorFlow/Keras:** High-level deep learning framework.\n\`\`\`python\nmodel = Sequential([Dense(64, activation='relu'), Dense(1, activation='sigmoid')])\nmodel.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])\nmodel.fit(X_train, y_train, epochs=10)\n\`\`\``;
        code = `# First Neural Network with Keras\ntry:\n    from tensorflow.keras.models import Sequential\n    from tensorflow.keras.layers import Dense\n    from sklearn.model_selection import train_test_split\n    import numpy as np\n\n    np.random.seed(42)\n    X = np.random.randn(500, 5)\n    y = (X[:, 0] + X[:, 1] > 0).astype(int)\n    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\n    model = Sequential([\n        Dense(32, activation='relu', input_shape=(5,)),\n        Dense(16, activation='relu'),\n        Dense(1, activation='sigmoid')\n    ])\n    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])\n    model.fit(X_train, y_train, epochs=5, batch_size=32, verbose=1)\n    loss, acc = model.evaluate(X_test, y_test)\n    print(f"Test accuracy: {acc:.2%}")\nexcept ImportError:\n    print("Install: pip install tensorflow")`;
        questions = ["What is Sequential model?", "What does compile() do?", "What is an epoch?", "Explain Dense layer."];
    }
    else if (t.includes('cnn') && (t.includes('pixel') || t.includes('image as'))) {
        theory = `**Images are matrices:** Grayscale = 2D array, Color = 3D (H×W×3 for RGB).\n\n**How CNNs see:** Instead of looking at every pixel, CNNs learn filters/kernels that detect features:\n- Early layers: edges, corners\n- Middle layers: textures, patterns\n- Deep layers: objects, faces`;
        code = `import numpy as np\n\n# Image as matrix\nimage = np.random.randint(0, 256, (28, 28))  # grayscale\nprint(f"Image shape: {image.shape}")\nprint(f"Pixel range: {image.min()}-{image.max()}")\n\n# Simple edge detection kernel\nkernel = np.array([[-1, -1, -1],\n                   [-1,  8, -1],\n                   [-1, -1, -1]])\n\n# Apply kernel (convolution)\ndef convolve2d(image, kernel):\n    h, w = image.shape\n    kh, kw = kernel.shape\n    out = np.zeros((h-kh+1, w-kw+1))\n    for i in range(out.shape[0]):\n        for j in range(out.shape[1]):\n            out[i,j] = np.sum(image[i:i+kh, j:j+kw] * kernel)\n    return out\n\nedges = convolve2d(image, kernel)\nprint(f"After convolution: {edges.shape}")`;
        questions = ["How is an image represented?", "What is a convolution kernel?", "What do CNN layers learn?", "RGB vs Grayscale shape?"];
    }
    else if (t.includes('mnist') || t.includes('digit class')) {
        theory = `**MNIST:** Classic dataset of 28×28 handwritten digits (0-9).\n- 60,000 training, 10,000 test images\n- The "Hello World" of deep learning\n- Build a CNN to classify digits with >98% accuracy`;
        code = `# MNIST Digit Classifier\ntry:\n    from tensorflow.keras.datasets import mnist\n    from tensorflow.keras.models import Sequential\n    from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense\n    from tensorflow.keras.utils import to_categorical\n\n    (X_train, y_train), (X_test, y_test) = mnist.load_data()\n    X_train = X_train.reshape(-1, 28, 28, 1) / 255.0\n    X_test = X_test.reshape(-1, 28, 28, 1) / 255.0\n    y_train = to_categorical(y_train, 10)\n    y_test = to_categorical(y_test, 10)\n\n    model = Sequential([\n        Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),\n        MaxPooling2D((2,2)),\n        Conv2D(64, (3,3), activation='relu'),\n        MaxPooling2D((2,2)),\n        Flatten(),\n        Dense(64, activation='relu'),\n        Dense(10, activation='softmax')\n    ])\n    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])\n    model.fit(X_train, y_train, epochs=3, batch_size=64, validation_split=0.1)\n    print(f"Test accuracy: {model.evaluate(X_test, y_test)[1]:.2%}")\nexcept ImportError:\n    print("Install: pip install tensorflow")`;
        questions = ["What is MNIST?", "Why normalize pixels to 0-1?", "What does Conv2D do?", "Why use softmax for multi-class?"];
    }
    else if (t.includes('transfer learning') || t.includes('pretrained')) {
        theory = `**Transfer Learning:** Use a model pretrained on millions of images (ImageNet) and fine-tune on your small dataset.\n- Freeze base layers → train only top layers\n- Much less data needed (100s vs millions)\n- Popular: VGG16, ResNet50, MobileNet`;
        code = `# Transfer Learning with Pretrained Model\ntry:\n    from tensorflow.keras.applications import MobileNetV2\n    from tensorflow.keras.layers import Dense, GlobalAveragePooling2D\n    from tensorflow.keras.models import Model\n\n    # Load pretrained model (without top classification layer)\n    base = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224,224,3))\n    base.trainable = False  # Freeze base layers\n\n    # Add custom classification head\n    x = GlobalAveragePooling2D()(base.output)\n    x = Dense(128, activation='relu')(x)\n    output = Dense(5, activation='softmax')(x)  # 5 classes\n    model = Model(inputs=base.input, outputs=output)\n\n    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])\n    print(f"Total params: {model.count_params():,}")\n    print(f"Trainable: {sum(p.numpy().size for p in model.trainable_weights):,}")\nexcept ImportError:\n    print("Install: pip install tensorflow")`;
        questions = ["What is transfer learning?", "Why freeze base layers?", "How much data needed?", "Popular pretrained models?"];
    }
    else if (t.includes('tokenization') || t.includes('stopword') || t.includes('stemming')) {
        theory = `**NLP Text Preprocessing:**\n1. **Tokenization:** Split text into words/tokens\n2. **Lowercasing:** Normalize case\n3. **Stopwords:** Remove common words (the, is, and)\n4. **Stemming:** Reduce to root (running → run)\n5. **Lemmatization:** Proper root form (better → good)`;
        code = `import re\nfrom collections import Counter\n\ntext = "The quick brown foxes were jumping over the lazy dogs. The dogs were barking!"\n\n# 1. Lowercase + tokenize\ntokens = re.findall(r'\\b\\w+\\b', text.lower())\nprint(f"Tokens: {tokens}")\n\n# 2. Remove stopwords\nstopwords = {'the', 'is', 'are', 'was', 'were', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'over'}\nfiltered = [w for w in tokens if w not in stopwords]\nprint(f"Filtered: {filtered}")\n\n# 3. Simple stemming\ndef simple_stem(word):\n    for suffix in ['ing', 'ed', 'es', 's', 'ly']:\n        if word.endswith(suffix) and len(word) > len(suffix) + 2:\n            return word[:-len(suffix)]\n    return word\n\nstemmed = [simple_stem(w) for w in filtered]\nprint(f"Stemmed: {stemmed}")\nprint(f"Vocabulary: {Counter(stemmed)}")`;
        questions = ["What is tokenization?", "Why remove stopwords?", "Stemming vs Lemmatization?", "What is NLP preprocessing pipeline?"];
    }
    else if (t.includes('tf-idf') || t.includes('bag of words')) {
        theory = `**Bag of Words:** Count word occurrences in each document. Simple but loses word order.\n\n**TF-IDF:** Term Frequency × Inverse Document Frequency.\n- High TF-IDF = word is important in THIS document but rare overall\n- Better than raw counts for classification`;
        code = `from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer\n\ndocs = [\n    "Python is great for machine learning",\n    "Machine learning needs good data",\n    "Python and data science are popular",\n    "Deep learning is a subset of machine learning"\n]\n\n# Bag of Words\nbow = CountVectorizer()\nX_bow = bow.fit_transform(docs)\nprint("Vocabulary:", bow.get_feature_names_out()[:8])\nprint(f"BoW shape: {X_bow.shape}")\n\n# TF-IDF\ntfidf = TfidfVectorizer()\nX_tfidf = tfidf.fit_transform(docs)\nprint(f"\\nTF-IDF for doc 0:")\nfor word, score in sorted(zip(tfidf.get_feature_names_out(), X_tfidf[0].toarray()[0]), key=lambda x: -x[1])[:5]:\n    if score > 0: print(f"  {word}: {score:.3f}")`;
        questions = ["What is Bag of Words?", "How does TF-IDF work?", "BoW vs TF-IDF?", "What does high TF-IDF mean?"];
    }
    else if (t.includes('sentiment') || t.includes('product review')) {
        theory = `**Sentiment Analysis:** Classify text as positive/negative/neutral.\n- Use TF-IDF + Logistic Regression for strong baseline\n- Or use pretrained models (HuggingFace)\n- Applications: product reviews, social media monitoring, customer feedback`;
        code = `from sklearn.feature_extraction.text import TfidfVectorizer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import accuracy_score, classification_report\n\n# Sample reviews\nreviews = ["great product love it", "terrible quality waste", "amazing value recommend",\n           "awful broke immediately", "excellent best purchase", "horrible never buy again",\n           "good quality fast shipping", "bad experience poor service",\n           "wonderful product happy", "disappointing not worth"]\nlabels = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]  # 1=positive, 0=negative\n\ntfidf = TfidfVectorizer()\nX = tfidf.fit_transform(reviews)\n\nmodel = LogisticRegression().fit(X, labels)\n\n# Test new reviews\ntest = ["great quality amazing", "terrible bad awful"]\ntest_X = tfidf.transform(test)\npreds = model.predict(test_X)\nfor review, pred in zip(test, preds):\n    print(f"  '{review}' → {'Positive ✅' if pred == 1 else 'Negative ❌'}")`;
        questions = ["How does sentiment analysis work?", "TF-IDF + LogReg vs deep learning for NLP?", "What is the baseline approach?", "How to handle sarcasm?"];
    }
    else if (t.includes('hugging') || t.includes('transformer')) {
        theory = `**HuggingFace Transformers:** Library of pretrained models for NLP.\n- BERT, GPT, T5, DistilBERT — all available\n- \`pipeline()\` for zero-code inference\n- Fine-tune on your data for best results`;
        code = `# HuggingFace Transformers\ntry:\n    from transformers import pipeline\n\n    # Sentiment analysis (zero-shot)\n    classifier = pipeline("sentiment-analysis")\n    results = classifier([\n        "I love this product, it's amazing!",\n        "This is terrible, worst purchase ever."\n    ])\n    for r in results:\n        print(f"  {r['label']}: {r['score']:.3f}")\n\n    # Text generation\n    generator = pipeline("text-generation", model="gpt2", max_length=30)\n    text = generator("Machine learning is", num_return_sequences=1)\n    print(f"\\nGenerated: {text[0]['generated_text']}")\nexcept ImportError:\n    print("Install: pip install transformers torch")`;
        questions = ["What is HuggingFace?", "What is a transformer model?", "How to use pipeline()?", "BERT vs GPT: key difference?"];
    }

    if (!theory) return null;
    return { content: `### Day ${day}: ${topic}\n\n${theory}`, code: `# Day ${day}: ${topic}\n${code}`, questions };
}

function buildPhase5(day, topic, t) {
    let theory, code, questions;

    if (t.includes('http methods') || t.includes('get, post')) {
        theory = `**HTTP Methods:**\n- **GET:** Retrieve data (idempotent)\n- **POST:** Create new resource\n- **PUT:** Update entire resource\n- **DELETE:** Remove resource\n\n**Status Codes:** 200 OK, 201 Created, 400 Bad Request, 404 Not Found, 500 Server Error`;
        code = `# HTTP Methods explained\nimport json\n\n# Simulating API requests\nendpoints = {\n    "GET /users": {"method": "GET", "desc": "List all users", "status": 200},\n    "POST /users": {"method": "POST", "desc": "Create user", "status": 201},\n    "GET /users/1": {"method": "GET", "desc": "Get user by ID", "status": 200},\n    "PUT /users/1": {"method": "PUT", "desc": "Update user", "status": 200},\n    "DELETE /users/1": {"method": "DELETE", "desc": "Delete user", "status": 204}\n}\n\nprint("REST API Design:")\nfor endpoint, info in endpoints.items():\n    print(f"  {info['method']:6s} {endpoint:15s} → {info['status']} {info['desc']}")`;
        questions = ["What are HTTP methods?", "GET vs POST?", "Common status codes?", "What is REST?"];
    }
    else if (t.includes('fastapi') && t.includes('first endpoint') || t.includes('setup') && t.includes('uvicorn')) {
        theory = `**FastAPI:** Modern, fast Python web framework for building APIs.\n- Automatic docs at /docs\n- Type hints for validation\n- Async support built-in\n- Run with: \`uvicorn main:app --reload\``;
        code = `# FastAPI: First Endpoint\n# Save as main.py, run: uvicorn main:app --reload\n\nfrom fastapi import FastAPI\n\napp = FastAPI(title="ML API", version="1.0")\n\n@app.get("/")\ndef root():\n    return {"message": "ML API is running!", "status": "healthy"}\n\n@app.get("/predict/{item_id}")\ndef predict(item_id: int, q: str = None):\n    return {"item_id": item_id, "query": q, "prediction": 0.87}\n\n@app.post("/train")\ndef train(data: dict):\n    return {"status": "training started", "samples": len(data.get("features", []))}\n\nprint("Save as main.py")\nprint("Run: uvicorn main:app --reload")\nprint("Open: http://localhost:8000/docs")`;
        questions = ["What is FastAPI?", "How to run a FastAPI app?", "What is /docs endpoint?", "Path vs query parameters?"];
    }
    else if (t.includes('/predict') || t.includes('ml model') && t.includes('endpoint')) {
        theory = `**ML API Pattern:**\n1. Load model at startup\n2. Define Pydantic schema for input\n3. Preprocess input in the endpoint\n4. Return prediction as JSON`;
        code = `# FastAPI ML Prediction Endpoint\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport numpy as np\nimport joblib\n\napp = FastAPI()\n\nclass PredictRequest(BaseModel):\n    features: list[float]\n\nclass PredictResponse(BaseModel):\n    prediction: int\n    probability: float\n    status: str = "success"\n\n# Load model at startup\n# model = joblib.load("model.pkl")\n\n@app.post("/predict", response_model=PredictResponse)\ndef predict(req: PredictRequest):\n    features = np.array(req.features).reshape(1, -1)\n    # prediction = model.predict(features)[0]\n    # probability = model.predict_proba(features)[0].max()\n    prediction, probability = 1, 0.87  # placeholder\n    return PredictResponse(prediction=prediction, probability=probability)\n\nprint("ML API with /predict endpoint ready!")`;
        questions = ["How to serve ML model as API?", "What is Pydantic?", "Why load model at startup?", "How to handle invalid input?"];
    }
    else if (t.includes('dockerfile') || t.includes('first dockerfile')) {
        theory = `**Dockerfile:** Recipe for building a Docker image.\n\`\`\`dockerfile\nFROM python:3.10-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0"]\n\`\`\``;
        code = `# Dockerfile for Python ML API\ndockerfile = \"\"\"\nFROM python:3.10-slim\n\nWORKDIR /app\n\n# Install dependencies first (cache layer)\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Copy application code\nCOPY . .\n\n# Expose port\nEXPOSE 8000\n\n# Run the API\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]\n\"\"\"\nprint(dockerfile)\n\n# Build and run commands\nprint("Commands:")\nprint("  docker build -t ml-api .")\nprint("  docker run -p 8000:8000 ml-api")\nprint("  docker ps  # list running containers")`;
        questions = ["What is a Dockerfile?", "Why COPY requirements first?", "How to build and run?", "What does EXPOSE do?"];
    }
    else if (t.includes('pytest') || t.includes('unit test') && t.includes('first')) {
        theory = `**Pytest:** Python's best testing framework.\n- Test files: \`test_*.py\`\n- Test functions: \`def test_*()\`\n- Assert: \`assert result == expected\`\n- Run: \`pytest -v\``;
        code = `# test_model.py — Unit Tests with Pytest\nimport pytest\n\n# Code to test\ndef predict(features):\n    if not features: raise ValueError("Empty features")\n    return 1 if sum(features) > 0 else 0\n\ndef preprocess(text):\n    return text.lower().strip()\n\n# Tests\ndef test_predict_positive():\n    assert predict([1.0, 2.0, 3.0]) == 1\n\ndef test_predict_negative():\n    assert predict([-1.0, -2.0, -3.0]) == 0\n\ndef test_predict_empty_raises():\n    with pytest.raises(ValueError):\n        predict([])\n\ndef test_preprocess():\n    assert preprocess("  HELLO  ") == "hello"\n    assert preprocess("Test") == "test"\n\n# Run: pytest test_model.py -v\nprint("Run: pytest test_model.py -v")\n\n# Run tests inline\nfor test_fn in [test_predict_positive, test_predict_negative, test_preprocess]:\n    try:\n        test_fn()\n        print(f"  ✅ {test_fn.__name__}")\n    except AssertionError:\n        print(f"  ❌ {test_fn.__name__}")`;
        questions = ["How to write pytest tests?", "What is assert?", "How to test for exceptions?", "Why write tests?"];
    }
    else if (t.includes('docker') && t.includes('container') && t.includes('vm')) {
        theory = `**Containers vs VMs:**\n- **VM:** Full OS copy — heavy, slow to start\n- **Container:** Shares host OS kernel — lightweight, instant start\n\n**Docker:** Package app + dependencies into a portable container.\n- Runs same everywhere: dev, staging, production`;
        code = `# Docker concepts\nprint("=== Containers vs VMs ===")\nprint("VM:        [App] [Libs] [Guest OS] [Hypervisor] [Hardware]")\nprint("Container: [App] [Libs] [Docker Engine] [Host OS] [Hardware]")\nprint()\nprint("Docker commands:")\nprint("  docker pull python:3.10     # Download image")\nprint("  docker run -it python:3.10  # Run interactive")\nprint("  docker ps                   # List running")\nprint("  docker images               # List images")\nprint("  docker stop <id>            # Stop container")\nprint("  docker rm <id>              # Remove container")`;
        questions = ["Container vs VM?", "What is a Docker image?", "Image vs container?", "Why Docker for ML?"];
    }

    if (!theory) return null;
    return { content: `### Day ${day}: ${topic}\n\n${theory}`, code: `# Day ${day}: ${topic}\n${code}`, questions };
}

function buildPhase6(day, topic, t) {
    let theory, code, questions;

    if (t.includes('aws vs gcp') || t.includes('which to learn')) {
        theory = `**Cloud Providers:**\n- **AWS:** Market leader, most jobs require it\n- **GCP:** Google's cloud, great for ML (Vertex AI)\n- **Azure:** Microsoft, enterprise-heavy\n\n**Start with:** AWS (most demand) or GCP (best ML tools)`;
        code = `# Cloud comparison\ncloud = {\n    "AWS": {"ML": "SageMaker", "Compute": "EC2", "Storage": "S3", "Market": "33%"},\n    "GCP": {"ML": "Vertex AI", "Compute": "Compute Engine", "Storage": "GCS", "Market": "11%"},\n    "Azure": {"ML": "Azure ML", "Compute": "VMs", "Storage": "Blob", "Market": "22%"}\n}\nfor provider, info in cloud.items():\n    print(f"\\n{provider}:")\n    for k, v in info.items():\n        print(f"  {k}: {v}")`;
        questions = ["AWS vs GCP for ML?", "What is EC2?", "What is S3?", "Which cloud to learn first?"];
    }
    else if (t.includes('github actions') || t.includes('auto-deploy')) {
        theory = `**GitHub Actions:** CI/CD directly in your repo.\n- Triggered on push/PR\n- Runs tests, linting, deploys automatically\n- Free for public repos`;
        code = `# .github/workflows/deploy.yml\nworkflow = \"\"\"\nname: Test and Deploy\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v4\n        with:\n          python-version: '3.10'\n      - run: pip install -r requirements.txt\n      - run: pytest tests/ -v\n\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: echo "Deploying to production..."\n\"\"\"\nprint(workflow)`;
        questions = ["What is CI/CD?", "What triggers GitHub Actions?", "How to run tests automatically?", "What is a workflow?"];
    }
    else if (t.includes('mlflow') && (t.includes('setup') || t.includes('first experiment'))) {
        theory = `**MLflow:** Open-source ML experiment tracking.\n- Log parameters, metrics, artifacts\n- Compare experiments in UI\n- Model registry for versioning\n- Run: \`mlflow ui\` → http://localhost:5000`;
        code = `# MLflow Experiment Tracking\ntry:\n    import mlflow\n    import numpy as np\n\n    mlflow.set_experiment("churn_prediction")\n\n    with mlflow.start_run(run_name="random_forest_v1"):\n        # Log parameters\n        mlflow.log_param("n_estimators", 100)\n        mlflow.log_param("max_depth", 5)\n        mlflow.log_param("test_size", 0.2)\n\n        # Log metrics\n        mlflow.log_metric("accuracy", 0.87)\n        mlflow.log_metric("f1_score", 0.83)\n        mlflow.log_metric("auc", 0.91)\n\n        print("✅ Experiment logged! Run: mlflow ui")\nexcept ImportError:\n    print("Install: pip install mlflow")`;
        questions = ["What is MLflow?", "Why track experiments?", "What to log?", "How to compare experiments?"];
    }
    else if (t.includes('streamlit') && (t.includes('interactive') || t.includes('dashboard'))) {
        theory = `**Streamlit:** Build ML dashboards in pure Python.\n- No HTML/CSS/JS needed\n- \`st.title()\`, \`st.slider()\`, \`st.plotly_chart()\`\n- Run: \`streamlit run app.py\`\n- Deploy free on Streamlit Community Cloud`;
        code = `# Streamlit Dashboard\ntry:\n    import streamlit as st\n    import pandas as pd\n    import numpy as np\n\n    st.title("ML Model Dashboard")\n    st.sidebar.header("Parameters")\n\n    n_samples = st.sidebar.slider("Samples", 50, 500, 200)\n    noise = st.sidebar.slider("Noise", 0.0, 1.0, 0.3)\n\n    data = pd.DataFrame({\n        'x': np.random.randn(n_samples),\n        'y': np.random.randn(n_samples) * noise\n    })\n\n    col1, col2 = st.columns(2)\n    col1.metric("Mean X", f"{data['x'].mean():.3f}")\n    col2.metric("Std X", f"{data['x'].std():.3f}")\n\n    st.line_chart(data)\n    st.dataframe(data.describe())\nexcept ImportError:\n    print("Install: pip install streamlit")\n    print("Run: streamlit run app.py")`;
        questions = ["What is Streamlit?", "How to add interactivity?", "Streamlit vs Flask?", "How to deploy Streamlit?"];
    }

    if (!theory) return null;
    return { content: `### Day ${day}: ${topic}\n\n${theory}`, code: `# Day ${day}: ${topic}\n${code}`, questions };
}

function buildPhase7(day, topic, t) {
    let theory, code, questions;
    let project = "Portfolio Project";
    if (t.includes('churn')) project = "Customer Churn Prediction";
    else if (t.includes('resume screen')) project = "Resume Screening NLP";
    else if (t.includes('sales forecast')) project = "Sales Forecasting";

    if (t.includes('problem statement') || t.includes('dataset') && !t.includes('time-series')) {
        theory = `**${project} — Problem Statement**\n\n**Business Context:** ${project.includes('Churn') ? 'Telecom companies lose $75B/year to churn. Predict which customers will leave.' :
                project.includes('Resume') ? 'HR teams review thousands of resumes. Build NLP system to rank candidates.' :
                    'Retail needs accurate demand forecasts to optimize inventory.'}\n\n**Setup:**\n1. Download/create dataset\n2. Understand features and target variable\n3. Set evaluation metric`;
        code = `# ${project} — Setup\nimport pandas as pd\nimport numpy as np\n\n# Create sample dataset\nnp.random.seed(42)\nn = 1000\ndf = pd.DataFrame({\n    'customer_id': range(n),\n    'tenure': np.random.randint(1, 72, n),\n    'monthly_charges': np.random.uniform(20, 120, n).round(2),\n    'total_charges': np.random.uniform(100, 8000, n).round(2),\n    'contract': np.random.choice(['Month-to-month', 'One year', 'Two year'], n),\n    'churn': np.random.choice([0, 1], n, p=[0.73, 0.27])\n})\n\nprint(f"Dataset shape: {df.shape}")\nprint(f"Churn rate: {df['churn'].mean():.1%}")\nprint(f"\\nColumns: {list(df.columns)}")\nprint(f"\\n{df.head()}")`;
        questions = ["What business problem does this solve?", "What is the target variable?", "Which metric to use?", "How to handle class imbalance?"];
    }
    else if (t.includes('eda') || t.includes('exploratory')) {
        theory = `**EDA for ${project}:**\n1. Check shape, dtypes, missing values\n2. Target distribution (imbalanced?)\n3. Feature correlations\n4. Visualize key relationships\n5. Generate business insights`;
        code = `import pandas as pd\nimport numpy as np\n\n# EDA\nnp.random.seed(42)\nn = 500\ndf = pd.DataFrame({\n    'tenure': np.random.randint(1, 72, n),\n    'charges': np.random.uniform(20, 120, n).round(2),\n    'contract': np.random.choice(['Monthly', '1yr', '2yr'], n),\n    'churn': np.random.choice([0, 1], n, p=[0.73, 0.27])\n})\n\nprint("=== Data Audit ===")\nprint(f"Shape: {df.shape}")\nprint(f"Missing: {df.isnull().sum().sum()}")\nprint(f"\\nChurn distribution:\\n{df['churn'].value_counts(normalize=True).round(3)}")\nprint(f"\\nAvg tenure by churn:\\n{df.groupby('churn')['tenure'].mean().round(1)}")\nprint(f"\\nChurn by contract:\\n{df.groupby('contract')['churn'].mean().round(3)}")`;
        questions = ["What insights did EDA reveal?", "Is the target imbalanced?", "Which features correlate with target?", "What visualizations are most useful?"];
    }
    else if (t.includes('feature engineering') && t.includes('preprocessing')) {
        theory = `**Feature Engineering for ${project}:**\n- Create interaction features\n- Bin continuous variables\n- Encode categoricals\n- Handle missing values\n- Scale numerical features`;
        code = `from sklearn.preprocessing import StandardScaler, LabelEncoder\nimport pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n    'tenure': np.random.randint(1, 72, 200),\n    'charges': np.random.uniform(20, 120, 200),\n    'contract': np.random.choice(['Monthly', '1yr', '2yr'], 200),\n    'churn': np.random.choice([0, 1], 200, p=[0.73, 0.27])\n})\n\n# Feature engineering\ndf['charges_per_month'] = df['charges'] / (df['tenure'] + 1)\ndf['tenure_group'] = pd.cut(df['tenure'], bins=[0,12,24,48,72], labels=['New','1yr','2yr','Long'])\n\n# Encode\nle = LabelEncoder()\ndf['contract_enc'] = le.fit_transform(df['contract'])\n\n# Scale\nscaler = StandardScaler()\ndf[['tenure_scaled', 'charges_scaled']] = scaler.fit_transform(df[['tenure', 'charges']])\n\nprint(df[['tenure', 'charges', 'charges_per_month', 'tenure_group', 'contract_enc']].head())`;
        questions = ["What features did you create?", "Why create interaction features?", "How to handle categoricals?", "What is your preprocessing pipeline?"];
    }
    else if (t.includes('model training') && t.includes('evaluation')) {
        theory = `**Model Training for ${project}:**\n1. Train multiple models (LogReg, RF, XGBoost)\n2. Compare on F1-score (for imbalanced data)\n3. Use cross-validation for reliable estimates\n4. Select best model`;
        code = `from sklearn.model_selection import train_test_split, cross_val_score\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.metrics import classification_report\nimport numpy as np\n\nnp.random.seed(42)\nX = np.random.randn(500, 5)\ny = (X[:, 0] + X[:, 1] * 0.5 > 0.3).astype(int)\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, stratify=y)\n\nmodels = {\n    "LogReg": LogisticRegression(),\n    "RandomForest": RandomForestClassifier(n_estimators=100, random_state=42)\n}\n\nfor name, model in models.items():\n    scores = cross_val_score(model, X_train, y_train, cv=5, scoring='f1')\n    model.fit(X_train, y_train)\n    print(f"\\n{name}: CV F1={scores.mean():.3f}±{scores.std():.3f}")\n    print(classification_report(y_test, model.predict(X_test)))`;
        questions = ["Why compare multiple models?", "Which metric for imbalanced data?", "How to interpret classification report?", "Why use cross-validation?"];
    }
    else if (t.includes('github profile') || t.includes('project pinning')) {
        theory = `**GitHub Profile Polish:**\n1. Professional profile picture and bio\n2. Pin your 3 best projects\n3. Each repo: clear README, clean code, requirements.txt\n4. Contribution graph should show activity`;
        code = `# GitHub Profile Checklist\nchecklist = [\n    "✅ Professional profile photo",\n    "✅ Bio: 'ML Engineer | Python | scikit-learn | FastAPI'",\n    "✅ Pin 3 best projects",\n    "✅ Each project README has: description, setup, results, screenshots",\n    "✅ Clean commit history with meaningful messages",\n    "✅ requirements.txt in every project",\n    "✅ .gitignore (no data files, no __pycache__)",\n    "✅ Consistent coding style (PEP 8)",\n]\n\nprint("GitHub Portfolio Checklist:")\nfor item in checklist:\n    print(f"  {item}")`;
        questions = ["What do hiring managers look at on GitHub?", "What makes a good project README?", "How many projects to pin?", "How to write commit messages?"];
    }
    else if (t.includes('resume bullet')) {
        theory = `**Resume Bullets — XYZ Formula:**\n"Accomplished [X] as measured by [Y] by doing [Z]"\n\nExample: "Built a customer churn prediction system achieving 91% AUC by engineering 15 features and deploying with FastAPI + Docker"`;
        code = `# Resume Bullet Templates\nbullets = [\n    {\n        "project": "Customer Churn Prediction",\n        "bullet": "Built ML pipeline predicting customer churn with 91% AUC using XGBoost, "\n                  "reducing churn rate by 15% through targeted retention campaigns"\n    },\n    {\n        "project": "Resume Screening NLP",\n        "bullet": "Developed NLP resume ranking system processing 500+ resumes/min using "\n                  "TF-IDF + Logistic Regression, deployed as FastAPI microservice"\n    },\n    {\n        "project": "Sales Forecasting",\n        "bullet": "Created time-series forecasting dashboard achieving MAPE < 8% using "\n                  "Prophet + Streamlit, enabling data-driven inventory decisions"\n    }\n]\n\nprint("Resume Bullets (XYZ Formula):")\nfor b in bullets:\n    print(f"\\n📌 {b['project']}:")\n    print(f"   • {b['bullet']}")`;
        questions = ["What is the XYZ formula?", "How to quantify achievements?", "What makes a strong bullet?", "How to describe ML projects on resume?"];
    }

    if (!theory) return null;
    return { content: `### Day ${day}: ${topic}\n\n${theory}`, code: `# Day ${day}: ${topic}\n${code}`, questions };
}

function buildPhase8(day, topic, t) {
    let theory, code, questions;

    if (t.includes('python coding')) {
        theory = `**Top Python Interview Questions:**\n1. Reverse a linked list\n2. Two Sum problem\n3. Valid parentheses\n4. Merge sorted arrays\n5. Binary search\n\n**Tips:** Think aloud, discuss time/space complexity, handle edge cases.`;
        code = `# Top Python Coding Questions\n\n# 1. Two Sum\ndef two_sum(nums, target):\n    seen = {}\n    for i, n in enumerate(nums):\n        if target - n in seen:\n            return [seen[target-n], i]\n        seen[n] = i\n\nprint(f"Two Sum: {two_sum([2,7,11,15], 9)}")\n\n# 2. Valid Parentheses\ndef is_valid(s):\n    stack = []\n    pairs = {')':'(', ']':'[', '}':'{'}\n    for c in s:\n        if c in '([{': stack.append(c)\n        elif not stack or stack.pop() != pairs[c]: return False\n    return not stack\n\nprint(f"Valid: {is_valid('()[]{}')}")\n\n# 3. Fibonacci (memoized)\ndef fib(n, memo={}):\n    if n <= 1: return n\n    if n not in memo:\n        memo[n] = fib(n-1) + fib(n-2)\n    return memo[n]\n\nprint(f"Fib(10): {fib(10)}")`;
        questions = ["Solve Two Sum in O(n).", "Implement binary search.", "Reverse a string without slicing.", "Find duplicates in a list."];
    }
    else if (t.includes('sql interview')) {
        theory = `**Top SQL Interview Challenges:**\n1. Second highest salary\n2. Employees earning more than manager\n3. Running totals\n4. Duplicate detection\n5. Customer with most orders`;
        code = `# SQL Interview Challenges\nsql = \"\"\"\n-- 1. Second highest salary\nSELECT MAX(salary) FROM employees\nWHERE salary < (SELECT MAX(salary) FROM employees);\n\n-- 2. Employees earning more than manager\nSELECT e.name FROM employees e\nJOIN employees m ON e.manager_id = m.id\nWHERE e.salary > m.salary;\n\n-- 3. Running total\nSELECT date, amount,\n  SUM(amount) OVER (ORDER BY date) AS running_total\nFROM sales;\n\n-- 4. Find duplicates\nSELECT email, COUNT(*) AS cnt\nFROM users GROUP BY email HAVING cnt > 1;\n\n-- 5. Nth highest salary\nSELECT salary FROM (\n  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk\n  FROM employees\n) t WHERE rnk = 3;\n\"\"\"\nprint(sql)`;
        questions = ["Find second highest salary.", "Find duplicate emails.", "Calculate running total.", "Top 3 customers by spend."];
    }
    else if (t.includes('ml theory') || t.includes('system design')) {
        theory = `**ML Interview Topics:**\n1. Bias-variance tradeoff\n2. Overfitting prevention\n3. Feature selection methods\n4. Model evaluation metrics\n5. System design: recommendation system, fraud detection`;
        code = `# ML Interview Rapid-Fire Answers\nqa = [\n    ("Bias vs Variance?", "Bias=underfitting (too simple). Variance=overfitting (too complex). Goal: balance."),\n    ("How to prevent overfitting?", "More data, regularization (L1/L2), dropout, cross-validation, simpler model."),\n    ("When is accuracy misleading?", "Imbalanced data: 99% negative → always predict negative → 99% accuracy but useless."),\n    ("Random Forest vs XGBoost?", "RF: parallel trees (bagging). XGB: sequential trees (boosting). XGB usually wins."),\n    ("Explain precision vs recall", "Precision: of predicted positive, how many correct. Recall: of actual positive, how many found."),\n    ("What is data leakage?", "Test info leaks into training. Example: scaling before split, using future data."),\n    ("How to handle missing values?", "Drop, fill with mean/median/mode, or use models that handle NaN (XGBoost)."),\n]\n\nfor q, a in qa:\n    print(f"Q: {q}")\n    print(f"A: {a}\\n")`;
        questions = ["Explain bias-variance tradeoff.", "How to prevent overfitting?", "Design a recommendation system.", "When is accuracy misleading?"];
    }
    else if (t.includes('project walkthrough') || t.includes('hr question')) {
        theory = `**Project Walkthrough Framework (STAR):**\n- **Situation:** What was the problem?\n- **Task:** What was your role?\n- **Action:** What did you build?\n- **Result:** What was the impact?\n\n**HR Questions:** Tell me about yourself, biggest challenge, why this company, team conflict`;
        code = `# Project Walkthrough Template\nwalkthrough = {\n    "situation": "Company losing 27% customers annually, costing $2M/year",\n    "task": "Build predictive system to identify at-risk customers",\n    "action": [\n        "Cleaned 50K-row dataset with Pandas",\n        "Engineered 15 features from raw data",\n        "Trained 5 models, selected XGBoost (F1=0.83, AUC=0.91)",\n        "Built FastAPI endpoint, Dockerized, deployed to AWS"\n    ],\n    "result": "Reduced churn by 15% in first quarter, saving ~$300K"\n}\n\nprint("Project Walkthrough (STAR):")\nfor key, val in walkthrough.items():\n    print(f"\\n{key.upper()}:")\n    if isinstance(val, list):\n        for item in val:\n            print(f"  • {item}")\n    else:\n        print(f"  {val}")`;
        questions = ["Walk me through your best project.", "Biggest technical challenge?", "Why should we hire you?", "Where do you see yourself in 3 years?"];
    }
    else if (t.includes('resume polish') || t.includes('job launch') || t.includes('apply strategy')) {
        theory = `**Job Launch Checklist:**\n1. ✅ Resume: 1-page, quantified achievements, ATS-friendly\n2. ✅ GitHub: 3 pinned projects with clean READMEs\n3. ✅ LinkedIn: Updated headline, summary, project posts\n4. ✅ Apply: 5-10 targeted applications per day\n5. ✅ Network: Connect with recruiters, attend meetups`;
        code = `# Job Launch Strategy\nstrategy = {\n    "Week 1-2": [\n        "Polish resume with XYZ bullets",\n        "Update LinkedIn with project posts",\n        "Clean GitHub profile, pin 3 projects"\n    ],\n    "Week 3-4": [\n        "Apply 5-10 jobs daily on LinkedIn/Naukri",\n        "Customize cover letter per company",\n        "Practice 2 coding problems daily"\n    ],\n    "Week 5-6": [\n        "Mock interviews with friends",\n        "Review ML theory flashcards",\n        "Follow up on applications"\n    ],\n    "Ongoing": [\n        "Write 1 technical blog post per week",\n        "Network on LinkedIn (comments > posts)",\n        "Keep building side projects"\n    ]\n}\n\nprint("🚀 Job Launch Strategy:")\nfor phase, tasks in strategy.items():\n    print(f"\\n{phase}:")\n    for task in tasks:\n        print(f"  • {task}")`;
        questions = ["How to write an ATS-friendly resume?", "How many applications per day?", "How to network effectively?", "What to do after applying?"];
    }

    if (!theory) return null;
    return { content: `### Day ${day}: ${topic}\n\n${theory}`, code: `# Day ${day}: ${topic}\n${code}`, questions };
}

module.exports = { buildPhase4, buildPhase5, buildPhase6, buildPhase7, buildPhase8 };
