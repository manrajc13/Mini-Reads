"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { BookListContext } from "../context/BookListContext"
import { Plus, Edit2, Trash2, Save, X, BookOpen, Loader, Check, BookMarked, Search, ChevronRight } from 'lucide-react'
import { useNavigate } from "react-router-dom"
import "./BookListDetail.css"

const BookListDetail = ({ bookList, onClose }) => {
  const [newBookName, setNewBookName] = useState("")
  const [editBookName, setEditBookName] = useState("")
  const [recommendations, setRecommendations] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { addBook, deleteBook, toggleEditBook, updateBookName, markBookAsRead } = useContext(BookListContext)
  const modalRef = useRef()
  const navigate = useNavigate()

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

  const formatReadDate = (timestamp) => {
    if (!timestamp) return null
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getRecommendations = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // Extract just the book names for the API request
      const bookNames = bookList.books.map((book) => book.name)
      // console.log(bookNames)

      // Replace with your actual API endpoint
      const response = await fetch("http://127.0.0.1:5000/recommend_books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: bookNames }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations")
      }

      const data = await response.json()
      setRecommendations(data.recommendations)
    } catch (err) {
      console.error("Error fetching recommendations:", err)
      setError("Failed to get recommendations. Please try again later.")
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
        recommendations: [
          {
            author: "Isabel Allende",
            description:
              "9780060924980 Selling more than 65,000 copies and topping bestseller lists around the world -- including Spain, Germany, Italy, and Latin America -- this novel tells the engrossing story of one man's quest for love and for his soul.",
            title: "The Infinite Plan A Novel",
          },
          {
            author: "Clive Barker",
            description:
              "9780061094156 The magical tale of ill-fated lovers lost among worlds teetering on the edge of destruction, where their passion holds the key to escape. There has never been a book like Imajica. Transforming every expectation offantasy fiction with its heady mingling of radical sexuality and spiritual anarchy, it has carried its millions of readers into regions of passion and philosophy that few books have even attempted to map. It's an epic in every way; vast in conception, obsessively detailed in execution, and apocalyptic in its resolution. A book of erotic mysteries and perverse violence. A book of ancient, mythological landscapes and even more ancient magic.",
            title: "Imajica II The Reconciliation",
          },
          {
            author: "Philip Roth",
            description:
              '9780099801900 A famous writer and his mistress meet in a room without a bed. They talk, they play games with each other, they have sex, they tell lies. This work since "Complaint", explores adultery and the unmasking of illicit lovers in a novel that exposes the tenderness and uncertainty underlying all affairs of the heart.',
            title: "Deception",
          },
          {
            author: "Luigi Pirandello",
            description:
              "9780140189223 Accompanied by two additional plays, presents the classic drama about literature and reality in which six characters involved in their own family drama come to life at a theater in the midst of a rehearsal, insisting that the theatrical company complete their story.",
            title: "Six Characters in Search of an Author and Other Plays",
          },
          {
            author: "Gustave Flaubert and Geoffrey Wall",
            description:
              "9780140449129 An unhappily married woman, Emma Bovary's unfulfilled dreams of romantic love and desperation to escape the ordinary boredom of her life lead her to a series of desperate acts, including adultery, in a classic novel set against the backdrop of nineteenth-",
            title: "Madame Bovary",
          },
        ],
      }
      // const bookNames = bookList.books.map(book => book.name)
      // console.log(bookNames)
      setRecommendations(mockResponse.recommendations)
      setIsLoading(false)
    }, 1500)
  }

  // In BookListDetail.jsx, modify the handleBookClick function



  const handleBookClick = (book) => {
    const bookTitle = book.title || book.name
    navigate(`/book/${encodeURIComponent(bookTitle)}`)
    onClose()
  }

  return (
    <div className="book-modal-overlay">
      <div className="book-modal" ref={modalRef}>
        <header className="book-modal-header">
          <h2>{bookList.title}</h2>
          <button className="book-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </header>

        <div className="book-modal-content">
          <form onSubmit={handleAddBook} className="book-add-form">
            <div className="book-search-container">
              <Search size={16} className="book-search-icon" />
              <input
                type="text"
                value={newBookName}
                onChange={(e) => setNewBookName(e.target.value)}
                placeholder="Add a book to your collection..."
                className="book-add-input"
              />
            </div>
            <button type="submit" className="book-btn book-btn-primary" disabled={!newBookName.trim()}>
              <Plus size={16} />
              <span>Add</span>
            </button>
          </form>

          <div className="book-tabs">
            <button className="book-tab book-tab-active">My Books ({bookList.books.length})</button>
            <button className="book-tab" onClick={getRecommendations} disabled={isLoading || recommendations}>
              Recommendations
            </button>
          </div>

          {!recommendations && (
            <div className="book-list-container">
              {bookList.books.length > 0 ? (
                <ul className="book-list">
                  {bookList.books.map((book) => (
                    <li key={book.id} className={`book-item ${book.isRead ? 'book-read' : ''}`}>
                      {book.isEditing ? (
                        <div className="book-edit-form">
                          <input
                            type="text"
                            defaultValue={book.name}
                            onChange={(e) => setEditBookName(e.target.value)}
                            autoFocus
                            className="book-edit-input"
                          />
                          <div className="book-edit-actions">
                            <button 
                              className="book-btn book-btn-icon book-btn-success" 
                              onClick={() => handleUpdateBook(book.id)}
                              title="Save"
                            >
                              <Save size={16} />
                            </button>
                            <button 
                              className="book-btn book-btn-icon book-btn-neutral" 
                              onClick={() => toggleEditBook(bookList.id, book.id)}
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="book-info" >
                            <div className="book-title-container">
                              <span className="book-title">{book.name}</span>
                              {book.isRead && <Check size={14} className="book-read-icon" />}
                            </div>
                            {book.isRead && (
                              <span className="book-read-date">
                                Read on {formatReadDate(book.readTimestamp)}
                              </span>
                            )}
                          </div>
                          <div className="book-actions">
                            {!book.isRead && (
                              <button 
                                className="book-btn book-btn-icon book-btn-success" 
                                onClick={() => markBookAsRead(bookList.id, book.id)}
                                title="Mark as read"
                              >
                                <BookMarked size={16} />
                              </button>
                            )}
                            <button 
                              className="book-btn book-btn-icon book-btn-neutral" 
                              onClick={() => {
                                setEditBookName(book.name)
                                toggleEditBook(bookList.id, book.id)
                              }}
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              className="book-btn book-btn-icon book-btn-danger" 
                              onClick={() => deleteBook(bookList.id, book.id)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="book-empty-state">
                  <BookOpen size={32} />
                  <p>Your collection is empty</p>
                  <span>Add your first book using the form above</span>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="book-loading">
              <Loader size={24} className="book-spinner" />
              <p>Finding books you might enjoy...</p>
            </div>
          )}

          {error && (
            <div className="book-error">
              <p>{error}</p>
              <button className="book-btn book-btn-primary" onClick={simulateApiCall}>
                Try Again
              </button>
            </div>
          )}

          {recommendations && (
            <div className="book-recommendations">
              <div className="book-recommendations-header">
                <h3>Recommended Books</h3>
                <button 
                  className="book-btn book-btn-text" 
                  onClick={() => setRecommendations(null)}
                >
                  Back to my books
                </button>
              </div>
              
              <ul className="book-recommendations-list">
                {recommendations.map((book, index) => (
                  <li key={index} className="book-recommendation-item" onClick={() => handleBookClick(book)}>
                    <div className="book-recommendation-content">
                      <h4>{book.title}</h4>
                      <p className="book-recommendation-author">by {book.author}</p>
                      <p className="book-recommendation-description">
                        {book.description.replace(/^[0-9]{13}\s/, "")}
                      </p>
                    </div>
                    <button
                      className="book-btn book-btn-circle"
                      onClick={(e) => {
                        e.stopPropagation();
                        addBook(bookList.id, `${book.title} by ${book.author}`);
                      }}
                      title="Add to collection"
                    >
                      <Plus size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookListDetail
