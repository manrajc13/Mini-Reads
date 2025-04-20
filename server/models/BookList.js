import mongoose from "mongoose"

const bookSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
})

const bookListSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  books: [bookSchema],
  userId: {
    type: String,
    required: true,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const BookList = mongoose.model("BookList", bookListSchema)

export default BookList
