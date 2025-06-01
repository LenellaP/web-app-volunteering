import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation } from 'react-router-dom';

const RequestChat = () => {
  const { requestId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const location = useLocation();
  const passedReceiverId = location.state?.receiverId;
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`/api/messages/request/${requestId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setMessages(res.data))
      .catch(err => console.error('Error loading messages', err));
  }, [requestId]);

  const handleSend = async () => {
    const token = localStorage.getItem('token');
    const receiverId = messages.length > 0
      ? messages[0].sender._id === userId
        ? messages[0].receiver._id
        : messages[0].sender._id
      : passedReceiverId;

    if (!receiverId) return alert('No receiver found');

    try {
      const res = await axios.post('/api/messages', {
        receiverId,
        requestId,
        text
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessages([...messages, res.data]);
      setText('');
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <h3 className="text-center mb-4">Чат (відповідь на запит)</h3>

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

export default RequestChat;
