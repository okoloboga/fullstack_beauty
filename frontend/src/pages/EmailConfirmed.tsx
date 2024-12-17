import React, { useEffect, useState } from 'react';
import { confirmEmail } from './../utils/apiService'; // Путь к функции
import { toast } from 'react-toastify'; // Импорт toast для уведомлений
import { useNavigate } from 'react-router-dom'; 

const ConfirmEmailPage = () => {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (!token) {
      setStatus('Токен подтверждения не найден');
      setLoading(false);
      return;
    }

    confirmEmail(token)
      .then((message) => {
        setStatus(message);
        if (message === 'Почта успешно подтверждена!') {
          toast.success(message);
          // После успешного подтверждения перенаправляем на страницу входа
          setTimeout(() => {
            navigate('/login'); // Перенаправление на страницу входа
          }, 2000); // Задержка перед перенаправлением (2 секунды)
        } else {
          toast.error(message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div>
      <h1>Подтверждение email</h1>
      {status && <p>{status}</p>}
    </div>
  );
};

export default ConfirmEmailPage;
