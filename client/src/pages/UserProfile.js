import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId) return;

    axios.get(`/api/posts/user/${userId}`).then(res => setPosts(res.data));
    axios.get(`/api/requests/user/${userId}`).then(res => setRequests(res.data));

    if (token) {
      axios.get(`/api/subscriptions/check/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setSubscribed(res.data.subscribed))
      .catch(err => console.error('Помилка перевірки підписки', err));
    }
  }, [userId]);

  const handleSubscribe = () => {
    axios.post(`/api/subscriptions/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => setSubscribed(true));
  };

  return (
    <div className="container py-5">
      <h3 className="mb-4 text-center">Профіль користувача</h3>
      {!subscribed && (
        <div className="text-center mb-4">
          <button className="btn btn-primary" onClick={handleSubscribe}>
            Підписатися
          </button>
        </div>
      )}

      <h4 className="mt-4">Оголошення</h4>
      <div className="row">
        {posts.map(post => (
          <div key={post._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.description}</p>
                <span className="badge bg-secondary">{post.category}</span>
              </div>
              <div className="card-footer">
                <button
                  className="btn btn-outline-primary w-100"
                  onClick={() =>
                    navigate(`/chat/${post._id}`, {
                      state: { receiverId: post.user }
                    })
                  }
                >
                  Відгукнутися
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h4 className="mt-5">Запити</h4>
      {requests.map(req => (
        <div key={req._id} className="alert alert-light border shadow-sm mb-3">
          <strong>{req.title}</strong>
          <p>{req.description}</p>
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
