import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  issue: { type: String, required: true },
  proofImage: { type: String },
  productName: { type: String },
  status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  adminResponse: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Report', reportSchema);
