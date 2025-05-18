# 📚 Mini-Reads

A Smart Book Collection Manager & Personalized Recommendation Engine powered by NLP and Vector Search.

---


## 💡 Project Overview

**Mini-Reads** is a smart book management platform that combines book discovery, personalized recommendations, and a beautiful UI to elevate your reading experience.

---

## 🚀 Key Features

- 📖 **Personalized Book Recommendations**:  
  Embedded over **50K+ books** (titles, authors, descriptions, characters) using **HuggingFace's Lamini-T5** into **AstraDB**, enabling semantic search and similarity-based retrieval.

- 🔍 **Intelligent Fuzzy Search**:  
  Quickly discover books by **title**, **author**, or **genre** using approximate string matching and ranking.

- 📈 **Dynamic User-Centric Suggestions**:  
  Tracks user reading behavior and preferences to offer **real-time, rating-based** generalized recommendations.

- 🧱 **Modular and Scalable Full-Stack Architecture**:  
  - **Frontend**: React.js  
  - **Backend API**: Node.js, Flask (recommendation endpoints)  
  - **Recommendation Engine**: langchain (similarity searches)  
  - **User Data**: MongoDB Atlas  
  - **Embeddings**: CassandraDB (via AstraDB vector storage)

---

## 🛠️ Tech Stack

- React.js
- Node.js
- Flask (Python)
- MongoDB Atlas
- CassandraDB / AstraDB (Vector DB)
- HuggingFace Transformers (Lamini-T5)
- LangChain
- Numpy, Pandas

---

## 🧪 Getting Started (Local Setup)

### 1. Clone the Repository

```bash
git clone https://github.com/manrajc13/Mini-Reads.git
cd mini-reads
```
