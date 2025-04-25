"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, Link } from "react-router-dom"
import { BookListContext } from "../context/BookListContext"
import { Calendar, Clock, ArrowLeft, BookOpen, BarChart2 } from "lucide-react"
import "./reading-details.css"

const ReadingDetails = () => {
  const { bookName } = useParams()
  const { bookLists } = useContext(BookListContext)
  const [bookDetails, setBookDetails] = useState(null)
  const [readingStats, setReadingStats] = useState({
    totalBooks: 0,
    readBooks: 0,
    readingRate: 0,
    averageDaysBetweenBooks: 0,
    readingStreak: 0,
  })

  useEffect(() => {
    // Find the book in all lists
    let foundBook = null
    let foundList = null

    for (const list of bookLists) {
      const book = list.books.find((b) => b.name === decodeURIComponent(bookName))
      if (book) {
        foundBook = { ...book }
        foundList = { ...list }
        break
      }
    }

    if (foundBook && foundList) {
      setBookDetails({
        ...foundBook,
        listTitle: foundList.title,
        listId: foundList.id,
      })
    }

    // Calculate reading stats
    calculateReadingStats()
  }, [bookName, bookLists])

  const calculateReadingStats = () => {
    // Collect all books
    const allBooks = []
    bookLists.forEach((list) => {
      list.books.forEach((book) => {
        allBooks.push(book)
      })
    })

    // Count read books
    const readBooks = allBooks.filter((book) => book.isRead)

    // Calculate reading rate (percentage of books read)
    const readingRate = allBooks.length > 0 ? Math.round((readBooks.length / allBooks.length) * 100) : 0

    // Calculate average days between reading books
    let averageDaysBetweenBooks = 0
    if (readBooks.length > 1) {
      // Sort by read timestamp
      const sortedBooks = [...readBooks].sort((a, b) => new Date(a.readTimestamp) - new Date(b.readTimestamp))

      let totalDays = 0
      for (let i = 1; i < sortedBooks.length; i++) {
        const prevDate = new Date(sortedBooks[i - 1].readTimestamp)
        const currDate = new Date(sortedBooks[i].readTimestamp)
        const diffTime = Math.abs(currDate - prevDate)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        totalDays += diffDays
      }

      averageDaysBetweenBooks = Math.round(totalDays / (sortedBooks.length - 1))
    }

    // Calculate current reading streak
    let readingStreak = 0
    if (readBooks.length > 0) {
      // Sort by read timestamp (newest first)
      const sortedBooks = [...readBooks].sort((a, b) => new Date(b.readTimestamp) - new Date(a.readTimestamp))

      const now = new Date()
      const lastReadDate = new Date(sortedBooks[0].readTimestamp)

      // Check if last book was read within the last 7 days
      const diffTime = Math.abs(now - lastReadDate)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays <= 7) {
        readingStreak = 1

        // Check for consecutive weeks with at least one book
        const weekMilliseconds = 7 * 24 * 60 * 60 * 1000
        let currentWeekStart = new Date(now)
        currentWeekStart.setDate(currentWeekStart.getDate() - 7)

        for (let i = 1; i < sortedBooks.length; i++) {
          const bookDate = new Date(sortedBooks[i].readTimestamp)

          // If book was read in the previous week, increase streak
          if (bookDate >= new Date(currentWeekStart - weekMilliseconds) && bookDate < currentWeekStart) {
            readingStreak++
            currentWeekStart = new Date(currentWeekStart - weekMilliseconds)
          } else if (bookDate < new Date(currentWeekStart - weekMilliseconds)) {
            // Book was read before the previous week, break the streak
            break
          }
        }
      }
    }

    setReadingStats({
      totalBooks: allBooks.length,
      readBooks: readBooks.length,
      readingRate,
      averageDaysBetweenBooks,
      readingStreak,
    })
  }

  const formatReadDate = (timestamp) => {
    if (!timestamp) return "Not read yet"
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!bookDetails) {
    return (
      <div className="reading-details-container">
        <div className="back-link">
          <Link to="/reading-history">
            <ArrowLeft className="back-icon" />
            Back to Reading History
          </Link>
        </div>
        <div className="book-not-found">
          <h2>Book Not Found</h2>
          <p>The book you're looking for doesn't exist or hasn't been read yet.</p>
          <Link to="/" className="btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="reading-details-container">
      <div className="back-link">
        <Link to="/reading-history">
          <ArrowLeft className="back-icon" />
          Back to Reading History
        </Link>
      </div>

      <div className="book-details-card">
        <div className="book-details-header">
          <h1>{bookDetails.name}</h1>
          <p>From list: {bookDetails.listTitle}</p>
        </div>

        <div className="read-details">
          <div className="read-detail-item">
            <Calendar className="detail-icon" />
            <div>
              <h3>Read Date</h3>
              <p>{formatReadDate(bookDetails.readTimestamp)}</p>
            </div>
          </div>

          <div className="read-detail-item">
            <Clock className="detail-icon" />
            <div>
              <h3>Time Since Read</h3>
              <p>{getTimeSinceRead(bookDetails.readTimestamp)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="reading-progress-section">
        <h2>Your Reading Progress</h2>

        <div className="progress-stats">
          <div className="progress-stat-card">
            <div className="progress-stat-icon">
              <BookOpen />
            </div>
            <div className="progress-stat-content">
              <h3>
                {readingStats.readBooks} / {readingStats.totalBooks}
              </h3>
              <p>Books Read</p>
            </div>
          </div>

          <div className="progress-stat-card">
            <div className="progress-stat-icon">
              <BarChart2 />
            </div>
            <div className="progress-stat-content">
              <h3>{readingStats.readingRate}%</h3>
              <p>Completion Rate</p>
            </div>
          </div>

          {readingStats.averageDaysBetweenBooks > 0 && (
            <div className="progress-stat-card">
              <div className="progress-stat-icon">
                <Calendar />
              </div>
              <div className="progress-stat-content">
                <h3>{readingStats.averageDaysBetweenBooks} days</h3>
                <p>Avg. Between Books</p>
              </div>
            </div>
          )}

          {readingStats.readingStreak > 0 && (
            <div className="progress-stat-card">
              <div className="progress-stat-icon">
                <Clock />
              </div>
              <div className="progress-stat-content">
                <h3>
                  {readingStats.readingStreak} {readingStats.readingStreak === 1 ? "week" : "weeks"}
                </h3>
                <p>Reading Streak</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="reading-suggestions">
        <h2>What to Read Next</h2>
        <p>Based on your reading history, you might enjoy these books:</p>

        <div className="suggestion-cards">
          {bookLists
            .flatMap((list) =>
              list.books
                .filter((book) => !book.isRead)
                .slice(0, 2)
                .map((book) => (
                  <div className="suggestion-card" key={book.id}>
                    <h3>{book.name}</h3>
                    <p>From list: {list.title}</p>
                    <button className="btn-secondary mark-read-btn">
                      <BookOpen className="btn-icon" />
                      Mark as Read
                    </button>
                  </div>
                )),
            )
            .slice(0, 3)}

          {bookLists.every((list) => list.books.every((book) => book.isRead)) && (
            <div className="no-suggestions">
              <p>You've read all your books! Time to add more to your collection.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function to calculate time since read
const getTimeSinceRead = (timestamp) => {
  if (!timestamp) return "Not read yet"

  const now = new Date()
  const readDate = new Date(timestamp)
  const diffInMs = now - readDate

  const diffInSecs = Math.floor(diffInMs / 1000)
  const diffInMins = Math.floor(diffInSecs / 60)
  const diffInHours = Math.floor(diffInMins / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInDays > 30) {
    const diffInMonths = Math.floor(diffInDays / 30)
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
  } else if (diffInDays > 0) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  } else if (diffInHours > 0) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  } else if (diffInMins > 0) {
    return `${diffInMins} ${diffInMins === 1 ? "minute" : "minutes"} ago`
  } else {
    return `${diffInSecs} ${diffInSecs === 1 ? "second" : "seconds"} ago`
  }
}

export default ReadingDetails
