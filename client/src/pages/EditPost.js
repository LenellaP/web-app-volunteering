import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`/api/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setFormData(res.data))
      .catch(err => {
        console.error('Помилка завантаження поста', err);
        alert('Не вдалося завантажити оголошення');
      });
  }, [id]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`/api/posts/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Оголошення оновлено!');
      navigate('/profile');
    } catch (err) {
      console.error('Помилка оновлення', err);
      alert('Помилка при оновленні оголошення');
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow">
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">Редагувати оголошення</h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Заголовок</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="form-control"
                placeholder="Наприклад: Віддам дитячий одяг"
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Опис</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-control"
                rows="4"
                placeholder="Деталі оголошення"
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Категорія</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-control"
                placeholder="Наприклад: одяг, меблі, техніка"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">Зберегти зміни</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPost;
