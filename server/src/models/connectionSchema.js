const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ['interested', 'ignored', 'rejected', 'accepted'],
        message: '{VALUE} is not supported',
      },
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Connection', connectionSchema);
