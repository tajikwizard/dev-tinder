const express = require('express');
const { userAuth } = require('../middlewares/authMiddleware');
const User = require('../models/userSchema');
const Connection = require('../models/connectionSchema');
const requestRoutes = express.Router();

// ---- Send Request Route ----
requestRoutes.post(
  '/request/send/:status/:userId',
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.userId;
      const toUserId = req.params.userId;
      const status = req.params.status;

      const allowedStatuses = ['interested', 'ignored'];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: 'Invalid status type:' + status,
        });
      }

      //--- Cheking if the toUserId exists---
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({
          message: 'The user you are trying to connect with does not exist.',
        });
      }

      // ---Checking if the user is trying to send request to themselves---
      if (fromUserId === toUserId) {
        return res.status(400).json({
          message: 'You cannot send a connection request to yourself.',
        });
      }

      // --- Check if a connection request already exists between the users---
      const existingConnection = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnection) {
        return res.status(400).json({
          message: 'Connection request already exists between these users.',
        });
      }

      const connectionRequest = new Connection({
        fromUserId,
        toUserId,
        status,
      });
      await connectionRequest.save();
      res.status(200).json({
        message: `Connection request sent as ${status}.`,
        data: connectionRequest,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Server error. Please try again later.' });
    }
  },
);

// ---- Review Request Route ----
requestRoutes.post(
  '/request/review/:action/:requestId',
  userAuth,
  async (req, res) => {
    try {
      const userId = req.userId;
      const { action, requestId } = req.params;

      const allowedActions = ['accepted', 'rejected'];
      if (!allowedActions.includes(action)) {
        return res.status(400).json({
          message: 'Invalid action type:' + action,
        });
      }

      const connectionRequest = await Connection.findOne({
        _id: requestId,
        toUserId: userId,
        status: 'interested',
      });

      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: 'Connection request not found.' });
      }
      // Update the connection request status
      connectionRequest.status = action;
      await connectionRequest.save();
      res.status(200).json({
        message: `Connection request ${action}.`,
        data: connectionRequest,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Server error. Please try again later.' });
    }
  },
);

module.exports = requestRoutes;
