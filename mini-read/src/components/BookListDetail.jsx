"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { BookListContext } from "../context/BookListContext"
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  BookOpen,
  Loader,
  Check,
  BookMarked,
  Search,
  Library,
  BookCopy,
  Clock,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import "./BookListDetail.css"

const BookListDetail = ({ bookList, onClose }) => {
  // Add this to your existing state declarations at the top
  const [loadingBookActions, setLoadingBookActions] = useState({});
  const [newBookName, setNewBookName] = useState("")
  const [editBookName, setEditBookName] = useState("")
  const [recommendations, setRecommendations] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("myBooks")
  const { addBook, deleteBook, toggleEditBook, updateBookName, markBookAsRead } = useContext(BookListContext)
  const modalRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose()
      }
    }

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [onClose])

  const handleAddBook = (e) => {
    e.preventDefault()
    if (newBookName.trim()) {
      addBook(bookList.id, newBookName)
      setNewBookName("")
    }
  }

  const handleUpdateBook = async (bookId) => {
    if (editBookName.trim()) {
      setLoadingBookActions(prev => ({ ...prev, [bookId]: 'edit' }));
      await updateBookName(bookList.id, bookId, editBookName);
      setLoadingBookActions(prev => ({ ...prev, [bookId]: null }));
    } else {
      toggleEditBook(bookList.id, bookId);
    }
  };
  

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
    setActiveTab("recommendations")

    try {
      // Extract just the book names for the API request
      const bookNames = bookList.books.map((book) => book.name)

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
      simulateApiCall() // For demo purposes
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
      setRecommendations(mockResponse.recommendations)
      setIsLoading(false)
    }, 1500)
  }
  const handleDeleteBook = async (bookId) => {
    setLoadingBookActions(prev => ({ ...prev, [bookId]: 'delete' }));
    await deleteBook(bookList.id, bookId);
    setLoadingBookActions(prev => ({ ...prev, [bookId]: null }));
  };
  
  const handleMarkAsRead = async (bookId) => {
    setLoadingBookActions(prev => ({ ...prev, [bookId]: 'read' }));
    await markBookAsRead(bookList.id, bookId);
    setLoadingBookActions(prev => ({ ...prev, [bookId]: null }));
  };
  const handleBookClick = (book) => {
    const bookTitle = book.title || book.name
    navigate(`/book/${encodeURIComponent(bookTitle)}`)
    onClose()
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === "recommendations" && !recommendations && !isLoading) {
      getRecommendations()
    }
  }

  return (
    <div className="book-modal-overlay">
      <div className="book-modal" ref={modalRef}>
        <header className="book-modal-header">
          <div className="book-modal-title">
            <h2>{bookList.title}</h2>
            <span className="book-count">{bookList.books.length} books</span>
          </div>
          <button className="book-close-btn" onClick={onClose} aria-label="Close">
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
                aria-label="Book title"
              />
            </div>
            <button
              type="submit"
              className="book-btn book-btn-primary"
              disabled={!newBookName.trim()}
              aria-label="Add book"
            >
              <Plus size={16} />
              <span>Add</span>
            </button>
          </form>

          <div className="book-tabs">
            <button
              className={`book-tab ${activeTab === "myBooks" ? "book-tab-active" : ""}`}
              onClick={() => handleTabChange("myBooks")}
            >
              <Library size={16} className="book-tab-icon" />
              <span>My Books</span>
            </button>
            <button
              className={`book-tab ${activeTab === "recommendations" ? "book-tab-active" : ""}`}
              onClick={() => handleTabChange("recommendations")}
              disabled={isLoading}
            >
              <BookCopy size={16} className="book-tab-icon" />
              <span>Recommendations</span>
            </button>
          </div>

          {activeTab === "myBooks" && (
            <div className="book-list-container">
              {bookList.books.length > 0 ? (
                <ul className="book-list">
                  {bookList.books.map((book) => (
                    <li key={book.id} className={`book-item ${book.isRead ? "book-read" : ""}`}>
                      {book.isEditing ? (
                        <div className="book-edit-form">
                          <input
                            type="text"
                            defaultValue={book.name}
                            onChange={(e) => setEditBookName(e.target.value)}
                            autoFocus
                            className="book-edit-input"
                            aria-label="Edit book title"
                          />
                          <div className="book-edit-actions">
                            <button
                              className="book-btn book-btn-icon book-btn-success"
                              onClick={() => handleUpdateBook(book.id)}
                              title="Save"
                              aria-label="Save changes"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              className="book-btn book-btn-icon book-btn-neutral"
                              onClick={() => toggleEditBook(bookList.id, book.id)}
                              title="Cancel"
                              aria-label="Cancel editing"
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
                                <Clock size={12} className="book-date-icon" />
                                Read on {formatReadDate(book.readTimestamp)}
                              </span>
                            )}
                          </div>
                          <div className="book-actions">
                            {!book.isRead && (
                              <button
                                className="book-btn book-btn-icon book-btn-success"
                                onClick={() => handleMarkAsRead(book.id)}
                                title="Mark as read"
                                aria-label="Mark as read"
                                disabled={loadingBookActions[book.id] === 'read'}
                              >
                                {loadingBookActions[book.id] === 'read' ? (
                                  <Loader size={16} className="book-spinner" />
                                ) : (
                                  <BookMarked size={16} />
                                )}
                              </button>
                            )}
                            <button
                              className="book-btn book-btn-icon book-btn-neutral"
                              onClick={() => {
                                setEditBookName(book.name);
                                toggleEditBook(bookList.id, book.id);
                              }}
                              title="Edit"
                              aria-label="Edit book"
                              disabled={loadingBookActions[book.id] === 'edit'}
                            >
                              {loadingBookActions[book.id] === 'edit' ? (
                                <Loader size={16} className="book-spinner" />
                              ) : (
                                <Edit2 size={16} />
                              )}
                            </button>
                            <button
                              className="book-btn book-btn-icon book-btn-danger"
                              onClick={() => handleDeleteBook(book.id)}
                              title="Delete"
                              aria-label="Delete book"
                              disabled={loadingBookActions[book.id] === 'delete'}
                            >
                              {loadingBookActions[book.id] === 'delete' ? (
                                <Loader size={16} className="book-spinner" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="book-empty-state">
                  <div className="book-empty-icon">
                    <BookOpen size={32} />
                  </div>
                  <p>Your collection is empty</p>
                  <span>Add your first book using the form above</span>
                </div>
              )}
            </div>
          )}

          {isLoading && (
            <div className="book-loading">
              <div className="book-loading-spinner">
                <Loader size={24} className="book-spinner" />
              </div>
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

          {activeTab === "recommendations" && recommendations && (
            <div className="book-recommendations">
              <div className="book-recommendations-header">
                <h3>Recommended Books</h3>
                <p className="book-recommendations-subtitle">Based on your reading preferences</p>
              </div>

              <ul className="book-recommendations-list">
                {recommendations.map((book, index) => (
                  <li key={index} className="book-recommendation-item" onClick={() => handleBookClick(book)}>
                    <div className="book-recommendation-content">
                      <h4>{book.title}</h4>
                      <p className="book-recommendation-author">by {book.author}</p>
                      <p className="book-recommendation-description">{book.description.replace(/^[0-9]{13}\s/, "")}</p>
                    </div>
                    <button
                      className="book-btn book-btn-circle"
                      onClick={(e) => {
                        e.stopPropagation()
                        addBook(bookList.id, `${book.title} by ${book.author}`)
                      }}
                      title="Add to collection"
                      aria-label="Add to collection"
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
