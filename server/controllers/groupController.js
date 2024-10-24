import Group from "../models/group.js";
import User from "../models/user.js";
import mongoose from "mongoose";

// Function to create a new group
export const createGroup = async (req, res) => {
  console.log("Request body:", req.body);
  const { groupName } = req.body;

  try {
    // Check if the group already exists
    const groupExists = await Group.findOne({ name: groupName });
    if (groupExists) {
      return res.status(400).json({ message: "Group already exists" });
    }
    const newGroup = new Group({
      name: groupName,
      channels: [],
      users: [],
    });

    await newGroup.save();

    return res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Function to add users to a group
export const addUserToGroup = async (req, res) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId) {
    return res.status(400).json({ message: "groupId and userId are required" });
  }

  try {
    // Fetch the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already an admin or member of the group
    const isAdmin = group.admins.includes(userId);
    const isMember = group.users.includes(userId);

    if (isAdmin || isMember) {
      return res
        .status(400)
        .json({ message: "User already exists in this group" });
    }

    // If the user is a groupadmin, add them to the 'admins' array
    if (user.roles.includes("groupadmin")) {
      group.admins.push(userId);
    }
    // Otherwise, add them to the 'users' array
    else {
      group.users.push(userId);
    }

    // Save the updated group
    await group.save();

    return res
      .status(201)
      .json({ message: "User added to group successfully", user: userId });
  } catch (error) {
    console.error("Error adding user to group:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Function to remove users from a group
export const removeUserFromGroup = async (req, res) => {
  const { groupId, userId } = req.body;

  if (!groupId || !userId) {
    return res.status(400).json({ message: "groupId and userId are required" });
  }

  try {
    // Fetch the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is an admin or member of the group
    const isAdmin = group.admins.includes(userId);
    const isMember = group.users.includes(userId);

    if (!isAdmin && !isMember) {
      return res.status(400).json({ message: "User is not part of this group" });
    }

    // Remove the user from the 'admins' array if they are an admin
    if (isAdmin) {
      group.admins = group.admins.filter(adminId => adminId.toString() !== userId);
    }

    // Remove the user from the 'users' array if they are a member
    if (isMember) {
      group.users = group.users.filter(userIdInGroup => userIdInGroup.toString() !== userId);
    }

    // Save the updated group
    await group.save();

    return res.status(200).json({ message: "User removed from group successfully", user: userId });
  } catch (error) {
    console.error("Error removing user from group:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Function to add a channel to a group
export const addChannelToGroup = async (req, res) => {
  const { groupId, channelName } = req.body;

  if (!groupId || !channelName) {
    return res
      .status(400)
      .json({ message: "Both groupId and channelName are required" });
  }

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.channels.some((channel) => channel.name === channelName)) {
      return res
        .status(400)
        .json({ message: "Channel already exists in this group" });
    }

    const newChannel = {
      id: group.channels.length + 1,
      name: channelName,
      users: [],
    };

    group.channels.push(newChannel);

    await group.save();

    return res.status(201).json({
      message: "Channel added to group successfully",
      channel: newChannel,
    });
  } catch (error) {
    console.error("Error adding channel to group:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Function to remove a channel from a group
export const removeChannelFromGroup = async (req, res) => {
  const { groupId, channelName } = req.body;

  if (!groupId || !channelName) {
    return res
      .status(400)
      .json({ message: "Both groupId and channelName are required" });
  }

  try {
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    group.channels = group.channels.filter(
      (channel) => channel.name !== channelName
    );

    await group.save();

    return res
      .status(200)
      .json({ message: "Channel removed from group successfully", group });
  } catch (error) {
    console.error("Error removing channel from group:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Function to get all groups and their relevant channels for the user
export const getAllGroups = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let groups;

    // Fetch groups based on user's role
    if (user.roles.includes("superadmin")) {
      // Superadmin: Get all groups and populate users for each channel
      groups = await Group.find().populate({path: "channels.users"}).populate("users");
    } else if (user.roles.includes("groupadmin")) {
      // Groupadmin: Get groups where the user is an admin and populate users for each channel
      groups = await Group.find({ admins: userId }).populate({path: "channels.users"}).populate("users");
    } else {
      // Regular user: Only get the groups they belong to and filter channels they are explicitly assigned to
      groups = await Group.find({ users: userId }).populate('users').lean();

      // Filter out only the channels where the user is explicitly assigned
      // const userObjectId = new mongoose.Types.ObjectId(userId);
      // groups = groups.map((group) => {
      //   const userChannels = group.channels.filter((channel) =>{
      //     channel.users.includes(userObjectId);
      //   });
      //   return { ...group, channels: userChannels };
      // });
    }

    if (!groups || groups.length === 0) {
      return res.status(200).json({ message: "No groups available", groups: [] });
    }

    res.status(200).json({ groups });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getChannelsFromGroup = async (req, res) => {
  const { groupId } = req.query;

  if (!groupId) {
    return res.status(400).json({ message: "groupId is required" });
  }

  try {
    // Fetch the group by groupId
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Return the channels from the group
    return res.status(200).json({ channels: group.channels });
  } catch (error) {
    console.error("Error fetching channels from group:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Function to get all users of groups
export const getAllUsersOfGroup = async (req, res) => {
  try {
    const { groupId } = req.query;

    // Find the group by the provided groupId and populate the users
    const group = await Group.findById(groupId).populate('users');

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Return the populated users within the group
    res.status(200).json({ users: group.users });
  } catch (error) {
    console.error("Error fetching group users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
