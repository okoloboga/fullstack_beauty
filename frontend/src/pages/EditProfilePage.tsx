import React from 'react';
import ProfileNavigation from '../components/ProfileNavigation';
import EditProfileForm from '../components/EditProfileForm';
import ConnectSection from '../components/sections/ConnectSection';

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
      <section className="container edit__profile-form">
        <EditProfileForm />

        {/* Рейтинг пользователя */}
        <div className="user__stars">
          <div className="flex item-center gap-2">
            {/* Отображение звезд рейтинга пользователя */}
            {[...Array(5)].map((_, index) => (
              <img
                key={index}
                src="/images/star-filled.svg"
                alt="Star"
                width={30}
                height={30}
              />
            ))}
          </div>
          <p>4.0</p>
        </div>
      </section>

      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default EditProfilePage;
