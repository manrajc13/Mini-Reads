"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { BookListContext } from "../context/BookListContext"
import { Plus, Edit2, Trash2, Save, X, BookOpen, Loader } from 'lucide-react'
import "./Modal.css"
import "./BookListDetail.css"

const BookListDetail = ({ bookList, onClose }) => {
  const [newBookName, setNewBookName] = useState("")
  const [editBookName, setEditBookName] = useState("")
  const [recommendations, setRecommendations] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { addBook, deleteBook, toggleEditBook, updateBookName } = useContext(BookListContext)
  const modalRef = useRef()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleAddBook = (e) => {
    e.preventDefault()
    if (newBookName.trim()) {
      addBook(bookList.id, newBookName)
      setNewBookName("")
    }
  }

  const handleUpdateBook = (bookId) => {
    if (editBookName.trim()) {
      updateBookName(bookList.id, bookId, editBookName)
    } else {
      toggleEditBook(bookList.id, bookId)
    }
  }

  const getRecommendations = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Extract just the book names for the API request
      const bookNames = bookList.books.map(book => book.name)
      // console.log(bookNames)
      
      // Replace with your actual API endpoint
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: bookNames }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }
      
      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError('Failed to get recommendations. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  // For demo purposes, simulate API call with the provided response
  const simulateApiCall = () => {
    setIsLoading(true)
    setError(null)
    
    // Simulate network delay
    setTimeout(() => {
      const mockResponse = {
        "recommendations": [
          {
            "author": "Isabel Allende",
            "description": "9780060924980 Selling more than 65,000 copies and topping bestseller lists around the world -- including Spain, Germany, Italy, and Latin America -- this novel tells the engrossing story of one man's quest for love and for his soul.",
            "title": "The Infinite Plan A Novel"
          },
          {
            "author": "Clive Barker",
            "description": "9780061094156 The magical tale of ill-fated lovers lost among worlds teetering on the edge of destruction, where their passion holds the key to escape. There has never been a book like Imajica. Transforming every expectation offantasy fiction with its heady mingling of radical sexuality and spiritual anarchy, it has carried its millions of readers into regions of passion and philosophy that few books have even attempted to map. It's an epic in every way; vast in conception, obsessively detailed in execution, and apocalyptic in its resolution. A book of erotic mysteries and perverse violence. A book of ancient, mythological landscapes and even more ancient magic.",
            "title": "Imajica II The Reconciliation"
          },
          {
            "author": "Philip Roth",
            "description": "9780099801900 A famous writer and his mistress meet in a room without a bed. They talk, they play games with each other, they have sex, they tell lies. This work since \"Complaint\", explores adultery and the unmasking of illicit lovers in a novel that exposes the tenderness and uncertainty underlying all affairs of the heart.",
            "title": "Deception"
          },
          {
            "author": "Luigi Pirandello",
            "description": "9780140189223 Accompanied by two additional plays, presents the classic drama about literature and reality in which six characters involved in their own family drama come to life at a theater in the midst of a rehearsal, insisting that the theatrical company complete their story.",
            "title": "Six Characters in Search of an Author and Other Plays"
          },
          {
            "author": "Gustave Flaubert and Geoffrey Wall",
            "description": "9780140449129 An unhappily married woman, Emma Bovary's unfulfilled dreams of romantic love and desperation to escape the ordinary boredom of her life lead her to a series of desperate acts, including adultery, in a classic novel set against the backdrop of nineteenth-",
            "title": "Madame Bovary"
          }
        ]
      }
      // const bookNames = bookList.books.map(book => book.name)
      // console.log(bookNames)
      setRecommendations(mockResponse.recommendations)
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="modal-overlay">
      <div className="modal book-detail-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>{bookList.title}</h2>
          <button className="close-btn" onClick={onClose}>
            <X className="close-icon" />
          </button>
        </div>

        <div className="book-detail-content">
          <form onSubmit={handleAddBook} className="add-book-form">
            <input
              type="text"
              value={newBookName}
              onChange={(e) => setNewBookName(e.target.value)}
              placeholder="Add a new book"
              className="add-book-input"
            />
            <button type="submit" className="btn-primary">
              <Plus className="btn-icon" />
              Add
            </button>
          </form>

          <div className="books-list">
            {bookList.books.length > 0 ? (
              <ul>
                {bookList.books.map((book) => (
                  <li key={book.id} className="book-item">
                    {book.isEditing ? (
                      <div className="edit-book-form">
                        <input
                          type="text"
                          defaultValue={book.name}
                          onChange={(e) => setEditBookName(e.target.value)}
                          autoFocus
                        />
                        <button className="btn-secondary save-btn" onClick={() => handleUpdateBook(book.id)}>
                          <Save className="btn-icon" />
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="book-name">{book.name}</span>
                        <div className="book-actions">
                          <button
                            className="btn-secondary edit-btn"
                            onClick={() => {
                              setEditBookName(book.name)
                              toggleEditBook(bookList.id, book.id)
                            }}
                          >
                            <Edit2 className="btn-icon" />
                            Edit
                          </button>
                          <button className="btn-danger delete-btn" onClick={() => deleteBook(bookList.id, book.id)}>
                            <Trash2 className="btn-icon" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="no-books">
                <p>No books added yet</p>
              </div>
            )}
          </div>
          
          {bookList.books.length > 0 && !recommendations && !isLoading && (
            <div className="recommendations-section">
              <button 
                className="btn-secondary get-recommendations-btn" 
                onClick={simulateApiCall} // Using simulateApiCall for demo
              >
                <BookOpen className="btn-icon" />
                Get Recommendations
              </button>
            </div>
          )}
          
          {isLoading && (
            <div className="loading-container">
              <Loader className="loading-spinner" />
              <p>Finding books you might enjoy...</p>
            </div>
          )}
          
          {error && (
            <div className="error-container">
              <p>{error}</p>
              <button 
                className="btn-primary retry-btn" 
                onClick={simulateApiCall}
              >
                Try Again
              </button>
            </div>
          )}
          
          {recommendations && (
            <div className="recommendations-container">
              <h3>Recommended Books</h3>
              <p className="recommendations-subtitle">Based on your collection</p>
              <ul className="recommendations-list">
                {recommendations.map((book, index) => (
                  <li key={index} className="recommendation-item">
                    <div className="recommendation-content">
                      <h4>{book.title}</h4>
                      <p className="recommendation-author">by {book.author}</p>
                      {book.description && (
                        <p className="recommendation-description">
                          {book.description.replace(/^[0-9]{13}\s/, '')}
                        </p>
                      )}
                    </div>
                    <button className="btn-primary add-recommendation-btn" onClick={() => {
                      addBook(bookList.id, `${book.title} by ${book.author}`)
                    }}>
                      <Plus className="btn-icon" />
                      Add
                    </button>
                  </li>
                ))}
              </ul>
              <button 
                className="btn-secondary reset-recommendations-btn" 
                onClick={() => setRecommendations(null)}
              >
                Get New Recommendations
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookListDetail
