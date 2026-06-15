import express from 'express'
import {
  addFriend,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests
} from '../controllers/FriendController.js'
import { authenticateToken } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/requests/addFriend', authenticateToken, addFriend)
router.post(
  '/requests/:requestId/acceptFriendRequest',
  authenticateToken,
  acceptFriendRequest
)
router.post(
  '/requests/:requestId/declineFriendRequest',
  authenticateToken,
  declineFriendRequest
)
router.get(
  '/requests/:requestId/getAllFriends',
  authenticateToken,
  getAllFriends
)
router.get('/requests/getFriendRequests', authenticateToken, getFriendRequests)

export default router
