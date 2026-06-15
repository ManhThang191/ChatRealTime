import bcrypt from 'bcrypt'
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import Session from '../models/Session.js'

const TOKEN_EXPIRATION = '1h' // Token expires in 1 hour
const REFRESH_TOKEN_EXPIRATION = '7d' // Refresh token expires in 7 days
const REFRESH_TOKEN_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

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
      email,
      hashedPassword,
      username,
      displayName: `${firstName} ${lastName}`
    })
    // console.log('BODY:', req.body)
    // console.log('username:', req.body.username)
    await newUser.save()

    return res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const signIn = async (req, res) => {
  try {
    const { username, password } = req.body
    // Validate input
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: 'Username and password are required' })
    }

    // Find the user by username
    const user = await User.findOne({ username })

    if (!user) {
      return res.status(401).json({ message: 'Invalid username' })
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    // access token
    const accessToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    )

    // refresh token
    const refreshToken = crypto.randomBytes(64).toString('hex').toString('hex')

    // Store the refresh token in the database
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL) // Set expiration for 7 days
    })

    // Set the access token and refresh token in HTTP-only cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      maxAge: REFRESH_TOKEN_TTL
    })

    // Set the access token in the response body
    return res
      .status(200)
      .json({ message: `${user.displayName} login successful`, accessToken })
  } catch (error) {
    console.error(error)
    return res
      .status(500)
      .json({ message: `Internal server error ${error.message}` })
  }
}

export const signOut = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken
    // Clear the refresh token cookie
    if (token) {
      await Session.findOneAndDelete({ refreshToken: token })

      res.clearCookie('refreshToken')
    }

    // Send a success response
    return res.status(200).json({ message: 'Logout successful' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// tao access token moi bang refresh token
export const refreshToken = async (req, res) => {
  try {
    // lay refresh token tu cookie
    const token = req.cookies?.refreshToken
    if (!token) {
      return res.status(401).json({ message: 'Refresh token not provided' })
    }

    //so sanh refresh token voi database
    const session = await Session.findOne({ refreshToken: token })
    if (!session) {
      return res
        .status(401)
        .json({ message: 'Invalid refresh token or expired' })
    }

    // kiem tra refresh token co het han hay chua
    if (session.expiresAt < new Date()) {
    }
    //tao access token moi neu refresh token hop le

    //return
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
