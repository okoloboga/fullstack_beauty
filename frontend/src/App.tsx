import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Импорт маршрутизатора для управления маршрутами в приложении
import { ToastContainer } from 'react-toastify'; // Импортируем ToastContainer для отображения уведомлений
import 'react-toastify/dist/ReactToastify.css'; // Стили для уведомлений

import Header from './components/Header'; // Заголовок (возможно, навигационная панель)
import MainContent from './components/MainContent'; // Главный контент, отображаемый на главной странице
import Footer from './components/Footer'; // Футер, который добавляем внизу страницы
import ArticlesPage from './pages/ArticlesPage'; // Страница со списком статей
import ArticleDetailPage from './pages/ArticleDetailPage'; // Страница с детальной информацией о статье
import NewsBestPage from './pages/NewsBestPage'; // Страница с лучшими новостями
import NewDetailPage from './pages/NewDetailPage'; // Страница с подробной информацией о новости
import NewsNewestPage from './pages/NewsNewestPage'; // Страница с самыми новыми новостями
import EditProfilePage from './pages/EditProfilePage'; // Страница для редактирования профиля
import RegisterPage from './pages/RegisterPage'; // Страница регистрации
import LoginPage from './pages/LoginPage'; // Страница входа
import ProtectedRoute from './components/ProtectedRoute'; // Компонент для защиты маршрутов
import AuthenticatedRoute from './components/AuthenticatedRoute'; // Компонент для проверки авторизации пользователя
import CreateArticleForm from './components/CreateArticleForm'; // Форма создания статьи
import CreateNewForm from './components/CreateNewForm'; // Форма создания новости

import './styles/main.css'; // Основные стили
import './styles/index.css'; // Дополнительные стили
import './styles/media.css'; // Медиа стили для адаптивного дизайна

// Основной компонент приложения
const App: React.FC = () => {
  return (
    <Router> {/* Весь контент приложения обернут в Router для управления маршрутами */}
      <Header /> {/* Добавляем заголовок, который, скорее всего, всегда виден */}
      <ToastContainer /> {/* Контейнер для уведомлений Toastify, необходим для отображения уведомлений */}
      
      {/* Определение всех маршрутов приложения */}
      <Routes>
        <Route path="/" element={<MainContent />} /> {/* Главная страница */}
        <Route path="/articles" element={<ArticlesPage />} /> {/* Страница всех статей */}
        <Route path="/articles/:id" element={<ArticleDetailPage />} /> {/* Детальная страница статьи, доступ к которой осуществляется через ID статьи */}
        <Route path="/news-best" element={<NewsBestPage />} /> {/* Страница лучших новостей */}
        <Route path="/news/:id" element={<NewDetailPage />} /> {/* Детальная страница новости, доступ к которой осуществляется через ID новости */}
        <Route path="/news-newest" element={<NewsNewestPage />} /> {/* Страница последних новостей */}
        <Route path="/register" element={<RegisterPage />} /> {/* Страница регистрации пользователя */}
        <Route path="/login" element={<LoginPage />} /> {/* Страница входа в систему */}

        {/* Защищенные маршруты, доступные только определенным ролям */}
        
        {/* Доступ к маршруту создания статьи только для пользователей с ролями 'partner' и 'admin' */}
        <Route element={<ProtectedRoute allowedRoles={['partner', 'admin']} />}>
          <Route path="/create-article" element={<CreateArticleForm />} />
        </Route>

        {/* Доступ к созданию новостей только для администраторов */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/create-new" element={<CreateNewForm />} />
        </Route>

        {/* Редактирование профиля доступно для всех авторизованных пользователей */}
        <Route element={<AuthenticatedRoute />}>
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Route>
      </Routes>

      <Footer /> {/* Добавляем футер на страницу */}
    </Router>
  );
}

export default App;
