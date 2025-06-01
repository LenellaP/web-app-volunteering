import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateRequest = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: ''
  });
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async e => {
  e.preventDefault();
  const token = localStorage.getItem('token');

  try {
    await axios.post('/api/requests', {
      ...formData,
      creator: JSON.parse(localStorage.getItem('user'))._id  // <--- додано creator
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    navigate('/requests');
  } catch (err) {
    alert('Помилка створення запиту');
  }
};


  return (
    <div className="container py-4">
      <h2>Створити запит на допомогу</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Назва" required onChange={handleChange} className="form-control mb-2" />
        <textarea name="description" placeholder="Опис" onChange={handleChange} className="form-control mb-2" />
        <input type="text" name="location" placeholder="Місце" onChange={handleChange} className="form-control mb-2" />
        <input type="date" name="date" onChange={handleChange} className="form-control mb-3" />
        <button type="submit" className="btn btn-primary">Опублікувати</button>
      </form>
    </div>
  );
};

export default CreateRequest;
