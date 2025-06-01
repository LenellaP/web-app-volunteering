import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyChats = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/messages/my-chats', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setChats(res.data))
      .catch(err => console.error('Error loading chats', err));
  }, []);

  return (
    <div className="container py-4">
      <h3 className="mb-4">Мої чати</h3>
      {chats.length === 0 ? (
        <p>Немає активних чатів</p>
      ) : (
        <ul className="list-group">
          {chats.map((chat, i) => (
            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{chat.user.username}</strong>
                <div className="text-muted small">{chat.lastMessage}</div>
              </div>
              <Link
                to={`/chat/${chat.postId}`}
                state={{ receiverId: chat.user._id }}
                className="btn btn-outline-primary btn-sm"
              >
                Відкрити
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyChats;
