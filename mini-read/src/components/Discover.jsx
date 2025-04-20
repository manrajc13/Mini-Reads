"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import { Book, Loader, BookOpen } from 'lucide-react'
import axios from "axios"
import "./Discover.css"

const Discover = () => {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { userId } = useAuth()

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      try {
        // First, get the user's genres from MongoDB
        const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`)
        const userGenres = userResponse.data.genres || []
        console.log("User genres:", userGenres)
        if (userGenres.length === 0) {
          setError("No genres found for the user. Please update your preferences.")
          setLoading(false)
          return
        }

        // Then, make the POST request to the recommendations API
        const response = await fetch("http://127.0.0.1:5000/generalized_recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ genres: userGenres }),
        })
        // console.log("Response from recommendations API:", response)
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations")
        }

        const text = await response.text()
        let data
        try {
          // Replace NaN with null in the response text before parsing
          const cleanedText = text.replace(/: NaN/g, ": null")
          data = JSON.parse(cleanedText)
        } catch (parseError) {
          console.error("Error parsing JSON:", parseError)
          throw new Error("Invalid response format from server")
        }

        setRecommendations((data.recommendations || []).map(book => ({
          ...book,
          cover_image: book.cover_image ? 
            `https://images.weserv.nl/?url=${encodeURIComponent(book.cover_image)}` : 
            null
        })))
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        setError("Failed to load recommendations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [userId])

  if (loading) {
    return (
      <div className="discover-loading">
        <div className="loading-container">
          <Loader className="loading-icon" />
          <h2>Finding books you'll love...</h2>
          <p>Based on your preferred genres</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="discover-error">
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="discover">
      <header className="discover-header">
        <h1>Discover Books</h1>
        <p>Personalized recommendations based on your preferences</p>
      </header>

      {recommendations.length === 0 ? (
        <div className="no-recommendations">
          <BookOpen className="no-data-icon" />
          <h2>No recommendations found</h2>
          <p>Try updating your genre preferences to get personalized recommendations</p>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((book, index) => (
            <div className="book-card" key={index}>
              <div className="book-cover">
                {book.cover_image ? (
                  <img 
                    src={book.cover_image} 
                    alt={book.title}
                    onError={(e) => {
                      e.target.onerror = null; // Prevent infinite loop
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <div className="placeholder-cover">
                    <Book className="book-icon" />
                  </div>
                )}
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                {book.genres && (Array.isArray(book.genres) ? book.genres : String(book.genres).split(',')).length > 0 && (
                  <div className="book-genres">
                    {(Array.isArray(book.genres) ? book.genres : String(book.genres).split(','))
                      .slice(0, 3)
                      .map((genre, idx) => (
                        <span key={idx} className="genre-tag">
                          {genre.trim()}
                        </span>
                      ))}
                  </div>
                )}
                <p className="book-description">
                  {book.description
                    ? book.description.length > 120
                      ? `${book.description.substring(0, 120)}...`
                      : book.description
                    : "No description available"}
                </p>
              </div>
              <div className="book-actions">
                <button className="btn-primary view-details-btn">View Details</button>
                <button className="btn-secondary add-to-list-btn">Add to List</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Discover
