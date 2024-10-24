import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  messages: [{ 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: { type: String, enum: ['text', 'image'], required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  channels: [channelSchema],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Group = mongoose.model('Group', groupSchema);
export default Group;
