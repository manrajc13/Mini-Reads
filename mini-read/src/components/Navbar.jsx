"use client"

import { useState, useEffect, useRef } from "react"
import { Book, BookOpen, Library, Search, Loader, Plus, ChevronDown, Check, X, Home, Clock } from "lucide-react"
import { UserButton } from "@clerk/clerk-react"
import { Link, useLocation } from "react-router-dom"
import "./navbar.css"
import AddToBookListModal from "./AddToBookListModal"

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [searchCriteria, setSearchCriteria] = useState("title") // Default search by title
  const [showDropdown, setShowDropdown] = useState(false)
  const [showGenreSelector, setShowGenreSelector] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState([])
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)
  const genreSelectorRef = useRef(null)
  const location = useLocation()

  // List of available genres
  const genres = [
    "Fiction",
    "Romance",
    "Fantasy",
    "Young Adult",
    "Contemporary",
    "Adult",
    "Audiobook",
    "Novels",
    "Mystery",
    "Historical Fiction",
    "Classics",
    "Adventure",
    "Nonfiction",
    "Historical",
    "Literature",
    "Paranormal",
    "Science Fiction",
    "Childrens",
    "Thriller",
    "Magic",
    "Humor",
    "Crime",
    "Suspense",
    "Contemporary Romance",
    "Chick Lit",
    "Urban Fantasy",
    "Science Fiction Fantasy",
    "Supernatural",
    "Mystery Thriller",
    "Middle Grade",
    "Adult Fiction",
    "Teen",
    "Paranormal Romance",
    "History",
    "Biography",
    "Horror",
    "Literary Fiction",
    "Realistic Fiction",
    "British Literature",
    "Drama",
    "Philosophy",
    "Short Stories",
    "New Adult",
    "Memoir",
    "Erotica",
    "20th Century",
    "Vampires",
    "War",
    "Religion",
    "American",
    "Family",
    "Juvenile",
    "School",
    "Graphic Novels",
    "Dystopia",
  ]

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

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }

      if (
        genreSelectorRef.current &&
        !genreSelectorRef.current.contains(event.target) &&
        !event.target.closest(".search-criteria-dropdown")
      ) {
        setShowGenreSelector(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (searchQuery.trim().length > 0 && searchCriteria !== "genres") {
        handleSearch()
      } else if (searchCriteria !== "genres") {
        setSearchResults([])
        setShowResults(false)
      }
    }, 500) // Debounce search for 500ms

    return () => clearTimeout(searchTimer)
  }, [searchQuery, searchCriteria])

  const handleSearch = async () => {
    if (
      (searchCriteria !== "genres" && searchQuery.trim() === "") ||
      (searchCriteria === "genres" && selectedGenres.length === 0)
    )
      return

    setIsLoading(true)
    setShowResults(true)

    try {
      // Send the query to backend in the specified format
      const response = await fetch("http://127.0.0.1:5000/search_books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchCriteria === "genres" ? "" : searchQuery,
          criteria: searchCriteria === "genres" ? selectedGenres : searchCriteria,
        }),
      })

      const data = await response.json()
      setSearchResults(data.search_results || [])
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

  const handleBookClick = (book) => {
    // Navigate to book details page with the book title
    window.location.href = `/book/${encodeURIComponent(book.title)}`
    setShowResults(false)
  }

  const handleCriteriaChange = (criteria) => {
    setSearchCriteria(criteria)
    setShowDropdown(false)

    if (criteria === "genres") {
      setShowGenreSelector(true)
      setSearchResults([])
      setShowResults(false)
    } else {
      setShowGenreSelector(false)
    }
  }

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre)
      } else {
        return [...prev, genre]
      }
    })
  }

  const handleGenreSearch = () => {
    if (selectedGenres.length > 0) {
      handleSearch()
      setShowGenreSelector(false)
    }
  }

  const getCriteriaLabel = () => {
    switch (searchCriteria) {
      case "title":
        return "Title"
      case "author":
        return "Author"
      case "genres":
        return "Genres"
      default:
        return "Title"
    }
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
          <div className="search-input-container">
            <input
              type="text"
              placeholder={`Search by ${searchCriteria === "genres" ? "selecting genres" : searchCriteria}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchCriteria !== "genres" && searchQuery.trim() !== "") {
                  setShowResults(true)
                }
              }}
              disabled={searchCriteria === "genres"}
            />
            <div className="search-criteria" ref={dropdownRef}>
              <button
                className="search-criteria-button"
                onClick={(e) => {
                  e.preventDefault()
                  setShowDropdown(!showDropdown)
                }}
              >
                {getCriteriaLabel()} <ChevronDown className={`dropdown-icon ${showDropdown ? "rotate-180" : ""}`} />
              </button>

              {showDropdown && (
                <div className="search-criteria-dropdown">
                  <div
                    className={`dropdown-item ${searchCriteria === "title" ? "active" : ""}`}
                    onClick={() => handleCriteriaChange("title")}
                  >
                    <Search size={16} />
                    Title
                  </div>
                  <div
                    className={`dropdown-item ${searchCriteria === "author" ? "active" : ""}`}
                    onClick={() => handleCriteriaChange("author")}
                  >
                    <Search size={16} />
                    Author
                  </div>
                  <div
                    className={`dropdown-item ${searchCriteria === "genres" ? "active" : ""}`}
                    onClick={() => handleCriteriaChange("genres")}
                  >
                    <Search size={16} />
                    Genres
                  </div>
                </div>
              )}
            </div>
          </div>

          {showGenreSelector && (
            <div className="genre-selector" ref={genreSelectorRef}>
              <div className="genre-selector-header">
                <h3>Select Genres</h3>
                <button className="close-genre-selector" onClick={() => setShowGenreSelector(false)}>
                  <X size={18} />
                </button>
              </div>
              <div className="genre-grid">
                {genres.map((genre) => (
                  <div
                    key={genre}
                    className={`genre-item ${selectedGenres.includes(genre) ? "selected" : ""}`}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    <span className="genre-name">{genre}</span>
                    {selectedGenres.includes(genre) && <Check className="genre-check" size={14} />}
                  </div>
                ))}
              </div>
              <div className="genre-selector-footer">
                <span className="selected-count">
                  {selectedGenres.length} {selectedGenres.length === 1 ? "genre" : "genres"} selected
                </span>
                <button
                  className="btn-primary search-genres-btn"
                  onClick={handleGenreSearch}
                  disabled={selectedGenres.length === 0}
                >
                  <Search size={14} />
                  Search
                </button>
              </div>
            </div>
          )}

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
                    <div key={index} className="search-result-item" onClick={() => handleBookClick(result)}>
                      <div className="result-content">
                        <h4>{result.title}</h4>
                        <p className="result-author">by {result.author}</p>
                      </div>
                      <button
                        className="btn-primary add-recommendation-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddBook(result)
                        }}
                      >
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
          <Link to="/landing" className={`home-button ${location.pathname === "/landing" ? "active" : ""}`}>
            <Home className="home-icon" />
            <span>Home</span>
          </Link>
          <Link to="/" className={`navbar-link ${location.pathname === "/" ? "active" : ""}`}>
            <BookOpen className="link-icon" />
            <span>Collections</span>
          </Link>
          <Link to="/discover" className={`navbar-link ${location.pathname === "/discover" ? "active" : ""}`}>
            <Book className="link-icon" />
            <span>Discover</span>
          </Link>
          <Link
              to="/reading-history"
              className={`navbar-link ${location.pathname === "/reading-history" ? "active" : ""}`}
              // onClick={closeMenu}
            >
              <Clock className="mobile-icon" />
              <span>Reading History</span>
            </Link>
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
        </div>
      </div>

      {selectedBook && <AddToBookListModal book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </nav>
  )
}

export default Navbar
