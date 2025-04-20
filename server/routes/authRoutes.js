import express from "express"
import User from "../models/User.js"

const router = express.Router()

// Register new user
router.post("/register", async (req, res) => {
  try {
    const { userId, name, email, genres } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ userId })

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" })
    }

    // Create new user
    const newUser = new User({
      userId,
      name,
      email,
      genres: genres || [],
    })

    await newUser.save()
    res.status(201).json(newUser)
  } catch (error) {
    console.error("Error registering user:", error)
    res.status(500).json({ error: "Failed to register user" })
  }
})

export default router
