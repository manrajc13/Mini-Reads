"use client"

import { BookListProvider } from "./context/BookListContext"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import BookDetails from "./components/BookDetails"
import Discover from "./components/Discover"
import GenreQuestionnaire from "./components/GenreQuestionnaire"
import "./App.css"
import { SignedIn, SignedOut, SignInButton, SignUpButton, useAuth, useUser } from "@clerk/clerk-react"
import { Book, ArrowRight, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import axios from "axios"
import LandingPage from "./components/landing-page"
import ReadingHistory from "./components/reading-history"
import ReadingDetails from "./components/reading-details"

const API_BASE_URL = "http://localhost:5000/api"

function App() {
  const [isVisible, setIsVisible] = useState(false)
  const [showQuestionnaire, setShowQuestionnaire] = useState(false)
  const { isSignedIn, userId } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    // Trigger animation after component mounts
    setIsVisible(true)
  }, [])

  // Check if user exists in our database when they sign in
  useEffect(() => {
    const checkUserAndGenres = async () => {
      if (isSignedIn && userId && user) {
        try {
          // Try to get the user from our database
          const response = await axios.get(`${API_BASE_URL}/users/${userId}`)

          // If user exists but has no genres, show questionnaire
          if (response.data && (!response.data.genres || response.data.genres.length === 0)) {
            setShowQuestionnaire(true)
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // User doesn't exist in our database, create them
            try {
              await axios.post(`${API_BASE_URL}/auth/register`, {
                userId,
                name: user.fullName || user.username,
                email: user.primaryEmailAddress?.emailAddress,
              })

              // Show questionnaire for new users
              setShowQuestionnaire(true)
            } catch (registerError) {
              console.error("Error registering user:", registerError)
            }
          } else {
            console.error("Error checking user:", error)
          }
        }
      }
    }

    checkUserAndGenres()
  }, [isSignedIn, userId, user])

  const handleQuestionnaireComplete = async () => {
    setShowQuestionnaire(false)
  }

  return (
    <div className="app">
      <SignedOut>
        <div className="auth-container">
          <div className={`auth-card ${isVisible ? "visible" : ""}`}>
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
        {showQuestionnaire && <GenreQuestionnaire userId={userId} onComplete={handleQuestionnaireComplete} />}
        <BookListProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/book/:title" element={<BookDetails />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/landing" element={<LandingPage/>} />
              <Route path="/reading-history" element={<ReadingHistory/>} />
              <Route path="/reading-details/:bookName" element={<ReadingDetails/>} />
            </Routes>
          </Router>
        </BookListProvider>
      </SignedIn>
    </div>
  )
}

export default App
