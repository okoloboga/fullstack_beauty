import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import NewsBestPage from './pages/NewsBestPage';
import NewsDetailPage from './pages/NewsDetailPage';
import NewsNewestPage from './pages/NewsNewestPage';
import EditProfilePage from './pages/EditProfilePage';


// Импортируйте другие страницы по мере необходимости
import './styles/main.css';
import './styles/index.css';
import './styles/media.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<MainContent />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
        <Route path="/news-best" element={<NewsBestPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/news-newest" element={<NewsNewestPage />} />
        <Route path="/edit-profile" element={<EditProfilePage />} />
        {/* Добавьте другие маршруты */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
