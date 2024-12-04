import React from 'react';
import RegisterForm from '../components/RegisterForm/RegisterForm';
import ConnectSection from '../components/MainContent/ConnectSection';
import './styles/RegisterPage.css';

// Компонент страницы регистрации
const RegisterPage: React.FC = () => {
  return (
    <main>
      {/* Секция с заголовком страницы */}
      <section className="container">
        <h1 className="title text-center main__title">Регистрация</h1>
      </section>

      {/* Секция с формой регистрации */}
      <section className="container register__form">
        <RegisterForm />
      </section>

      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default RegisterPage;
