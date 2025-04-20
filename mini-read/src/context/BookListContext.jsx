"use client"

import { createContext, useState, useEffect } from "react"
import { useAuth } from "@clerk/clerk-react"
import axios from "axios"

// API base URL
const API_BASE_URL = "http://localhost:5000/api"

// Initial dataset with sample book lists (used as fallback)
const initialDataset = []

export const BookListContext = createContext()

export const BookListProvider = ({ children }) => {
  const [bookLists, setBookLists] = useState([])
  const [selectedBookList, setSelectedBookList] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const { userId, isSignedIn } = useAuth()

  // Load data from MongoDB on initial render and when user changes
  useEffect(() => {
    const fetchBookLists = async () => {
      if (isSignedIn && userId) {
        try {
          const response = await axios.get(`${API_BASE_URL}/booklists/${userId}`)
          setBookLists(response.data)
        } catch (error) {
          console.error("Error loading book lists:", error)
          // Fallback to initial dataset if there's an error
          setBookLists(initialDataset)
        } finally {
          setIsLoaded(true)
        }
      }
    }

    if (isSignedIn && userId) {
      fetchBookLists()
    }
  }, [isSignedIn, userId])

  // Create a new book list
  const createBookList = async (title) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/booklists`, {
        title,
        userId,
      })

      const newBookList = response.data
      setBookLists((prevBookLists) => [...prevBookLists, newBookList])

      return newBookList.id
    } catch (error) {
      console.error("Error creating book list:", error)
      return null
    }
  }

  // Delete a book list
  const deleteBookList = async (listId) => {
    try {
      await axios.delete(`${API_BASE_URL}/booklists/${listId}`)

      const updatedBookLists = bookLists.filter((list) => list.id !== listId)
      setBookLists(updatedBookLists)

      // If the deleted list was selected, clear the selection
      if (selectedBookList && selectedBookList.id === listId) {
        setSelectedBookList(null)
      }
    } catch (error) {
      console.error("Error deleting book list:", error)
    }
  }

  // Add a book to a list
  const addBook = async (listId, bookName) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/booklists/${listId}/books`, {
        bookName,
      })

      const updatedList = response.data

      const updatedBookLists = bookLists.map((list) => {
        if (list.id === listId) {
          return updatedList
        }
        return list
      })

      setBookLists(updatedBookLists)

      // Update selectedBookList if it's the one being modified
      if (selectedBookList && selectedBookList.id === listId) {
        setSelectedBookList(updatedList)
      }
    } catch (error) {
      console.error("Error adding book:", error)
    }
  }

  // Delete a book from a list
  const deleteBook = async (listId, bookId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/booklists/${listId}/books/${bookId}`)

      const updatedList = response.data

      const updatedBookLists = bookLists.map((list) => {
        if (list.id === listId) {
          return updatedList
        }
        return list
      })

      setBookLists(updatedBookLists)

      // Update selectedBookList if it's the one being modified
      if (selectedBookList && selectedBookList.id === listId) {
        setSelectedBookList(updatedList)
      }
    } catch (error) {
      console.error("Error deleting book:", error)
    }
  }

  // Toggle edit mode for a book
  const toggleEditBook = async (listId, bookId) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/booklists/${listId}/books/${bookId}/toggle-edit`)

      const updatedList = response.data

      const updatedBookLists = bookLists.map((list) => {
        if (list.id === listId) {
          return updatedList
        }
        return list
      })

      setBookLists(updatedBookLists)

      // Update selectedBookList if it's the one being modified
      if (selectedBookList && selectedBookList.id === listId) {
        setSelectedBookList(updatedList)
      }
    } catch (error) {
      console.error("Error toggling edit mode:", error)
    }
  }

  // Update a book name
  const updateBookName = async (listId, bookId, newName) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/booklists/${listId}/books/${bookId}`, {
        newName,
      })

      const updatedList = response.data

      const updatedBookLists = bookLists.map((list) => {
        if (list.id === listId) {
          return updatedList
        }
        return list
      })

      setBookLists(updatedBookLists)

      // Update selectedBookList if it's the one being modified
      if (selectedBookList && selectedBookList.id === listId) {
        setSelectedBookList(updatedList)
      }
    } catch (error) {
      console.error("Error updating book name:", error)
    }
  }

  // Reset to initial dataset (for testing purposes)
  const resetToInitialData = async () => {
    try {
      // Delete all existing book lists
      for (const list of bookLists) {
        await axios.delete(`${API_BASE_URL}/booklists/${list.id}`)
      }

      setBookLists([])
      setSelectedBookList(null)
    } catch (error) {
      console.error("Error resetting data:", error)
    }
  }

  // If we're still in server-side rendering or initial load,
  // return a loading state or empty provider
  if (!isSignedIn || !isLoaded) {
    return (
      <BookListContext.Provider
        value={{
          bookLists: [],
          selectedBookList: null,
          setSelectedBookList: () => {},
          createBookList: () => {},
          deleteBookList: () => {},
          addBook: () => {},
          deleteBook: () => {},
          toggleEditBook: () => {},
          updateBookName: () => {},
          resetToInitialData: () => {},
        }}
      >
        {children}
      </BookListContext.Provider>
    )
  }

  return (
    <BookListContext.Provider
      value={{
        bookLists,
        selectedBookList,
        setSelectedBookList,
        createBookList,
        deleteBookList,
        addBook,
        deleteBook,
        toggleEditBook,
        updateBookName,
        resetToInitialData,
      }}
    >
      {children}
    </BookListContext.Provider>
  )
}
