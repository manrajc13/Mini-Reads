"use client"

import { useState, useContext } from "react"
import { BookListContext } from "../context/BookListContext"
import BookList from "./BookList"
import CreateBookListModal from "./CreateBookListModal"
import BookListDetail from "./BookListDetail"
import { PlusCircle, RefreshCw } from "lucide-react"
import "./Home.css"

const Home = () => {
  const { bookLists, selectedBookList, setSelectedBookList, resetToInitialData } = useContext(BookListContext)
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div className="home">
      <header className="home-header">
        <h1>My Book Lists</h1>
        <div className="header-actions">
          <button className="btn-secondary reset-btn" onClick={resetToInitialData} title="Reset to initial data">
            <RefreshCw className="btn-icon" />
            Reset
          </button>
          <button className="btn-primary create-btn" onClick={() => setShowCreateModal(true)}>
            <PlusCircle className="btn-icon" />
            Create Book List
          </button>
        </div>
      </header>

      <div className="book-lists-container">
        {bookLists.length > 0 ? (
          <div className="book-lists-grid">
            {bookLists.map((bookList) => (
              <BookList key={bookList.id} bookList={bookList} onClick={() => setSelectedBookList(bookList)} />
            ))}
          </div>
        ) : (
          <div className="no-lists">
            <p>No book lists created yet</p>
            <p>Click "Create Book List" to get started</p>
          </div>
        )}
      </div>

      {showCreateModal && <CreateBookListModal onClose={() => setShowCreateModal(false)} />}

      {selectedBookList && <BookListDetail bookList={selectedBookList} onClose={() => setSelectedBookList(null)} />}
    </div>
  )
}

export default Home

