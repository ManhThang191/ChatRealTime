import Friend from '../models/Friend.js'
import User from '../models/User.js'
import FriendRequest from '../models/FriendRequest.js'

export const addFriend = async (req, res) => {
  try {
    const { to, message } = req.body
    const from = req.user._id

    if (from === to) {
      return res
        .status(400)
        .json({ message: 'You cannot send a friend request to yourself' })
    }

    const existingFriend = await User.findOne({ _id: to })
    if (!existingFriend) {
      return res.status(404).json({ message: 'User not found' })
    }

    console.log('to:', to)
    console.log('from:', from)

    let userA = from.toString()
    let userB = to.toString()
    if (userA > userB) {
      ;[userA, userB] = [userB, userA]
    }
    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from }
        ]
      })
    ])

    if (alreadyFriends) {
      return res.status(400).json({ message: 'You are already friends' })
    }

    if (existingRequest) {
      if (existingRequest.from.toString() === from) {
        return res.status(400).json({ message: 'Friend request already sent' })
      } else {
        return res
          .status(400)
          .json({ message: 'You have a pending friend request from this user' })
      }
    }

    const friendRequest = await FriendRequest.create({
      from,
      to,
      message
    })

    return res
      .status(200)
      .json({ message: 'Friend request sent successfully', friendRequest })
  } catch (error) {
    res.status(500).json({ message: error.message })
    console.log('Loi khi gui yeu cau ket ban: ', error)
  }
}

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const userId = req.user._id

    const request = await FriendRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' })
    }

    if (request.to.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'You are not authorized to accept this friend request'
      })
    }

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to
    })

    await FriendRequest.findByIdAndDelete(requestId)

    const form = await User.findById(request.from)
      .select('_id username email avatarUrl')
      .lean()

    return res.status(200).json({
      message: 'Friend request accepted successfully',
      newFriend: {
        _id: friend?._id,
        displayName: form?.username,
        email: form?.email,
        avatarUrl: form?.avatarUrl
      }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
    console.log('Loi khi chap nhan yeu cau ket ban: ', error)
  }
}

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params
    const userId = req.user._id

    const request = await FriendRequest.findById(requestId)

    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' })
    }

    if (request.to.toString() !== userId) {
      return res.status(403).json({
        message: 'You are not authorized to decline this friend request'
      })
    }

    await FriendRequest.findByIdAndDelete(requestId)

    return res
      .status(200)
      .json({ message: 'Friend request declined successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
    console.log('Loi khi tu choi yeu cau ket ban: ', error)
  }
}

export const getAllFriends = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message })
    console.log('Loi khi lay danh sach ban be: ', error)
  }
}

export const getFriendRequests = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message })
    console.log('Loi khi lay yeu cau ket ban: ', error)
  }
}
