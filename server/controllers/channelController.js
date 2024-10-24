import { Server } from "socket.io";
import Group from "../models/group.js";
import User from "../models/user.js";

let io;

export const initializeSocketIO = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    let currentChannelId;
    let currentGroupId;

    socket.on("joinChannel", async ({ userId, channelId, groupId }) => {
      const group = await Group.findById(groupId).populate({
        path: 'channels.messages.sender'
      });
      const channel = group.channels.id(channelId);
      if (!group || !channel) {
        return socket.emit("error", { message: "Channel not found" });
      }
      currentChannelId = channelId;
      currentGroupId = groupId;

      // await channel.populate('messages.sender').execPopulate();

      socket.emit("previousMessages", channel.messages);

      socket.join(channelId);
      io.to(channelId).emit("userJoined", userId);
      io.to(channelId).emit("updateUserCount", getUserCount(channelId));
    });

    socket.on("message", async (data) => {
      const group = await Group.findById(currentGroupId).populate({
        path: 'channels.messages.sender'
      });
      const channel = group.channels.id(currentChannelId);

      if (!group || !channel) {
        return socket.emit("error", { message: "Channel not found" });
      }

      const newMessage = {
        sender: data.senderId,
        type: data.type,
        text: data.message,
        timestamp: new Date(),
      };

      channel.messages.push(newMessage);
      await group.save();

      const group_new = await Group.findById(currentGroupId).populate({
        path: 'channels.messages.sender'
      });
      const channel_new = group_new.channels.id(currentChannelId);

      io.to(currentChannelId).emit("message", channel_new.messages);
    });

    socket.on("leaveChannel", () => {
      socket.leave(currentChannelId);
      io.to(currentChannelId).emit("userLeft", socket.id);
      io.to(currentChannelId).emit(
        "updateUserCount",
        getUserCount(currentChannelId)
      );
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const getUserCount = (channelId) => {
  return io.sockets.adapter.rooms.get(channelId)?.size || 0;
};

// Function to remove a user from a specific channel in a group
export const removeUserFromChannel = async (req, res) => {
  const { groupId, channelId, userId } = req.body;

  if (!groupId || !channelId || !userId) {
    return res.status(400).json({ message: "groupId, channelId, and userId are required" });
  }

  try {
    // Fetch the group by groupId
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Find the channel within the group
    const channel = group.channels.id(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found in the group" });
    }

    // Check if the user is assigned to the channel
    const isUserInChannel = channel.users.includes(userId);
    if (!isUserInChannel) {
      return res.status(400).json({ message: "User is not assigned to this channel" });
    }

    // Remove the user from the channel's 'users' array
    channel.users.pull(userId); // Mongoose's pull method removes the userId from the array

    // Save the updated group with the modified channel
    await group.save();

    return res.status(200).json({ message: "User removed from channel successfully", user: userId, channel: channelId });
  } catch (error) {
    console.error("Error removing user from channel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Function to add a user to a specific channel within a group
export const addUserToChannel = async (req, res) => {
  const { groupId, channelId, userId } = req.body;

  if (!groupId || !channelId || !userId) {
    return res.status(400).json({ message: "groupId, channelId, and userId are required" });
  }

  try {
    // Fetch the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Find the channel within the group
    const channel = group.channels.id(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found in the group" });
    }

    // Check if the user is already assigned to the channel
    const isUserInChannel = channel.users.includes(userId);
    if (isUserInChannel) {
      return res.status(400).json({ message: "User already assigned to this channel" });
    }

    // Add the user to the channel's 'users' array
    channel.users.push(userId);

    // Save the updated group with the modified channel
    await group.save();

    return res.status(201).json({ message: "User added to channel successfully", user: userId, channel: channelId });
  } catch (error) {
    console.error("Error adding user to channel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Function to get users assigned to a specific channel in a group
export const getUsersFromChannel = async (req, res) => {
  const { groupId, channelId } = req.query;

  if (!groupId || !channelId) {
    return res.status(400).json({ message: "groupId and channelId are required" });
  }

  try {
    // Fetch the group by groupId
    const group = await Group.findById(groupId).populate('channels.users');
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Find the channel within the group
    const channel = group.channels.id(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found in the group" });
    }

    // Get the list of users assigned to the channel
    const users = channel.users;

    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users from channel:", error);
    return res.status(500).json({ message: "Server error" });
  }
};