import mongoose from 'mongoose'

const ParticipantsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    _id: false
  }
)

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    creatBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    _id: false
  }
)

const lastMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String
    },
    content: {
      type: String,
      default: null
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    createdAt: {
      type: Date,
      default: null
    }
  },
  { _id: false }
)

const conversationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['direct', 'group'],
      required: true
    },
    participants: {
      type: [ParticipantsSchema],
      required: true
    },
    group: {
      type: groupSchema
    },
    lastMessageAt: {
      type: Date,
      default: Date.now
    },
    seenBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
      default: []
    },
    lastMessage: {
      type: [lastMessageSchema],
      ref: 'Message',
      default: null
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  {
    timestamps: true
  }
)
conversationSchema.index({ 'participants.userId': 1, lastMessageAt: -1 })

const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation
