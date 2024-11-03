import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import instagramIcon from '../../assets/images/instagram.svg';
import vkIcon from '../../assets/images/vk.svg';
import telegramIcon from '../../assets/images/telegram.svg';
import facebookIcon from '../../assets/images/facebook.svg';

// URL API, используемый для отправки данных
const apiUrl = process.env.REACT_APP_API_URL;

const ConnectSection: React.FC = () => {
  // Состояния для управления значениями полей ввода
  const [message, setMessage] = useState<string>(''); // Состояние для хранения сообщения
  const [email, setEmail] = useState<string>(''); // Состояние для хранения email

  // Обработчик отправки формы
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы при отправке формы

    // Проверка, что оба поля не пустые
    if (!email || !message) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }

    // Формируем данные для отправки
    const formData = {
      email: email,
      message: message,
    };

    // Отправляем данные на сервер с использованием fetch API
    fetch(`${apiUrl}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(formData), // Преобразуем данные в формат JSON
    })
      .then((response) => {
        if (response.ok) {
          // Успешная отправка данных
          alert('Ваше сообщение отправлено!');
          setEmail(''); // Очищаем поле email
          setMessage(''); // Очищаем поле message
        } else {
          // Обработка ошибки
          alert('Произошла ошибка при отправке сообщения.');
        }
      })
      .catch((error) => {
        console.error('Ошибка:', error); // Логируем ошибку в консоль для отладки
        alert('Произошла ошибка при отправке сообщения.');
      });
  };

  return (
    <section className="connect__section">
      <div className="container flex flex-column">
        {/* Заголовок секции */}
        <div className="connect__section__title flex">
          <div></div>
          <h1 className="title">
            Связаться <br />
            с нами
          </h1>
        </div>
        <div className="connect__section__social__media__form flex">
          {/* Социальные сети */}
          <div className="connect__section__social__media flex flex-column justify-between">
            <div>
              <p>Присоединяйтесь к нам в социальных сетях</p>
              <div className="flex">
                {/* Ссылки на социальные сети с иконками */}
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
            {/* Политика конфиденциальности и файлы cookie */}
            <div>
              <p>
                <Link to="/privacy-policy">Политика конфиденциальности</Link>
              </p>
              <p>
                <Link to="/cookie-policy">Политика обработки файлов cookie</Link>
              </p>
            </div>
          </div>

          {/* Форма для связи */}
          <div className="connect__section__form">
            <p>
              Пожалуйста, отправьте запрос, и мы свяжемся с вами как можно скорее.
            </p>
            <form className="flex flex-column" onSubmit={handleSubmit}>
              {/* Поле для ввода сообщения */}
              <label htmlFor="message" className="form-label">
                Чем мы можем вам помочь?
              </label>
              <textarea
                id="message"
                className="form-input large-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)} // Обновляем состояние при изменении значения поля
              ></textarea>

              {/* Поле для ввода email */}
              <label htmlFor="email" className="form-label">
                Ваш E-mail?
              </label>
              <input
                type="email"
                id="email"
                className="form-input small-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Обновляем состояние при изменении значения поля
                required
              />

              {/* Кнопка для отправки формы */}
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
