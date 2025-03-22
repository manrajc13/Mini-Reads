"use client"

import { useState, useContext, useRef, useEffect } from "react"
import { BookListContext } from "../context/BookListContext"
import { X, BookPlus } from "lucide-react"
import "./Modal.css"

const CreateBookListModal = ({ onClose }) => {
  const [title, setTitle] = useState("")
  const { createBookList } = useContext(BookListContext)
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      createBookList(title)
      onClose()
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal" ref={modalRef}>
        <div className="modal-header">
          <h2>Create New Book List</h2>
          <button className="close-btn" onClick={onClose}>
            <X className="close-icon" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book list title"
              autoFocus
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary create-list-btn">
              <BookPlus className="btn-icon" />
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBookListModal

