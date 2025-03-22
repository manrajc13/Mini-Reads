"use client"

import { createContext, useState, useEffect } from "react"

// Initial dataset with sample book lists
const initialDataset = [
  
]

export const BookListContext = createContext()

export const BookListProvider = ({ children }) => {
  const [bookLists, setBookLists] = useState([])
  const [selectedBookList, setSelectedBookList] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load data from localStorage on initial render
  useEffect(() => {
    // Make sure we're in the browser environment before accessing localStorage
    if (typeof window !== 'undefined') {
      try {
        const storedBookLists = localStorage.getItem("bookLists")
        if (storedBookLists) {
          setBookLists(JSON.parse(storedBookLists))
        } else {
          // If no data in localStorage, use the initial dataset
          setBookLists(initialDataset)
        }
      } catch (error) {
        console.error("Error loading from localStorage:", error)
        // Fallback to initial dataset if there's an error
        setBookLists(initialDataset)
      } finally {
        setIsLoaded(true)
      }
    }
  }, [])

  // Save to localStorage whenever bookLists changes
  useEffect(() => {
    // Only save to localStorage if initial load is complete
    // and we're in the browser environment
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem("bookLists", JSON.stringify(bookLists))
      } catch (error) {
        console.error("Error saving to localStorage:", error)
      }
    }
  }, [bookLists, isLoaded])

  // Create a new book list
  const createBookList = (title) => {
    const newBookList = {
      id: Date.now(),
      title,
      books: [],
    }
    setBookLists([...bookLists, newBookList])
  }

  // Delete a book list
  const deleteBookList = (listId) => {
    const updatedBookLists = bookLists.filter(list => list.id !== listId)
    setBookLists(updatedBookLists)
    
    // If the deleted list was selected, clear the selection
    if (selectedBookList && selectedBookList.id === listId) {
      setSelectedBookList(null)
    }
  }

  // Add a book to a list
  const addBook = (listId, bookName) => {
    const updatedBookLists = bookLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          books: [...list.books, { id: Date.now(), name: bookName, isEditing: false }],
        }
      }
      return list
    })

    setBookLists(updatedBookLists)

    // Update selectedBookList if it's the one being modified
    if (selectedBookList && selectedBookList.id === listId) {
      const updatedList = updatedBookLists.find((list) => list.id === listId)
      setSelectedBookList(updatedList)
    }
  }

  // Delete a book from a list
  const deleteBook = (listId, bookId) => {
    const updatedBookLists = bookLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          books: list.books.filter((book) => book.id !== bookId),
        }
      }
      return list
    })

    setBookLists(updatedBookLists)

    // Update selectedBookList if it's the one being modified
    if (selectedBookList && selectedBookList.id === listId) {
      const updatedList = updatedBookLists.find((list) => list.id === listId)
      setSelectedBookList(updatedList)
    }
  }

  // Toggle edit mode for a book
  const toggleEditBook = (listId, bookId) => {
    const updatedBookLists = bookLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          books: list.books.map((book) => {
            if (book.id === bookId) {
              return { ...book, isEditing: !book.isEditing }
            }
            return book
          }),
        }
      }
      return list
    })

    setBookLists(updatedBookLists)

    // Update selectedBookList if it's the one being modified
    if (selectedBookList && selectedBookList.id === listId) {
      const updatedList = updatedBookLists.find((list) => list.id === listId)
      setSelectedBookList(updatedList)
    }
  }

  // Update a book name
  const updateBookName = (listId, bookId, newName) => {
    const updatedBookLists = bookLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          books: list.books.map((book) => {
            if (book.id === bookId) {
              return { ...book, name: newName, isEditing: false }
            }
            return book
          }),
        }
      }
      return list
    })

    setBookLists(updatedBookLists)

    // Update selectedBookList if it's the one being modified
    if (selectedBookList && selectedBookList.id === listId) {
      const updatedList = updatedBookLists.find((list) => list.id === listId)
      setSelectedBookList(updatedList)
    }
  }

  // Reset to initial dataset
  const resetToInitialData = () => {
    setBookLists(initialDataset)
    setSelectedBookList(null)
  }

  // If we're still in server-side rendering or initial load,
  // return a loading state or empty provider
  if (typeof window === 'undefined' || !isLoaded) {
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
