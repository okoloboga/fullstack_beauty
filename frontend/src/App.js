import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Импортируем ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Импортируем стили Toastify
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import NewsBestPage from './pages/NewsBestPage';
import NewDetailPage from './pages/NewDetailPage';
import NewsNewestPage from './pages/NewsNewestPage';
import EditProfilePage from './pages/EditProfilePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import CreateArticleForm from './components/CreateArticleForm';

import './styles/main.css';
import './styles/index.css';
import './styles/media.css';

function App() {
  return (
    <Router>
      <Header />
      <ToastContainer /> {/* Добавляем ToastContainer */}
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/news-best" element={<NewsBestPage />} />
        <Route path="/news/:id" element={<NewDetailPage />} />
        <Route path="/news-newest" element={<NewsNewestPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Защищенные маршруты */}
        <Route element={<ProtectedRoute allowedRoles={['partner', 'admin']} />}>
          <Route path="/create-article" element={<CreateArticleForm />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={['partner', 'admin']} />}>
          <Route path="/edit-profile" element={<EditProfilePage />} />
        </Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
