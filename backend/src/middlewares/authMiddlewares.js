import jwt from 'jsonwebtoken'
import Session from '../models/Session.js'
import User from '../models/User.js'

export const protectRoute = async (req, res, next) => {
  try {
    // lay ascess token tu header
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' })
    }

    // xac nhan token hop le
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err)
          return res
            .status(403)
            .json({ message: 'Access token is not valid or expired' })
        }

        // tim user tu decoded token
        const user = await User.findById(decodedUser.userId).select(
          '-hashedPassword'
        )

        if (!user) {
          return res.status(404).json({ message: 'User not found' })
        }

        // gan user vao req de cac controller sau co the su dung
        req.user = user
        next()
      }
    )

    // tim user

    // tra ve user
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
