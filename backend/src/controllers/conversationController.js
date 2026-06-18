import Conversation from '../models/Conversation.js'
import Message from '../models/Message.js'

export const createConversation = async (req, res) => {
  try {
    const { type, name, participantIds } = req.body
    const userId = req.user._id

    if (
      !type ||
      (type === 'group' && !name) ||
      !participantIds ||
      !Array.isArray(participantIds) ||
      participantIds.length === 0
    ) {
      return res.status(400).json({ message: 'Invalid request data' })
    }

    let conversation

    if (type === 'direct') {
      if (participantIds.length !== 1) {
        return res.status(400).json({
          message: 'Direct conversations must have exactly 2 participants'
        })
      }

      const participantId = participantIds[0]
      conversation = await Conversation.findOne({
        type: 'direct',
        'participants.userId': {
          $all: [userId, participantId]
        }
      })

      if (!conversation) {
        conversation = await Conversation.create({
          type: 'direct',
          participants: [
            { userId, joinedAt: new Date() },
            { userId: participantId, joinedAt: new Date() }
          ],
          lastMessageAt: new Date(),
          unreadCount: new Map()
        })

        await conversation.save()
      }
    }

    if (type === 'group') {
      conversation = await Conversation.create({
        type: 'group',
        participants: participantIds.map((id) => ({
          userId: id,
          joinedAt: new Date()
        })),
        lastMessageAt: new Date(),
        unreadCount: new Map(),
        group: {
          name,
          createdBy: userId
        }
      })

      await conversation.save()
    }

    if (!conversation) {
      return res.status(400).json({ message: 'Failed to create conversation' })
    }

    await conversation.populate([
      { path: 'participants.userId', select: 'username displayName avatarUrl' },
      { path: 'seenBy', select: 'username displayName avatarUrl' },
      { path: 'lastMessage.senderId', select: 'username displayName avatarUrl' }
    ])

    return res
      .status(201)
      .json({ message: 'Conversation created successfully', conversation })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id
    const conversations = await Conversation.find({
      'participants.userId': userId
    })
      .sort({ lastMessageAt: -1, updatedAt: -1 })
      .populate([
        {
          path: 'participants.userId',
          select: 'username displayName avatarUrl'
        },
        { path: 'seenBy', select: 'username displayName avatarUrl' },
        {
          path: 'lastMessage.senderId',
          select: 'username displayName avatarUrl'
        }
      ])

    const formattedConversations = conversations.map((conversation) => {
      const participants = (conversation.participants || []).map(
        (participant) => ({
          _id: participant.userId?._id,
          username: participant.userId?.username,
          displayName: participant.userId?.displayName,
          avatarUrl: participant.userId?.avatarUrl,
          joinedAt: participant.joinedAt
        })
      )

      return {
        ...conversation.toObject(),
        unreadCount: conversation.unreadCount || {},
        participants
      }
    })

    return res.status(200).json({ conversations: formattedConversations })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

export const getMessages = async (req, res) => {
  try {
  } catch (error) {}
}
