"use client"

import { useState, useEffect, useContext } from "react"
import { useAuth } from "@clerk/clerk-react"
import { Book, Loader, BookOpen, Heart, Plus } from "lucide-react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BookListContext } from "../context/BookListContext"
import AddToBookListModal from "./AddToBookListModal"
import "./Discover.css"

const Discover = () => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const { userId } = useAuth()
  const navigate = useNavigate()
  const { bookLists } = useContext(BookListContext)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        // First, get the user's genres
        const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`)
        const userGenres = userResponse.data.genres || []

        if (userGenres.length === 0) {
          setError("No genres found in your profile. Please update your preferences.")
          setLoading(false)
          return
        }

        // Then, fetch recommendations based on genres
        const response = await fetch("http://127.0.0.1:5000/generalized_recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ genres: userGenres }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations")
        }

        const text = await response.text()
        let data
        try {
          // Replace NaN with null in the response text before parsing
          const cleanedText = text.replace(/NaN/g, "null")
          data = JSON.parse(cleanedText)
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError)
          throw new Error("Invalid response format from server")
        }

        setRecommendations(
          (data.recommendations || []).map((book) => ({
            ...book,
            cover_image: book.coverImg
              ? `https://images.weserv.nl/?url=${encodeURIComponent(book.coverImg)}&fit=cover&h=400`
              : null,
            genres: Array.isArray(book.genres)
              ? book.genres
              : typeof book.genres === "string"
                ? JSON.parse(book.genres.replace(/'/g, '"'))
                : [],
          })),
        )
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        setError("Failed to load recommendations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchRecommendations()
    }
  }, [userId])

  // Same function as in Navbar.jsx
  const handleBookClick = (book) => {
    // Navigate to book details page with the book title
    navigate(`/book/${encodeURIComponent(book.title)}`)
  }

  // Same function as in Navbar.jsx
  const handleAddBook = (book) => {
    setSelectedBook(book)
  }

  const closeAddToListModal = () => {
    setSelectedBook(null)
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="discover-page home">
          <header className="discover-header">
            <h1>Discover Books</h1>
          </header>

          <div className="loading-state">
            <div className="loading-content">
              <Loader className="loading-icon" />
              <h2>Finding your next favorite books...</h2>
              <p>We're curating recommendations based on your preferences</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="discover-page home">
          <header className="discover-header">
            <h1>Discover Books</h1>
          </header>

          <div className="error-state">
            <div className="error-content">
              <div className="error-icon-container">
                <BookOpen className="error-icon" />
              </div>
              <h2>Oops! Something went wrong</h2>
              <p>{error}</p>
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="discover-page home">
        <header className="discover-header">
          <h1>Discover Books</h1>
        </header>

        {recommendations.length === 0 ? (
          <div className="empty-state">
            <BookOpen className="empty-icon" />
            <h2>No recommendations found</h2>
            <p>Try updating your genre preferences to get personalized book recommendations</p>
            <button className="btn-primary">Update Preferences</button>
          </div>
        ) : (
          <div className="books-grid">
            {recommendations.map((book, index) => (
              <div key={index} className="book-card">
                <div className="book-cover-container">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image || "/placeholder.svg"}
                      alt={`Cover of ${book.title}`}
                      className="book-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = "/placeholder.svg?height=400&width=300"
                      }}
                    />
                  ) : (
                    <div className="placeholder-cover">
                      <Book className="placeholder-icon" />
                    </div>
                  )}
                  <button className="favorite-button" aria-label="Add to favorites">
                    <Heart className="favorite-icon" />
                  </button>
                </div>

                <div className="book-content">
                  <h3 className="book-title">{book.title || "Unknown Title"}</h3>
                  <p className="book-author">by {book.author || "Unknown Author"}</p>

                  {book.genres && book.genres.length > 0 && (
                    <div className="genre-tags">
                      {(Array.isArray(book.genres) ? book.genres : [book.genres]).slice(0, 3).map((genre, idx) => (
                        <span key={idx} className="genre-badge">
                          {typeof genre === "string" ? genre.trim() : String(genre)}
                        </span>
                      ))}
                      {book.genres.length > 3 && <span className="more-genres">+{book.genres.length - 3}</span>}
                    </div>
                  )}

                  <p className="book-description">
                    {book.description
                      ? book.description.length > 120
                        ? `${book.description.substring(0, 120)}...`
                        : book.description
                      : "No description available for this book."}
                  </p>
                </div>

                <div className="book-actions">
                  <button className="btn-primary view-details-btn" onClick={() => handleBookClick(book)}>
                    View Details
                  </button>
                  <button
                    className="btn-secondary add-list-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddBook(book)
                    }}
                  >
                    <Plus className="btn-icon" />
                    Add to List
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedBook && <AddToBookListModal book={selectedBook} onClose={closeAddToListModal} />}
      </div>
    </div>
  )
}

export default Discover
