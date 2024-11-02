// src/pages/EditProfilePage.js
import React from 'react';
import ProfileNavigation from '../components/ProfileNavigation';
import EditProfileForm from '../components/EditProfileForm';
import ConnectSection from '../components/sections/ConnectSection';

const EditProfilePage = () => {
  return (
    <main>
      <section className="container">
        <h1 className="title text-center main__title">ЛИЧНЫЙ КАБИНЕТ</h1>
        <ProfileNavigation active="edit-profile" />
      </section>
      <section className="container edit__profile-form">
        <EditProfileForm />
        {/* Рейтинг пользователя */}
        <div className="user__stars">
          <div className="flex item-center gap-2">
            {/* Отображение звезд */}
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
      <ConnectSection />
    </main>
  );
};

export default EditProfilePage;
