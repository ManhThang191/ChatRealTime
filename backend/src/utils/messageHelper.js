export const updateConversationAfterCreateMessage = async (
  conversation,
  message,
  senderId
) => {
  conversation.set({
    seenBy: [],
    lastMessageAt: message.createdAt,
    lastMessage: {
      _id: message._id,
      content: message.content,
      senderId,
      createdAt: message.createdAt
    }
  })

  conversation.participants.forEach((participant) => {
    const memberId = participant.userId.toString()
    const isSender = memberId === senderId.toString()
    const preCount = conversation.unreadCount.get(memberId) || 0

    conversation.unreadCount.set(memberId, isSender ? preCount : preCount + 1)
  })
}
