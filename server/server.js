require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const messageRoutes = require('./routes/messages');
const requestRoutes = require('./routes/requests');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});
const userRoutes = require('./routes/users');
const subscriptionRoutes = require('./routes/subscription');

io.on('connection', socket => {
  console.log('Користувач підключився');

  socket.on('sendMessage', ({ receiverId, message }) => {
    // Надіслати повідомлення конкретному користувачу 
    io.to(receiverId).emit('receiveMessage', message);
  });

  socket.on('join', (userId) => {
    socket.join(userId); // додає користувача в його кімнату
  });

  socket.on('disconnect', () => {
    console.log('Користувач відключився');
  });
});

app.set('io', io); 


// Middlewares
app.use(cors());
app.use(express.json());

// Маршрути
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use('/api/requests', requestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected');

  server.listen(process.env.PORT, () => {
    console.log(`Server with Socket.IO running on port ${process.env.PORT}`);
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
