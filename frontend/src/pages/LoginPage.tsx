import React from 'react';
import LoginForm from '../components/LoginPage/LoginForm';
import ConnectSection from '../components/MainContent/ConnectSection';

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

        <div className="text-center" style={{ marginTop: '20px' }}>
          <a className="text-dark" href="/register" style={{ marginTop: '20px' }}>
            Нет Аккаунта? Зарегистрироваться
          </a>
        </div>
      </section>

      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default LoginPage;
