import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
const socket = io('http://localhost:5000');
const Chat = () => {
  const { postId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [receiverId, setReceiverId] = useState(null);
  const location = useLocation();
  const passedReceiverId = location.state?.receiverId;
  const userId = localStorage.getItem('userId');

  // Завантаження історії чату
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`/api/messages/${postId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setMessages(res.data);

        if (res.data.length > 0) {
          const firstMsg = res.data[0];
          const otherUserId = firstMsg.sender._id === userId
            ? firstMsg.receiver._id
            : firstMsg.sender._id;
          setReceiverId(otherUserId);
        } else {
          setReceiverId(passedReceiverId);
        }
      })
      .catch(err => console.error('Error loading messages', err));
  }, [postId, passedReceiverId, userId]);

  useEffect(() => {
    socket.emit('join', userId);

    socket.on('receiveMessage', (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, [userId]);

  const handleSend = async () => {
    const token = localStorage.getItem('token');
    if (!receiverId) return alert('Не вдалося визначити отримувача повідомлення');

    try {
      const res = await axios.post('/api/messages', {
        receiverId,
        postId,
        text
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages(prev => [...prev, res.data]);
      socket.emit('sendMessage', res.data); // Надіслати іншим користувачам
      setText('');
    } catch (err) {
      console.error('Помилка надсилання повідомлення', err);
      alert('Помилка надсилання повідомлення');
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <h3 className="text-center mb-4">Чат</h3>

      <div className="border rounded p-3 mb-3 bg-light" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 d-flex ${msg.sender._id === userId ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div className={`p-2 rounded ${msg.sender._id === userId ? 'bg-primary text-white' : 'bg-white border'}`} style={{ maxWidth: '70%' }}>
              <strong>{msg.sender.username}:</strong> {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Напишіть повідомлення..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <button className="btn btn-success" onClick={handleSend}>Надіслати</button>
      </div>
    </div>
  );
};

export default Chat;