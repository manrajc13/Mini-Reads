"use client"

import { useState, useContext, useEffect } from "react"
import { BookListContext } from "../context/BookListContext"
import { Calendar, BookOpen, Filter, Search, BookMarked, CalendarDays, BookText, X, Star, BookOpenCheck } from 'lucide-react'
import "./reading-history.css"

const ReadingHistory = () => {
  const { bookLists } = useContext(BookListContext)
  const [readBooks, setReadBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOption, setFilterOption] = useState("all")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [currentlyReading, setCurrentlyReading] = useState([])

  useEffect(() => {
    // Collect all read books from all lists
    const allReadBooks = []
    const currentBooks = []

    bookLists.forEach((list) => {
      list.books.forEach((book) => {
        if (book.isRead) {
          allReadBooks.push({
            ...book,
            listTitle: list.title,
            listId: list.id,
          })
        } else if (book.inProgress) {
          currentBooks.push({
            ...book,
            listTitle: list.title,
            listId: list.id,
          })
        }
      })
    })

    // Sort by read timestamp (newest first)
    allReadBooks.sort((a, b) => new Date(b.readTimestamp) - new Date(a.readTimestamp))

    setReadBooks(allReadBooks)
    setFilteredBooks(allReadBooks)
    setCurrentlyReading(currentBooks)
  }, [bookLists])

  useEffect(() => {
    let filtered = [...readBooks]

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter((book) => book.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Apply time filter
    if (filterOption !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (filterOption) {
        case "today":
          filterDate.setHours(0, 0, 0, 0)
          filtered = filtered.filter((book) => new Date(book.readTimestamp) >= filterDate)
          break
        case "week":
          filterDate.setDate(now.getDate() - 7)
          filtered = filtered.filter((book) => new Date(book.readTimestamp) >= filterDate)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          filtered = filtered.filter((book) => new Date(book.readTimestamp) >= filterDate)
          break
        case "year":
          filterDate.setFullYear(now.getFullYear() - 1)
          filtered = filtered.filter((book) => new Date(book.readTimestamp) >= filterDate)
          break
        default:
          break
      }
    }

    setFilteredBooks(filtered)
  }, [searchTerm, filterOption, readBooks])

  const formatReadDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRelativeTime = (timestamp) => {
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })
    const now = new Date()
    const readDate = new Date(timestamp)
    const diffInMs = readDate - now

    const diffInSecs = Math.floor(diffInMs / 1000)
    const diffInMins = Math.floor(diffInSecs / 60)
    const diffInHours = Math.floor(diffInMins / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (Math.abs(diffInDays) > 30) {
      return formatReadDate(timestamp)
    } else if (Math.abs(diffInDays) > 0) {
      return rtf.format(-diffInDays, "day")
    } else if (Math.abs(diffInHours) > 0) {
      return rtf.format(-diffInHours, "hour")
    } else if (Math.abs(diffInMins) > 0) {
      return rtf.format(-diffInMins, "minute")
    } else {
      return rtf.format(-diffInSecs, "second")
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
  }

  const renderRatingStars = (rating) => {
    if (!rating) return null;
    
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} size={14} className={i <= rating ? "star-filled" : "star-empty"} />)
    }
    return stars
  }

  // Get unique list count from read books
  const getUniqueListCount = () => {
    if (!readBooks.length) return 0;
    return new Set(readBooks.map(book => book.listId)).size;
  }

  return (
    <div className="reading-history-wrapper">
      <div className="reading-history-container">
        <div className="reading-history-header">
          <h1>Reading Journey</h1>
          <p>Track your literary adventures and discover your reading patterns over time</p>
        </div>

        <div className="reading-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen size={20} />
            </div>
            <div className="stat-content">
              <h3>{readBooks.length}</h3>
              <p>Books Completed</p>
            </div>
          </div>

          {readBooks.length > 0 && (
            <>
              <div className="stat-card">
                <div className="stat-icon">
                  <CalendarDays size={20} />
                </div>
                <div className="stat-content">
                  <h3>{formatReadDate(readBooks[0].readTimestamp).split(",")[0]}</h3>
                  <p>Last Finished</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  <BookText size={20} />
                </div>
                <div className="stat-content">
                  <h3>{getUniqueListCount()}</h3>
                  <p>Reading Lists</p>
                </div>
              </div>
            </>
          )}
          
          {currentlyReading.length > 0 && (
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpenCheck size={20} />
              </div>
              <div className="stat-content">
                <h3>{currentlyReading.length}</h3>
                <p>Currently Reading</p>
              </div>
            </div>
          )}
        </div>

        {currentlyReading.length > 0 && (
          <div className="currently-reading-section">
            <h2>Currently Reading</h2>
            <div className="currently-reading-grid">
              {currentlyReading.map((book) => (
                <div className="current-book-card" key={book.id}>
                  <div className="book-cover-placeholder">
                    <BookOpenCheck size={32} />
                  </div>
                  <div className="current-book-info">
                    <h3>{book.name}</h3>
                    {book.author && <p className="book-author">by {book.author}</p>}
                    {book.progress && (
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${book.progress}%` }}></div>
                        </div>
                        <span className="progress-text">{book.progress}%</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="filter-controls">
          <div className={`search-box ${isSearchFocused ? "search-focused" : ""}`}>
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {searchTerm && (
              <button className="clear-search-btn" onClick={clearSearch} aria-label="Clear search">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="filter-dropdown">
            <Filter className="filter-icon" size={18} />
            <select
              value={filterOption}
              onChange={(e) => setFilterOption(e.target.value)}
              aria-label="Filter by time period"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        <div className="reading-history-title">
          <h2>Reading History</h2>
          <p>{filteredBooks.length} books completed</p>
        </div>

        <div className="books-timeline">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => (
              <div className="timeline-item" key={book.id}>
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    <Calendar className="timeline-icon" size={16} />
                    <span>{formatReadDate(book.readTimestamp)}</span>
                  </div>
                  <div className="timeline-book">
                    <h3>{book.name}</h3>
                    <div className="book-meta">
                      <div className="book-list-badge">
                        <BookText size={14} />
                        <span>{book.listTitle}</span>
                      </div>
                      {book.author && (
                        <div className="book-author">
                          <span>by {book.author}</span>
                        </div>
                      )}
                      {book.rating && (
                        <div className="book-rating">{renderRatingStars(book.rating)}</div>
                      )}
                    </div>
                    {book.description && <p className="book-description">{book.description}</p>}
                    {book.notes && (
                      <div className="book-notes">
                        <h4>My Notes</h4>
                        <p>{book.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-history">
              <div className="no-history-icon">
                <BookMarked size={32} />
              </div>
              <h3>No reading history found</h3>
              {searchTerm || filterOption !== "all" ? (
                <button
                  className="clear-filters-btn"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterOption("all")
                  }}
                >
                  Clear Filters
                </button>
              ) : (
                <p className="no-history-tip">Mark books as read to start tracking your reading journey</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReadingHistory
