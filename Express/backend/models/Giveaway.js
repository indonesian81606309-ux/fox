import mongoose from 'mongoose';

const giveawaySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  prize: { type: String, required: true },
  winnersCount: { type: Number, required: true },
  game: { type: String },
  productType: { type: String },
  price: { type: Number },
  endDate: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  winners: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Giveaway', giveawaySchema);
