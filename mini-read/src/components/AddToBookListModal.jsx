"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { BookListContext } from "../context/BookListContext"
import { Plus, X, BookOpen, List } from "lucide-react"
import "./Add.css"

const AddToBookListModal = ({ book, onClose }) => {
  const [newListName, setNewListName] = useState("")
  const { bookLists, createBookList, addBook } = useContext(BookListContext)
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

  const handleCreateAndAdd = async (e) => {
    e.preventDefault()
    if (newListName.trim()) {
      const listId = await createBookList(newListName) // Get the new list's ID

      if (listId) {
        await addBook(listId, `${book.title} by ${book.author}`)
        onClose()
      }
    }
  }

  const handleAddToExistingList = (listId) => {
    addBook(listId, `${book.title} by ${book.author}`)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal add-to-list-modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Add to Book List</h2>
          <button className="close-btn" onClick={onClose}>
            <X className="close-icon" />
          </button>
        </div>

        <div className="modal-content">
          <div className="selected-book">
            <BookOpen className="book-icon" />
            <div className="book-info">
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
            </div>
          </div>

          {bookLists.length > 0 && (
            <div className="existing-lists">
              <h3 className="section-title">
                <List className="section-icon" />
                Your Book Lists
              </h3>
              <ul className="lists-container">
                {bookLists.map((list) => (
                  <li key={list.id} className="list-item" onClick={() => handleAddToExistingList(list.id)}>
                    <span className="list-name">{list.title}</span>
                    <span className="list-count">{list.books.length} books</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="create-new-list">
            <h3 className="section-title">
              <Plus className="section-icon" />
              Create New List
            </h3>
            <form onSubmit={handleCreateAndAdd} className="create-list-form">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Enter list name"
                className="list-name-input"
              />
              <button type="submit" className="btn-primary create-list-btn">
                <Plus className="btn-icon" />
                Create & Add
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddToBookListModal
