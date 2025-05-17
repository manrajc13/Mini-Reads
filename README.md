Minireads: An AI-Powered Smart Book Collection Manager
Minireads is an intelligent, AI-powered platform designed to revolutionize how users manage and explore their book collections. It offers a highly personalized experience, allowing users to create custom collections, receive AI-driven recommendations, track reading history, and discover new books through smart search and discovery tools.


Project Overview
In an era where readers often feel overwhelmed by the sheer volume of available books, Minireads addresses the common challenges of static suggestions, lack of personalization, and the absence of centralized systems for managing book collections. By combining advanced recommendation models with an intuitive UI and scalable backend, Minireads aims to enhance user interaction with literature in a personalized and efficient manner.


Features
Minireads offers a suite of AI-enhanced features for an intelligent and seamless user experience:

Personalized Discovery Experience: Powered by AI, the platform provides tailored book suggestions.
Intelligent Recommendations: Recommendations are based on user collections, reading behavior, and genre interests.
Centralized Collection Management: Users can create, manage, and explore their book collections in one place. 
Customizable Collections: Create multiple book collections based on themes, genres, or personal interests.
AI Suggestions for Collections: AI helps enrich collections with suggestions based on themes and prior entries.
Contextual Recommendations: Each collection acts as a context for targeted book suggestions, leveraging the collection name, genre, description, and previously added books.
Smart Search Mechanism: Go beyond exact matches with a semantic search engine that understands synonyms and context. 

Search Criteria: Search by author name, book title, or genre.
Smart Sorting: Search results are sorted by book ratings, prioritizing higher-quality content.
Discover Tab: Showcases Top 50 Book Recommendations tailored to user preferences, dynamically updated by AI algorithms as user behavior evolves. Recommendations are driven by genre interests, books added to collections, reading history, and user interactions.


Reading History: The platform keeps a detailed log of books users have read or interacted with. This history influences future recommendations, ensuring relevance and avoiding repetition. Users can also review their reading journey and achievements.


User Journey
The Minireads user journey is designed for both new and returning users:

Cold User (New User) 
Registration: New users can register easily using email or mobile number. The system validates input and creates a secure user profile.
Questionnaire: After registration, a short questionnaire gathers user preferences on book genres (e.g., Fiction, Science, Mystery, Biography, Fantasy) to seed initial recommendations.
Regular User (Returning User) 
Login: Users securely log in with registered credentials. Two-Factor Authentication (2FA) enhances security: Step 1 involves entering a password, and Step 2 requires an OTP sent to the registered email or phone.
User Dashboard: Upon successful login, users are directed to a personalized dashboard to manage collections, explore recommendations, and view reading history.
Tech Stack
Minireads is built using a modern and scalable tech stack:

Frontend: ReactJS for a responsive, dynamic, and component-based user interface.
Backend:
Node.js: Provides backend infrastructure for user authentication, routing, and server-side logic.
Flask: Serves the AI recommendation model as an API endpoint, enabling communication with the frontend.
Database:
MongoDB Atlas: A cloud-based NoSQL database for user preferences, reading history, and book collections.
Cassandra Database: A highly scalable and distributed vector database for storing book embeddings for fast retrieval during recommendations.
AI & NLP Frameworks:
Hugging Face: Used for accessing pre-trained language models (like Lamini T5) to embed book metadata for recommendations.
LangChain: Provides a framework to link language models and retrieval methods for meaningful recommendations using real-time data
