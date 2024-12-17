import React from 'react';
import RestoreForm from '../components/RestoreForm';
import ConnectSection from '../components/MainContent/ConnectSection';
import './styles/RegisterPage.css';

// Компонент страницы регистрации
const RestorePage: React.FC = () => {
  return (
    <main>
      {/* Секция с заголовком страницы */}
      <section className="container">
        <h1 className="title text-center main__title">Регистрация</h1>
      </section>

      {/* Секция с формой регистрации */}
      <section className="container register__form">
        <RestoreForm />
      </section>

      <div className="text-center" style={{ marginTop: '20px' }}>
        <a href="/login" style={{ marginTop: '20px' }}>
            Я вспомнил пароль! Вернуться
        </a>
      </div>

      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default RestorePage;
