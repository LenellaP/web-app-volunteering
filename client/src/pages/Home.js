import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/posts')
      .then(res => setPosts(res.data))
      .catch(err => console.error('Помилка завантаження постів', err));
  }, []);

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">Оголошення</h2>

      {posts.length === 0 ? (
        <p className="text-center">Оголошень поки немає.</p>
      ) : (
        <div className="row">
          {posts.map(post => (
            <div key={post._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.description}</p>
                  <span className="badge bg-secondary">{post.category}</span>
                </div>
                <div className="card-footer d-flex flex-column gap-2">
                <button
                  className="btn btn-outline-primary"
                    onClick={() =>
                    navigate(`/chat/${post._id}`, {
                    state: { receiverId: post.user._id }
                    })}>
                  Зв’язатися
                </button>

                <button
                  className="btn btn-outline-secondary"
                    onClick={() => navigate(`/profile/${post.user._id}`)}>
                  Профіль автора
                </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;