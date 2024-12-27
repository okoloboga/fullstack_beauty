import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Импорт useNavigate
import axios from 'axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { createReview, fetchReviews, fetchPartner } from '../utils/apiService'; // Импортируем функцию
import { PartnerDetail, PartnerReview } from '../types';
import './styles/partnerDetailPage.css';
import instagramIcon from '../../assets/images/instagram.svg';
import vkIcon from '../../assets/images/vk.svg';
import telegramIcon from '../../assets/images/telegram.svg';
import facebookIcon from '../../assets/images/facebook.svg';
import phoneIcon from '../../assets/images/phone.svg';
import star0Icon from '../../assets/images/star0.svg';
import star1Icon from '../../assets/images/star1.svg';
import star2Icon from '../../assets/images/star2.svg';
import star3Icon from '../../assets/images/star3.svg';
import star4Icon from '../../assets/images/star4.svg';
import star5Icon from '../../assets/images/star5.svg';
import ConnectSection from '../components/MainContent/ConnectSection';

const apiUrl = process.env.REACT_APP_API_URL;

const PartnerDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [partner, setPartner] = useState<PartnerDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [reviews, setReviews] = useState<PartnerReview[]>([]);
  const [newReview, setNewReview] = useState<string>('');

	const starIcons = [star0Icon, star1Icon, star2Icon, star3Icon, star4Icon, star5Icon];

  // Функция для получения данных о статье
  const getPartner = async () => {
    try {
      if (id) {
        const data = await fetchPartner(id); // Вызов функции из partnerService
        setPartner(data);
      } else {
        setError('Невалидный идентификатор профиля');
      }
    } catch (err) {
      setError('Ошибка при загрузке профиля');
      console.error('Ошибка при загрузке профиля:', err);
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения отзывов
  const getReviewsForPartner = async () => {
    try {
      if (id) {
        const data = await fetchReviews(Number(id)); // Получаем комментарии для статьи
        setReviews(data);
      }
    } catch (err) {
      toast.error("Ошибка при загрузке комментариев");
    }
  };

  useEffect(() => {
    getReviewsForPartner();  
    getPartner(); // Загружаем статью при монтировании компонента
  }, [id]);

  if (loading) {
    return <div>Загрузка профиля...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!partner) {
    return <div>Профиль не найден</div>;
  }

  // Функции для переключения изображений в слайдере
  const prevImage = () => {
    if (partner?.portfolioImages) {
      setCurrentImageIndex(
        currentImageIndex === 0
          ? partner.portfolioImages.length - 1
          : currentImageIndex - 1
      );
    }
  };

  const nextImage = () => {
    if (partner?.portfolioImages) {
      setCurrentImageIndex(
        currentImageIndex === partner.portfolioImages.length - 1
          ? 0
          : currentImageIndex + 1
      );
    }
  };

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewReview(e.target.value); // Обновляем состояние при изменении текста отзыва
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (newReview.trim()) {
      try {
        // Попытка отправить отзыв
        await createReview(partner!.id, newReview);
  
        // Если отзыв успешно добавлен
        console.log('Новый отзыв:', newReview);
  
        // Обновляем список отзывов с новым добавленным отзывом
        await getReviewsForPartner();
  
        // Обновляем счетчик отзывов
        if (partner) {
          setPartner({
            ...partner,
            reviews: (partner.reviews || 0) + 1, // Увеличиваем счетчик
          });
        }
  
        // Очистить поле ввода после отправки
        setNewReview('');
      } catch (error: unknown) {
        // Если возникает ошибка, мы её обрабатываем
        console.error('Ошибка при добавлении отзыва:', error);
  
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Ошибка при добавлении отзыва');
        } else if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error('Произошла неизвестная ошибка');
        }
      }
    } else {
      // Если комментарий пустой
      toast.warning('Отзыв не может быть пустым');
    }
  };

  return (
    <main>
      <section className="partner__section container">
				<div className="partner-card">
					{/* Изображение профиля */}
					<div className="card__image-wrap">
						<img
							src={partner.profileImage ? `${apiUrl}/${partner.profileImage}` : '/default-avatar.png'}
							alt={partner.name}
							className="card__image"
						/>
						<div className="card__contact-sm">
							<h3 className="card__contact-title">Связаться</h3>
							<div className="social-icons flex">
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
						<div className="card__image-info">
							<div>
								<span>{partner.city}</span>
								<p>{partner.activity}</p>
							</div>
						</div>
					</div>

					{/* Контент карточки */}
					<div className="partners__card-content">
						<div className="first__block">
							<h2 className="card__name">{partner.name}</h2>
							<span className="card__location">{partner.city}</span>
							<p className="card__job">{partner.activity}</p>
						</div>

						{/* Рейтинг */}
						<div className="card__rating">
							<p>Рейтинг: {partner.rating.toFixed(1)}</p>
							<div className="stars">
								<img
								src={starIcons[Math.round(partner.rating)]}
								alt={`Рейтинг: ${partner.rating}`}
								className="rating-icon"
								/>
							</div>
						</div>

						{/* Описание */}
						<h3 className="card__point">О партнёре</h3>
						<p className="card__description">{partner.about}</p>

						{/* Портфолио */}
						<h3 className="card__point">Портфолио</h3>
						<div className="portfolio">
							{partner.portfolioImages ? (
								<img
									src={`${apiUrl}/${partner.portfolioImages}`}
									alt={`${partner.name} Portfolio`}
									className="card__portfolio"
								/>
							) : (
								<p>Портфолио отсутствует</p>
							)}
						</div>
					</div>
				</div>

        {/* Форма для нового отзыва */}
        <div className="partner__create__review">
          <div></div>
          <div className="flex flex-column" style={{ gap: '20px' }}>
            <p>Отзывы</p>
            <input 
              type="text" 
              value={newReview} 
              onChange={handleReviewChange} 
              placeholder="Напишите ваш комментарий..."
            />
            <button 
              className="button__without__bg"
              onClick={handleReviewSubmit} 
              disabled={!newReview.trim()}
            >
              Отправить
            </button>
          </div>
        </div>

        {/* Список отзывов */}
        <div className="partner__comments">
          <div></div>
          <div className="flex flex-column">
            {reviews.length === 0 ? (
              <p>Нет комментариев</p>
            ) : (
              reviews.map((review) => (
                <div className="partner__review" key={review.id}>
                  <div className="flex flex-column">
                    <h3>{review.author}</h3>
                    <p>{new Date(review.createdAt).toLocaleString('ru-RU')}</p>
                  </div>
                  <div>
                    <p>{review.contentText}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </section>
      <ConnectSection />
    </main>
  );
};

export default PartnerDetailPage;
