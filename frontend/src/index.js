import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css'; // если у вас есть файл стилей для всего приложения
import App from './App'; // импорт вашего основного компонента

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
