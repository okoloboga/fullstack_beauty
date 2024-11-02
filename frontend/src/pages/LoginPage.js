import React from 'react';
import LoginForm from '../components/LoginForm';
import ConnectSection from '../components/sections/ConnectSection';

const LoginPage = () => {
  return (
    <main>
      <section className="container">
        <h1 className="title text-center main__title">Авторизация</h1>
      </section>
      <section className="container login__form">
        <LoginForm />
      </section>
      <ConnectSection />
    </main>
  );
};

export default LoginPage;
