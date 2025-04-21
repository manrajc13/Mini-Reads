"use client"

import { useState } from "react"
import { Check, BookOpen } from "lucide-react"
import axios from "axios"
import "./GenreQuestionnaire.css"

const API_BASE_URL = "http://localhost:5000/api"

const GenreQuestionnaire = ({ userId, onComplete }) => {
  const [selectedGenres, setSelectedGenres] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const genres = [
    "Romance",
    "Mystery",
    "Science Fiction",
    "Fantasy",
    "Thriller",
    "Horror",
    "Historical Fiction",
    "Biography",
    "Self-Help",
    "Adventure",
    "Young Adult",
    "Classics",
    "Poetry",
    "Drama",
    "Crime",
    "Dystopian",
  ]

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre)
      } else {
        return [...prev, genre]
      }
    })
  }

  const handleSubmit = async () => {
    if (selectedGenres.length === 0) {
      alert("Please select at least one genre")
      return
    }

    setIsSubmitting(true)

    try {
      await axios.patch(`${API_BASE_URL}/users/${userId}/genres`, {
        genres: selectedGenres,
      })

      onComplete()
    } catch (error) {
      console.error("Error saving genre preferences:", error)
      alert("Failed to save your preferences. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="genre-questionnaire-overlay">
      <div className="genre-questionnaire-modal">
        <div className="questionnaire-header">
          <BookOpen className="questionnaire-icon" />
          <h2>What genres do you enjoy reading?</h2>
          <p>Select all that apply to personalize your experience</p>
        </div>

        <div className="genre-grid">
          {genres.map((genre) => (
            <div
              key={genre}
              className={`genre-item ${selectedGenres.includes(genre) ? "selected" : ""}`}
              onClick={() => handleGenreToggle(genre)}
            >
              <span className="genre-name">{genre}</span>
              {selectedGenres.includes(genre) && <Check className="genre-check" />}
            </div>
          ))}
        </div>

        <div className="questionnaire-actions">
          <button className="btn-primary submit-btn" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GenreQuestionnaire
