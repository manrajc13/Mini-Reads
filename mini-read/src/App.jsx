import { BookListProvider } from "../src/context/BookListContext"
import Home from "../src/components/Home"
import Navbar from "../src/components/Navbar"
import "./App.css"
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react"
import { Book, ArrowRight, UserPlus } from 'lucide-react'
import { useState, useEffect } from "react"

function App() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true)
  }, [])

  return (
    <div className="app">
      <SignedOut>
        <div className="auth-container">
          <div className={`auth-card ${isVisible ? 'visible' : ''}`}>
            <div className="auth-header">
              <div className="auth-logo">
                <Book className="auth-logo-icon" />
                <h1>Mini-Reads</h1>
              </div>
              <p className="auth-subtitle">Your personal book collection manager</p>
            </div>

            <div className="auth-content">
              <div className="auth-welcome">
                <h2>Welcome back</h2>
                <p>Sign in to access your personal book collections and continue your reading journey</p>
              </div>
              
              <div className="auth-buttons">
                <SignInButton mode="modal">
                  <button className="auth-button btn-primary">
                    Sign In <ArrowRight size={18} />
                  </button>
                </SignInButton>
                
                <div className="auth-divider">
                  <span>or</span>
                </div>
                
                <SignUpButton mode="modal">
                  <button className="auth-button btn-secondary">
                    Create Account <UserPlus size={18} />
                  </button>
                </SignUpButton>
              </div>
              
              <div className="auth-features">
                <div className="feature">
                  <div className="feature-icon">📚</div>
                  <div className="feature-text">Track your reading</div>
                </div>
                <div className="feature">
                  <div className="feature-icon">🔖</div>
                  <div className="feature-text">Save favorites</div>
                </div>
                <div className="feature">
                  <div className="feature-icon">📝</div>
                  <div className="feature-text">Write reviews</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <BookListProvider>
          <Navbar />
          <Home />
        </BookListProvider>
      </SignedIn>
    </div>
  )
}

export default App
