import bcrypt from 'bcrypt'
import User from '../models/User.js'

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body
    // Validate input
    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    })

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'Username or email already exists' })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new User({
      username,
      hashedPassword,
      email,
      displayName: `${firstName} ${lastName}`
    })

    await newUser.save()

    return res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
