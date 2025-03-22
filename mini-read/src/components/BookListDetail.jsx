"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { BookListContext } from "../context/BookListContext"
import "./Modal.css"
import "./BookListDetail.css"

const BookListDetail = ({ bookList, onClose }) => {
  const [newBookName, setNewBookName] = useState("")
  const [editBookName, setEditBookName] = useState("")
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

  return (
    <div className="modal-overlay">
      <div className="modal book-detail-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>{bookList.title}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
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
                            Edit
                          </button>
                          <button className="btn-danger delete-btn" onClick={() => deleteBook(bookList.id, book.id)}>
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
        </div>
      </div>
    </div>
  )
}

export default BookListDetail

