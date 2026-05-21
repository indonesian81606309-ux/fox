import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
  name: { type: String, required: true }, // OVO, DANA, GOPAY, QRIS
  qrisImage: { type: String },
  isActive: { type: Boolean, default: true },
});

export default mongoose.model('PaymentMethod', paymentMethodSchema);
