import React from 'react';
import ProfileNavigation from '../components/ProfileNavigation';
import EditProfileForm from '../components/EditProfileForm';
import ConnectSection from '../components/MainContent/ConnectSection';
import './styles/EditProfilePage.css';

// Компонент страницы редактирования профиля пользователя
const EditProfilePage: React.FC = () => {
  return (
    <main>
      {/* Основная секция с заголовком и навигацией профиля */}
      <section className="container">
        <h1 className="title text-center main__title">ЛИЧНЫЙ КАБИНЕТ</h1>
        {/* Навигация по личному кабинету, активная вкладка - редактирование профиля */}
        <ProfileNavigation active="edit-profile" />
      </section>

      {/* Секция с формой редактирования профиля */}
      <EditProfileForm />
      
      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default EditProfilePage;
