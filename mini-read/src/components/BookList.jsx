"use client"
import { useContext } from "react"
import { Book, Trash2 } from 'lucide-react'
import { BookListContext } from "../context/BookListContext"
import "./BookList.css"

const BookList = ({ bookList, onClick }) => {
  const { deleteBookList } = useContext(BookListContext)

  const handleDelete = (e) => {
    e.stopPropagation() // Prevent triggering the onClick of the parent
    deleteBookList(bookList.id)
  }

  return (
    <div className="book-list" onClick={onClick}>
      <div className="book-list-content">
        <div className="book-list-header">
          <Book className="book-list-icon" />
          <h3>{bookList.title}</h3>
        </div>
        <div className="book-list-footer">
          <p>
            {bookList.books.length} {bookList.books.length === 1 ? "book" : "books"}
          </p>
          <div className="book-list-actions">
            <div className="book-list-preview">
              {bookList.books.slice(0, 3).map((book, index) => (
                <div key={book.id} className="book-preview-item" style={{ zIndex: 3 - index }}>
                  {book.name.charAt(0)}
                </div>
              ))}
              {bookList.books.length > 3 && <div className="book-preview-more">+{bookList.books.length - 3}</div>}
            </div>
            <button className="delete-list-btn" onClick={handleDelete} aria-label="Delete book list">
              <Trash2 className="delete-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookList
