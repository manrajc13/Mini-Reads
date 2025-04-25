import express from "express"
import BookList from "../models/BookList.js"

const router = express.Router()

// Get all book lists for a user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const bookLists = await BookList.find({ userId })
    res.json(bookLists)
  } catch (error) {
    console.error("Error fetching book lists:", error)
    res.status(500).json({ error: "Failed to fetch book lists" })
  }
})

// Create a new book list
router.post("/", async (req, res) => {
  try {
    const { title, userId } = req.body

    const newBookList = new BookList({
      id: Date.now(),
      title,
      books: [],
      userId,
    })

    const savedBookList = await newBookList.save()
    res.status(201).json(savedBookList)
  } catch (error) {
    console.error("Error creating book list:", error)
    res.status(500).json({ error: "Failed to create book list" })
  }
})

// Delete a book list
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    await BookList.findOneAndDelete({ id: Number.parseInt(id) })
    res.json({ message: "Book list deleted successfully" })
  } catch (error) {
    console.error("Error deleting book list:", error)
    res.status(500).json({ error: "Failed to delete book list" })
  }
})

// Add a book to a list
router.post("/:id/books", async (req, res) => {
  try {
    const { id } = req.params
    const { bookName } = req.body

    const bookList = await BookList.findOne({ id: Number.parseInt(id) })

    if (!bookList) {
      return res.status(404).json({ error: "Book list not found" })
    }

    // Check if book already exists
    const bookExists = bookList.books.some((book) => book.name === bookName)

    if (!bookExists) {
      bookList.books.push({
        id: Date.now(),
        name: bookName,
        isEditing: false,
        isRead: false,
        readTimestamp: null,
      })

      await bookList.save()
    }

    res.json(bookList)
  } catch (error) {
    console.error("Error adding book:", error)
    res.status(500).json({ error: "Failed to add book" })
  }
})

// Delete a book from a list
router.delete("/:listId/books/:bookId", async (req, res) => {
  try {
    const { listId, bookId } = req.params

    const bookList = await BookList.findOne({ id: Number.parseInt(listId) })

    if (!bookList) {
      return res.status(404).json({ error: "Book list not found" })
    }

    bookList.books = bookList.books.filter((book) => book.id !== Number.parseInt(bookId))

    await bookList.save()
    res.json(bookList)
  } catch (error) {
    console.error("Error deleting book:", error)
    res.status(500).json({ error: "Failed to delete book" })
  }
})

// Toggle edit mode for a book
router.patch("/:listId/books/:bookId/toggle-edit", async (req, res) => {
  try {
    const { listId, bookId } = req.params

    const bookList = await BookList.findOne({ id: Number.parseInt(listId) })

    if (!bookList) {
      return res.status(404).json({ error: "Book list not found" })
    }

    const book = bookList.books.find((book) => book.id === Number.parseInt(bookId))

    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }

    book.isEditing = !book.isEditing

    await bookList.save()
    res.json(bookList)
  } catch (error) {
    console.error("Error toggling edit mode:", error)
    res.status(500).json({ error: "Failed to toggle edit mode" })
  }
})

// Update a book name
router.patch("/:listId/books/:bookId", async (req, res) => {
  try {
    const { listId, bookId } = req.params
    const { newName } = req.body

    const bookList = await BookList.findOne({ id: Number.parseInt(listId) })

    if (!bookList) {
      return res.status(404).json({ error: "Book list not found" })
    }

    const book = bookList.books.find((book) => book.id === Number.parseInt(bookId))

    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }

    book.name = newName
    book.isEditing = false

    await bookList.save()
    res.json(bookList)
  } catch (error) {
    console.error("Error updating book name:", error)
    res.status(500).json({ error: "Failed to update book name" })
  }
})

// Mark a book as read
router.patch("/:listId/books/:bookId/mark-read", async (req, res) => {
  try {
    const { listId, bookId } = req.params

    const bookList = await BookList.findOne({ id: Number.parseInt(listId) })

    if (!bookList) {
      return res.status(404).json({ error: "Book list not found" })
    }

    const book = bookList.books.find((book) => book.id === Number.parseInt(bookId))

    if (!book) {
      return res.status(404).json({ error: "Book not found" })
    }

    book.isRead = true
    book.readTimestamp = new Date()

    await bookList.save()
    res.json(bookList)
  } catch (error) {
    console.error("Error marking book as read:", error)
    res.status(500).json({ error: "Failed to mark book as read" })
  }
})

// Get reading history for a user
router.get("/:userId/reading-history", async (req, res) => {
  try {
    const { userId } = req.params
    const bookLists = await BookList.find({ userId })

    // Extract all read books with their list information
    const readingHistory = []

    bookLists.forEach((list) => {
      list.books.forEach((book) => {
        if (book.isRead) {
          readingHistory.push({
            bookId: book.id,
            bookName: book.name,
            listId: list.id,
            listTitle: list.title,
            readTimestamp: book.readTimestamp,
          })
        }
      })
    })

    // Sort by read timestamp (newest first)
    readingHistory.sort((a, b) => new Date(b.readTimestamp) - new Date(a.readTimestamp))

    res.json(readingHistory)
  } catch (error) {
    console.error("Error fetching reading history:", error)
    res.status(500).json({ error: "Failed to fetch reading history" })
  }
})

export default router
