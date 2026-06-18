import mongoose from 'mongoose'
import Conversation from '../models/Conversation.js'
import { updateConversationAfterCreateMessage } from '../utils/messageHelper.js'
import Message from '../models/Message.js'

export const sendDirectMessage = async (req, res) => {
  try {
    const { takerId, content, conversationId } = req.body

    const senderId = req.user._id

    let conversation

    if (!content) {
      return res.status(400).json({ message: 'Content is required' })
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId)
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        participants: [
          {
            userId: senderId,
            joinedAt: new Date()
          },
          {
            userId: takerId,
            joinedAt: new Date()
          }
        ],
        lastMessageAt: new Date(),
        unreadCount: new Map()
      })
    }

    const message = await Message.create({
      content,
      senderId,
      conversationId: conversation._id,
      createdAt: new Date()
    })

    updateConversationAfterCreateMessage(conversation, message, senderId)

    await conversation.save()

    return res
      .status(200)
      .json({ message: 'Message sent successfully', conversation })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ message: error.message })
  }
}

export const sendGroupMessage = async (req, res) => {
  try {
  } catch (error) {}
}
