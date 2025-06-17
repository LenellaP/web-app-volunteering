import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return;

    axios.get('/api/posts/mine', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMyPosts(res.data));

    axios.get('/api/requests/mine', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setMyRequests(res.data));

    axios.get('/api/subscriptions', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setSubscriptions(res.data));
  }, []);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyPosts(myPosts.filter(post => post._id !== postId));
    } catch (err) {
      console.error('Помилка видалення', err);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Мої оголошення</h2>
      {myPosts.length === 0 ? (
        <p className="text-center">У вас ще немає оголошень.</p>
      ) : (
        <div className="row">
          {myPosts.map(post => (
            <div key={post._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description}</p>
                  <span className="badge bg-secondary">{post.category}</span>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => navigate(`/edit/${post._id}`)}>Редагувати</button>
                  <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(post._id)}>Видалити</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-5 mb-3 text-center">Мої запити на допомогу</h2>
      {myRequests.length === 0 ? (
        <p className="text-center">У вас ще немає запитів.</p>
      ) : (
        <div className="row">
          {myRequests.map(req => (
            <div key={req._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-info">
                <div className="card-body">
                  <h5 className="card-title">{req.title}</h5>
                  <p className="card-text">{req.description}</p>
                  <small className="text-muted">{req.location} | {new Date(req.date).toLocaleDateString()}</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-5 mb-3 text-center">Мої підписки</h2>
      {subscriptions.length === 0 ? (
        <p className="text-center">Ви ще не підписані на інших користувачів.</p>
      ) : (
        <ul className="list-group">
  {subscriptions.map((sub, i) => (
  sub.followed ? (
    <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
      <span>{sub.followed.username} ({sub.followed.email})</span>
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => navigate(`/profile/${sub.followed._id}`)}
      >
        Перейти до профілю
      </button>
    </li>
  ) : null
))}

</ul>

      )}
    </div>
  );
};

export default Profile;
