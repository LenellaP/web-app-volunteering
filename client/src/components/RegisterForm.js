import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', formData);
      alert('Реєстрація успішна!');
      navigate('/login');
    } catch (err) {
      alert('Помилка реєстрації');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Реєстрація</h2>
      <input
        className="form-control mb-2"
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Ім’я користувача"
        required
      />
      <input
        className="form-control mb-2"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        className="form-control mb-2"
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Пароль"
        required
      />
      <button className="btn btn-success w-100" type="submit">Зареєструватися</button>
    </form>
  );
};

export default RegisterForm;
