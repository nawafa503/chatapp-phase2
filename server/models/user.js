import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: ['superadmin', 'groupadmin', 'user'], default: 'user' },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  avatar: { type: String },
});

const User = mongoose.model('User', userSchema);
export default User;
