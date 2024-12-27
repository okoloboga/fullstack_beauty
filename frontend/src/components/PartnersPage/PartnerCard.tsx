import React from 'react';
import { PartnerCardProps } from '../../types'; // Убедитесь, что путь корректен
import instagramIcon from '../../assets/images/instagram.svg';
import vkIcon from '../../assets/images/vk.svg';
import telegramIcon from '../../assets/images/telegram.svg';
import facebookIcon from '../../assets/images/facebook.svg';
import phoneIcon from '../../assets/images/phone.svg';
import noPhoto from '../../assets/images/no-image.png';
import rightArrow from '../../assets/images/right-arrow.svg'; // Путь к правому стрелочному изображению
import articleIcon from '../../assets/images/article.svg';
import reviewIcon from '../../assets/images/review.svg';
import star0Icon from '../../assets/images/star0.svg';
import star1Icon from '../../assets/images/star1.svg';
import star2Icon from '../../assets/images/star2.svg';
import star3Icon from '../../assets/images/star3.svg';
import star4Icon from '../../assets/images/star4.svg';
import star5Icon from '../../assets/images/star5.svg';

const apiUrl = process.env.REACT_APP_API_URL;

const PartnerCard: React.FC<PartnerCardProps> = ({ partner }) => {
  // Функция для генерации звезд рейтинга
  const starIcons = [star0Icon, star1Icon, star2Icon, star3Icon, star4Icon, star5Icon];

  console.log('partner.reviews', partner);

  return (
    <section className="cards container">
      <div className="partners__card">
        {/* Изображение профиля */}
        <div className="card__image-wrap">
          <img
            className="card__image"
            src={partner.profileImage ? `${apiUrl}/${partner.profileImage}` : noPhoto}
            alt={partner.name}
          />

          {/* Контакты (верхняя часть) */}
          <div className="card__contact-sm">
            <h3 className="card__point card__contact-title">Связаться</h3>
            <div className="flex items-center" style={{ gap: '10px' }}>
              {partner.instagram && (
                <a href={partner.instagram} target="_blank" rel="noopener noreferrer">
                  <img src={instagramIcon} alt="Instagram" />
                </a>
              )}
              {partner.vk && (
                <a href={partner.vk} target="_blank" rel="noopener noreferrer">
                  <img src={vkIcon} alt="VK" />
                </a>
              )}
              {partner.telegram && (
                <a href={partner.telegram} target="_blank" rel="noopener noreferrer">
                  <img src={telegramIcon} alt="Telegram" />
                </a>
              )}
              {partner.facebook && (
                <a href={partner.facebook} target="_blank" rel="noopener noreferrer">
                  <img src={facebookIcon} alt="Facebook" />
                </a>
              )}
              {partner.phone && (
                <a href={`tel:${partner.phone}`}>
                  <img src={phoneIcon} alt="Phone" />
                </a>
              )}
            </div>
          </div>

          {/* Информация об изображении */}
          <div className="card__image-info">
            <div className="flex gap-2 items-center">
              <div className="flex items-center article__count-sm">
                <img src={articleIcon} alt="Article" />
                <p style={{ fontSize: '24px' }}>{partner.articles}</p>
              </div>
            </div>
            <div>
              <span>{partner.city}</span>
              <p>{partner.activity}</p>
            </div>
          </div>
        </div>

        {/* Контент карточки */}
        <div className="partners__card-content">
          <div className="flex justify-between first__block">
            <div>
              <div className="flex card__identity">
                <h2 className="base-text-color card__name">{partner.name}</h2>
                <div className="flex items-center article__count">
                  <img src={reviewIcon} alt="Article" />
                  <p>{partner.reviews}</p>
                </div>
              </div>
              <span className="card__location">{partner.city}</span>
            </div>
            <div className="flex card__rating">
              <div className="flex items-center article__count">
                <img src={articleIcon} alt="Article" />
                <span>{partner.articles}</span>
              </div>
              <div className="card__stars-wrap">
                <div className="flex items-center card__stars">
                  {/* Рейтинг */}
                  <div className="card__rating">
                    <div className="stars">
                      <img
                      src={starIcons[Math.round(partner.rating)]}
                      alt={`Рейтинг: ${partner.rating}`}
                      className="rating-icon"
                      />
                    </div>
                  </div>
                </div>
                <p className="text-right">{partner.rating.toFixed(1)}</p>
              </div>
            </div>
          </div>
          <p className="card__job">{partner.activity}</p>
          <h3 className="card__point">О партнёре</h3>
          <p className="card__description">{partner.about}</p>

          {/* Портфолио */}
          <h3 className="card__point">Портфолио</h3>
          {/* Слайдер с изображениями портфолио */}
          {partner.portfolioImages && partner.portfolioImages.length > 0 && (
            <div className="portfolio-images">
              {/* Отображаем первые 3 изображения */}
              {partner.portfolioImages.slice(0, 3).map((image, index) => (
                <div key={index} className="portfolio-image">
                  <img
                    src={`${process.env.REACT_APP_API_URL}/${image}`}
                    alt={`portfolio-${index}`}
                    loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/path/to/fallback-image.jpg'; }}
                  />
                </div>
              ))}

              {/* Если изображений больше 3, отображаем индикатор */}
              {partner.portfolioImages.length > 3 && (
                <div className="portfolio-image extra-images">
                  <span>+{partner.portfolioImages.length - 3}</span>
                </div>
              )}
            </div>
          )}
          {/* Контакты (нижняя часть) */}
          <div className="card__contact">
            <h3 className="card__point card__contact-title">Связаться</h3>
            <div className="flex items-center" style={{ gap: '10px' }}>
              {partner.instagram && (
                <a href={partner.instagram} target="_blank" rel="noopener noreferrer">
                  <img src={instagramIcon} alt="Instagram" />
                </a>
              )}
              {partner.vk && (
                <a href={partner.vk} target="_blank" rel="noopener noreferrer">
                  <img src={vkIcon} alt="VK" />
                </a>
              )}
              {partner.telegram && (
                <a href={partner.telegram} target="_blank" rel="noopener noreferrer">
                  <img src={telegramIcon} alt="Telegram" />
                </a>
              )}
              {partner.facebook && (
                <a href={partner.facebook} target="_blank" rel="noopener noreferrer">
                  <img src={facebookIcon} alt="Facebook" />
                </a>
              )}
              {partner.phone && (
                <a href={`tel:${partner.phone}`}>
                  <img src={phoneIcon} alt="Phone" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerCard;
