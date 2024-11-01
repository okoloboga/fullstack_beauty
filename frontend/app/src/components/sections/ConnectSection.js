import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import instagramIcon from '../../assets/images/instagram.svg';
import vkIcon from '../../assets/images/vk.svg';
import telegramIcon from '../../assets/images/telegram.svg';
import facebookIcon from '../../assets/images/facebook.svg';

const ConnectSection = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      // Проверка, что поля не пустые
      if (!email || !message) {
        alert('Пожалуйста, заполните все поля.');
        return;
      }
  
      const formData = {
        email: email,
        message: message,
      };
  
      // Отправка данных на сервер с использованием fetch
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.ok) {
            // Успешная отправка
            alert('Ваше сообщение отправлено!');
            setEmail('');
            setMessage('');
          } else {
            // Обработка ошибок
            alert('Произошла ошибка при отправке сообщения.');
          }
        })
        .catch((error) => {
          console.error('Ошибка:', error);
          alert('Произошла ошибка при отправке сообщения.');
        });
    };
  
    return (
      <section className="connect__section">
        <div className="container flex flex-column">
          <div className="connect__section__title flex">
            <div></div>
            <h1 className="title">
              Связаться <br />
              с нами
            </h1>
          </div>
          <div className="connect__section__social__media__form flex">
            <div className="connect__section__social__media flex flex-column justify-between">
              <div>
                <p>Присоединяйтесь к нам в социальных сетях</p>
                <div className="flex">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={instagramIcon} alt="Instagram" />
                  </a>
                  <a
                    href="https://vk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={vkIcon} alt="VK" />
                  </a>
                  <a
                    href="https://telegram.org"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={telegramIcon} alt="Telegram" />
                  </a>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={facebookIcon} alt="Facebook" />
                  </a>
                </div>
              </div>
              <div>
                <p>
                  <Link to="/privacy-policy">Политика конфиденциальности</Link>
                </p>
                <p>
                  <Link to="/cookie-policy">Политика обработки файлов cookie</Link>
                </p>
              </div>
            </div>
            <div className="connect__section__form">
              <p>
                Пожалуйста, отправьте запрос, и мы свяжемся с вами как можно
                скорее.
              </p>
              <form className="flex flex-column" onSubmit={handleSubmit}>
                <label htmlFor="message" className="form-label">
                  Чем мы можем вам помочь?
                </label>
                <textarea
                  id="message"
                  className="form-input large-input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                <label htmlFor="email" className="form-label">
                  Ваш E-mail?
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input small-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="button__without__bg">
                  Отправить
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default ConnectSection;
  