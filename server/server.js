import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/userRoutes.js"
import bookListRoutes from "./routes/bookListRoutes.js"
import authRoutes from "./routes/authRoutes.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/booklists", bookListRoutes)
app.use("/api/auth", authRoutes)

// Book recommendation route (keeping existing functionality)
app.post("/recommend_books", async (req, res) => {
  try {
    // Simulate the existing recommendation functionality
    const { query } = req.body
    console.log("Recommendation query:", query)

    // Mock response (same as the existing one)
    const mockResponse = {
      recommendations: [
        {
          author: "Isabel Allende",
          description:
            "9780060924980 Selling more than 65,000 copies and topping bestseller lists around the world -- including Spain, Germany, Italy, and Latin America -- this novel tells the engrossing story of one man's quest for love and for his soul.",
          title: "The Infinite Plan A Novel",
        },
        {
          author: "Clive Barker",
          description:
            "9780061094156 The magical tale of ill-fated lovers lost among worlds teetering on the edge of destruction, where their passion holds the key to escape. There has never been a book like Imajica. Transforming every expectation offantasy fiction with its heady mingling of radical sexuality and spiritual anarchy, it has carried its millions of readers into regions of passion and philosophy that few books have even attempted to map. It's an epic in every way; vast in conception, obsessively detailed in execution, and apocalyptic in its resolution. A book of erotic mysteries and perverse violence. A book of ancient, mythological landscapes and even more ancient magic.",
          title: "Imajica II The Reconciliation",
        },
        {
          author: "Philip Roth",
          description:
            '9780099801900 A famous writer and his mistress meet in a room without a bed. They talk, they play games with each other, they have sex, they tell lies. This work since "Complaint", explores adultery and the unmasking of illicit lovers in a novel that exposes the tenderness and uncertainty underlying all affairs of the heart.',
          title: "Deception",
        },
        {
          author: "Luigi Pirandello",
          description:
            "9780140189223 Accompanied by two additional plays, presents the classic drama about literature and reality in which six characters involved in their own family drama come to life at a theater in the midst of a rehearsal, insisting that the theatrical company complete their story.",
          title: "Six Characters in Search of an Author and Other Plays",
        },
        {
          author: "Gustave Flaubert and Geoffrey Wall",
          description:
            "9780140449129 An unhappily married woman, Emma Bovary's unfulfilled dreams of romantic love and desperation to escape the ordinary boredom of her life lead her to a series of desperate acts, including adultery, in a classic novel set against the backdrop of nineteenth-",
          title: "Madame Bovary",
        },
      ],
    }

    res.json(mockResponse)
  } catch (error) {
    console.error("Error in recommendation route:", error)
    res.status(500).json({ error: "Failed to get recommendations" })
  }
})

// Book info route (keeping existing functionality)
app.post("/get_book_info", async (req, res) => {
  try {
    const { title } = req.body
    console.log("Book info request for:", title)

    // Mock response with sample book info
    const bookInfo = {
      title: title,
      author: "Sample Author",
      description: "This is a sample book description for the requested title.",
      rating: 4.5,
      genres: "['Fiction', 'Adventure', 'Fantasy']",
      coverImg: "/placeholder.svg?height=400&width=300",
    }

    res.json({ book_info: bookInfo })
  } catch (error) {
    console.error("Error in book info route:", error)
    res.status(500).json({ error: "Failed to get book information" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
