import mongoose from 'mongoose'

const inviteChoiceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    activities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
)

export const InviteChoice = mongoose.model('InviteChoice', inviteChoiceSchema)
