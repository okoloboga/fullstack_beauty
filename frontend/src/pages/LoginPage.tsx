import React from 'react';
import LoginForm from '../components/LoginForm';
import ConnectSection from '../components/sections/ConnectSection';
import { Link } from 'react-router-dom'; // Импортируем Link для переходов на другие страницы

// Компонент страницы авторизации
const LoginPage: React.FC = () => {
  return (
    <main>
      {/* Основная секция страницы с заголовком */}
      <section className="container">
        <h1 className="title text-center main__title">Авторизация</h1>
      </section>

      {/* Секция с формой логина */}
      <section className="container login__form">
        <LoginForm />
        {/* Кнопка перехода на страницу регистрации, стилизована как кнопка "Войти" */}
        <div className="text-center" style={{ marginTop: '20px' }}>
          <Link to="/register">
            <button className="button__with__bg" style={{ marginTop: '20px' }}>
              Регистрация
            </button>
          </Link>
        </div>
      </section>

      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default LoginPage;
