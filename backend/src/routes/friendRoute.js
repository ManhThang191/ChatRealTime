import express from 'express'
import {
  addFriend,
  acceptFriendRequest,
  declineFriendRequest,
  getAllFriends,
  getFriendRequests
} from '../controllers/FriendController.js'

const router = express.Router()

router.post('/requests/addFriend', addFriend)
router.post('/requests/:requestId/acceptFriendRequest', acceptFriendRequest)
router.post('/requests/:requestId/declineFriendRequest', declineFriendRequest)
router.get('/requests/:requestId/getAllFriends', getAllFriends)
router.get('/requests/getFriendRequests', getFriendRequests)

export default router
