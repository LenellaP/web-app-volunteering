import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('/api/requests')
      .then(res => setRequests(res.data))
      .catch(err => console.error('Помилка завантаження запитів', err));
  }, []);

  return (
    <div className="container py-4">
      <h2>Запити на допомогу</h2>
      {requests.length === 0 ? (
        <p>Наразі немає запитів.</p>
      ) : (
        <div className="row">
          {requests.map(req => (
            <div key={req._id} className="col-md-6 col-lg-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{req.title}</h5>
                  <p className="card-text">{req.description}</p>
                  <p><strong>Локація:</strong> {req.location}</p>
                  <p><small>Дата: {new Date(req.date).toLocaleDateString()}</small></p>
                  <p><small>Автор: {req.user?.username || 'Анонім'}</small></p>
                </div>
              <div className="card-footer bg-transparent border-top-0 d-flex justify-content-end">
                <Link to={`/request-chat/${req._id}`} state={{ receiverId: req.user }} className="btn btn-sm btn-primary">
                Відповісти
                </Link>
              </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestsPage;
