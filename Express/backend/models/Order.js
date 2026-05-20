import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  totalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 5000 },
  paymentMethod: { type: String },
  status: { type: String, enum: ['pending', 'paid', 'accepted', 'rejected', 'completed'], default: 'pending' },
  paymentProof: { type: String },
  uniqueCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
