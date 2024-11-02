import React from 'react';
import LoginForm from '../components/LoginForm';
import ConnectSection from '../components/sections/ConnectSection';
import { Link } from 'react-router-dom'; // Импортируем Link

const LoginPage = () => {
  return (
    <main>
      <section className="container">
        <h1 className="title text-center main__title">Авторизация</h1>
      </section>
      <section className="container login__form">
        <LoginForm />
        {/* Добавляем кнопку регистрации с аналогичным стилем как у "Войти" */}
        <div className="text-center" style={{ marginTop: '20px' }}>
          <Link to="/register">
            <button className="button__with__bg" style={{ marginTop: '20px' }}>
              Регистрация
            </button>
          </Link>
        </div>
      </section>
      <ConnectSection />
    </main>
  );
};

export default LoginPage;
