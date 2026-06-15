import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      trim: true
    },
    imgUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

// compound index to optimize queries by conversationId and createdAt
// tao conversation voi createdAt giam dan de lay tin nhan moi nhat truoc, sap xep theo conversationId de lay tin nhan theo cuoc hoi thoai
messageSchema.index({ conversationId: 1, createdAt: -1 })

const Message = mongoose.model('Message', messageSchema)

export default Message
