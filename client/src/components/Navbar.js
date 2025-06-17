import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Обмін речами</Link>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Профіль</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/my-chats">Мої чати</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/create">Нове оголошення</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/requests">Запити на допомогу</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/create-request">Створити запит</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light ms-2" onClick={handleLogout}>
                    Вийти
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Увійти</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Реєстрація</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
