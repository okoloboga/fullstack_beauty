// src/pages/RegisterPage.js
import React from 'react';
import RegisterForm from '../components/RegisterForm';
import ConnectSection from '../components/sections/ConnectSection';

const RegisterPage = () => {
  return (
    <main>
      <section className="container">
        <h1 className="title text-center main__title">Регистрация</h1>
      </section>
      <section className="container register__form">
        <RegisterForm />
      </section>
      <ConnectSection />
    </main>
  );
};

export default RegisterPage;
