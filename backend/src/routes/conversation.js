import express from 'express'
import {
  createConversation,
  getMessages,
  getConversations
} from '../controllers/conversationController.js'

const router = express.Router()
router.post('/createConversation', createConversation)
router.get('/getConversations', getConversations)
router.get('/:conversationId/messages', getMessages)

export default router
