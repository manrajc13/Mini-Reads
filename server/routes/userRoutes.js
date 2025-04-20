import express from "express"
import User from "../models/User.js"

const router = express.Router()

// Get user by ID
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findOne({ userId })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    res.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Create or update user
router.post("/", async (req, res) => {
  try {
    const { userId, name, email, genres } = req.body

    let user = await User.findOne({ userId })

    if (user) {
      // Update existing user
      user.name = name || user.name
      user.email = email || user.email
      if (genres && genres.length > 0) {
        user.genres = genres
      }
    } else {
      // Create new user
      user = new User({
        userId,
        name,
        email,
        genres: genres || [],
      })
    }

    await user.save()
    res.status(201).json(user)
  } catch (error) {
    console.error("Error creating/updating user:", error)
    res.status(500).json({ error: "Failed to create/update user" })
  }
})

// Update user genres
router.patch("/:userId/genres", async (req, res) => {
  try {
    const { userId } = req.params
    const { genres } = req.body

    const user = await User.findOne({ userId })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    user.genres = genres
    await user.save()

    res.json(user)
  } catch (error) {
    console.error("Error updating user genres:", error)
    res.status(500).json({ error: "Failed to update user genres" })
  }
})

export default router
