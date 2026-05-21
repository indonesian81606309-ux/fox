import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import offerRoutes from './routes/offers.js';
import chatRoutes from './routes/chats.js';
import redeemRoutes from './routes/redeem.js';
import giveawayRoutes from './routes/giveaway.js';
import reportRoutes from './routes/reports.js';
import paymentRoutes from './routes/payments.js';
import serviceRoutes from './routes/services.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import Chat from './models/Chat.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/redeem', redeemRoutes);
app.use('/api/giveaway', giveawayRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  const userId = socket.handshake.auth.userId;
  if (userId) socket.join(userId);

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message, fileUrl, fileType } = data;
    const chat = await Chat.create({ sender: senderId, receiver: receiverId, message, fileUrl, fileType });
    io.to(receiverId).emit('newMessage', chat);
    io.to(senderId).emit('newMessage', chat);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
