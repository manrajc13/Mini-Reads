"use client"

import { useState, useEffect } from "react"
import { Book, BookOpen, Library, Moon, Search, Sun, User } from 'lucide-react'
import "./Navbar.css"

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
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
  
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.body.classList.toggle("dark-mode")
  }
  
  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Library className="logo-icon" />
          <span>BookShelf</span>
        </div>
        
        <div className="navbar-search">
          <Search className="search-icon" />
          <input type="text" placeholder="Search books..." />
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
          <a href="#" className="navbar-link">
            <User className="link-icon" />
            <span>Profile</span>
          </a>
          <button className="theme-toggle" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="theme-icon" /> : <Moon className="theme-icon" />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
