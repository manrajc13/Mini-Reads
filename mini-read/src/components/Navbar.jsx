"use client"

import { useState, useEffect, useRef, useContext } from "react"
import { Book, BookOpen, Library, Search, Loader, Plus } from "lucide-react"
import { UserButton } from "@clerk/clerk-react"
import { BookListContext } from "../context/BookListContext"
import AddToBookListModal from "./AddToBookListModal"
import "./Navbar.css"

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const searchRef = useRef(null)
  const { bookLists } = useContext(BookListContext)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (searchQuery.trim().length > 0) {
        handleSearch()
      } else {
        setSearchResults([])
        setShowResults(false)
      }
    }, 500) // Debounce search for 500ms

    return () => clearTimeout(searchTimer)
  }, [searchQuery])

  const handleSearch = async () => {
    if (searchQuery.trim() === "") return

    setIsLoading(true)
    setShowResults(true)

    try {
      // Mock API call with timeout
      // In a real app, replace this with actual fetch call to localhost:8000/search
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock response data
      const mockResults = [
        {
          author: "Isabel Allende",
          description:
            "9780060924980 Selling more than 65,000 copies and topping bestseller lists around the world -- including Spain, Germany, Italy, and Latin America -- this novel tells the engrossing story of one man's quest for love and for his soul.",
          title: "The Infinite Plan A Novel",
        },
        {
          author: "Gabriel García Márquez",
          description:
            "A tale of magic, love, and solitude spanning a hundred years in the life of the Buendía family.",
          title: "One Hundred Years of Solitude",
        },
        {
          author: "Haruki Murakami",
          description: "A young man's journey through a parallel universe in search of a mysterious sheep.",
          title: "A Wild Sheep Chase",
        },
      ]

      setSearchResults(mockResults)
    } catch (error) {
      console.error("Search error:", error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBook = (book) => {
    setSelectedBook(book)
  }

  const closeAddToListModal = () => {
    setSelectedBook(null)
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle("dark-mode")
  }

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Library className="logo-icon" />
          <span>Mini-Reads</span>
        </div>

        <div className="navbar-search" ref={searchRef}>
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() !== "" && setShowResults(true)}
          />

          {showResults && (
            <div className="search-results">
              {isLoading ? (
                <div className="search-loading">
                  <Loader className="loading-icon" />
                  <span>Searching...</span>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="search-results-list">
                  {searchResults.map((result, index) => (
                    <div key={index} className="search-result-item">
                      <div className="result-content">
                        <h4>{result.title}</h4>
                        <p className="result-author">by {result.author}</p>
                        <p className="result-description">{result.description}</p>
                      </div>
                      <button className="btn-primary add-recommendation-btn" onClick={() => handleAddBook(result)}>
                        <Plus className="btn-icon" />
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="search-no-results">
                  <p>No results found</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="navbar-links">
          <a href="#" className="navbar-link active">
            <BookOpen className="link-icon" />
            <span>Collections</span>
          </a>
          <a href="#" className="navbar-link">
            <Book className="link-icon" />
            <span>Discover</span>
          </a>
          <div className="navbar-user">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "user-button-avatar",
                  userButtonTrigger: "user-button-trigger",
                },
              }}
            />
          </div>
          {/* <button className="theme-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
          </button> */}
        </div>
      </div>

      {selectedBook && <AddToBookListModal book={selectedBook} onClose={closeAddToListModal} />}
    </nav>
  )
}

export default Navbar

