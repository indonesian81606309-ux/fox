import mongoose from 'mongoose';

const redeemCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, default: 0 }, // in Rupiah
  gift: { type: String }, // description of gift
  maxUses: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
  expiresAt: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('RedeemCode', redeemCodeSchema);
