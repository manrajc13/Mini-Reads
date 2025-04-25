"use client"

import { useState, useContext, useEffect } from "react"
import { BookListContext } from "../context/BookListContext"
import { Calendar, Clock, Book, Filter, Search } from "lucide-react"
import { Link } from "react-router-dom"
import "./reading-history.css"

const ReadingHistory = () => {
  const { bookLists } = useContext(BookListContext)
  const [readBooks, setReadBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterOption, setFilterOption] = useState("all")

  useEffect(() => {
    // Collect all read books from all lists
    const allReadBooks = []

    bookLists.forEach((list) => {
      list.books.forEach((book) => {
        if (book.isRead) {
          allReadBooks.push({
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

  return (
    <div className="reading-history-container">
      <div className="reading-history-header">
        <h1>Reading History</h1>
        <p>Track your reading journey and accomplishments</p>
      </div>

      <div className="reading-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Book />
          </div>
          <div className="stat-content">
            <h3>{readBooks.length}</h3>
            <p>Books Read</p>
          </div>
        </div>

        {readBooks.length > 0 && (
          <>
            <div className="stat-card">
              <div className="stat-icon">
                <Calendar />
              </div>
              <div className="stat-content">
                <h3>{formatReadDate(readBooks[0].readTimestamp).split(",")[0]}</h3>
                <p>Last Read</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <Clock />
              </div>
              <div className="stat-content">
                <h3>{getRelativeTime(readBooks[0].readTimestamp)}</h3>
                <p>Since Last Read</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="filter-controls">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown">
          <Filter className="filter-icon" />
          <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      <div className="books-timeline">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book, index) => (
            <div className="timeline-item" key={book.id}>
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-date">
                  <Calendar className="timeline-icon" />
                  <span>{formatReadDate(book.readTimestamp)}</span>
                </div>
                <div className="timeline-book">
                  <h3>{book.name}</h3>
                  <p>From list: {book.listTitle}</p>
                  {/* <Link to={`/book/${encodeURIComponent(book.name)}`} className="view-details-link">
                    View Details
                  </Link> */}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-history">
            <p>No reading history found</p>
            {searchTerm || filterOption !== "all" ? (
              <button
                className="btn-secondary clear-filters-btn"
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
  )
}

export default ReadingHistory
