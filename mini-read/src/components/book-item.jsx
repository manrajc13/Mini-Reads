"use client"

import { useState } from "react"
import { Edit2, Trash2, Save, BookOpen, Check } from "lucide-react"
import "./book-item.css"

const BookItem = ({ book, bookListId, onEdit, onDelete, onUpdate, onMarkAsRead }) => {
  const [editBookName, setEditBookName] = useState("")

  const handleUpdateBook = () => {
    if (editBookName.trim()) {
      onUpdate(bookListId, book.id, editBookName)
    } else {
      onEdit(bookListId, book.id)
    }
  }

  const formatReadDate = (timestamp) => {
    if (!timestamp) return null
    const date = new Date(timestamp)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <li className="book-item">
      {book.isEditing ? (
        <div className="edit-book-form">
          <input type="text" defaultValue={book.name} onChange={(e) => setEditBookName(e.target.value)} autoFocus />
          <button className="btn-secondary save-btn" onClick={handleUpdateBook}>
            <Save className="btn-icon" />
            Save
          </button>
        </div>
      ) : (
        <>
          <div className="book-info">
            <span className="book-name">{book.name}</span>
            {book.isRead && (
              <div className="read-status">
                <Check className="read-icon" />
                <span className="read-date">Read on {formatReadDate(book.readTimestamp)}</span>
              </div>
            )}
          </div>
          <div className="book-actions">
            {!book.isRead && (
              <button className="btn-secondary mark-read-btn" onClick={() => onMarkAsRead(bookListId, book.id)}>
                <BookOpen className="btn-icon" />
                Mark as Read
              </button>
            )}
            <button
              className="btn-secondary edit-btn"
              onClick={() => {
                setEditBookName(book.name)
                onEdit(bookListId, book.id)
              }}
            >
              <Edit2 className="btn-icon" />
              Edit
            </button>
            <button className="btn-danger delete-btn" onClick={() => onDelete(bookListId, book.id)}>
              <Trash2 className="btn-icon" />
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  )
}

export default BookItem
