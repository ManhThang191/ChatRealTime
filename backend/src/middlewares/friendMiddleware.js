import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'
import Friend from '../models/Friend.js'

const pair = (a, b) => {
  return a < b ? [a, b] : [b, a]
}

export const checkFriendship = async (req, res, next) => {
  try {
    const me = req.user._id.toString()
    const takerId = req.body?.takerId ?? null

    if (!takerId) {
      return res.status(400).json({ message: 'takerId is required' })
    }

    if (takerId) {
      const [userA, userB] = pair(me, takerId)

      const isFriend = await Friend.findOne({ userA, userB })

      if (!isFriend) {
        return res
          .status(403)
          .json({ message: 'You are not friends with this user' })
      }

      return next()
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

export const checkGroupMembership = async (req, res, next) => {
  try {
    const userId = req.user._id.toString()
    const { conversationId } = req.body

    const conversation = await Conversation.findById(conversationId)

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' })
    }

    const isMember = conversation.participants.some(
      (participant) => participant.userId.toString() === userId
    )

    if (!isMember) {
      return res
        .status(403)
        .json({ message: 'You are not a member of this group' })
    }

    req.conversation = conversation
    return next()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}
