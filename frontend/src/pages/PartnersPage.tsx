import React from 'react';
import ConnectSection from '../components/MainContent/ConnectSection';
import PartnersList from '../components/PartnersPage/PartnersList';
import './styles/PartnersPage.css';

// Компонент страницы с самыми свежими новостями
const PartnersPage: React.FC = () => {
  return (
    <main>
      {/* Основная секция с заголовком и кнопками навигации */}
      <section className="partners container">
        <div className="partners__title text-center">
          <h2 className="title">ПАРТНЕРЫ</h2>
        </div>
        {/* Компонент, отображающий список партнеров */}
        <PartnersList />
      </section>
      {/* Секция для связи с пользователями */}
      <ConnectSection />
    </main>
  );
};

export default PartnersPage;
