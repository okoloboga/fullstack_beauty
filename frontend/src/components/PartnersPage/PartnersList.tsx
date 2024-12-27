import React, { useState, useEffect, useMemo } from 'react';
import PartnerCard from './PartnerCard';
import filterIcon from '../../assets/images/filter-icon.svg';
import { toast } from 'react-toastify';
import { PartnerDetail, PartnerFilters } from '../../types';
import { fetchUsersByRole } from '../../utils/apiService';

// Компонент списка партнеров
const PartnersList: React.FC = () => {
  // Состояния для управления поиском, фильтрами и загрузкой данных
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
  const [partners, setPartners] = useState<PartnerDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<PartnerFilters>({
    sortBy: null,
  });

  // Запрос на сервер для получения партнеров
  useEffect(() => {
    const loadPartners = async () => {
      try {
        const usersData = await fetchUsersByRole();
        setPartners(usersData);
      } catch (error) {
        toast.error('Не удалось загрузить пользователей');
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []);

  // Обработчик изменения фильтров
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setFilters({
      sortBy: name as PartnerFilters['sortBy'],
    });
  };

  // Фильтрация и сортировка партнеров
  const filteredPartners = useMemo(() => {
    let result = partners;

    // Поиск по имени
    if (searchQuery) {
      result = result.filter((partner) =>
        partner.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Сортировка
    result = result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'alphaUp':
          return a.name.localeCompare(b.name);
        case 'alphaDown':
          return b.name.localeCompare(a.name);
        case 'city':
          return a.city?.localeCompare(b.city || '') || 0;
        case 'articles':
          return b.rating - a.rating; // Здесь можно заменить на количество статей, если оно доступно
        default:
          return 0;
      }
    });

    return result;
  }, [partners, searchQuery, filters.sortBy]);

  // Обработчики для поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div className="partners__div">
      <div className="partners__div__search">
        <div className="partners__controls justify-between">
          <div className="partners__controls__child flex item-center justify-between relative">
            <input
              type="text"
              className="search-input default__input"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Поиск по имени..."
            />
            <button className="filter-btn" onClick={handleOpenPopup}>
              <img src={filterIcon} alt="Фильтр" />
            </button>
          </div>
          {isPopupOpen && (
            <div className="popup">
              <div className="popup-content text-left flex justify-center item-center flex-column">
                <button className="close-btn" onClick={handleClosePopup}>
                  &times;
                </button>
                <div className="flex flex-column">
                  <h2>Сортировать:</h2>
                  <label>
                    <input
                      type="radio"
                      name="alphaUp"
                      checked={filters.sortBy === 'alphaUp'}
                      onChange={handleFilterChange}
                    />{' '}
                    От А до Я
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="alphaDown"
                      checked={filters.sortBy === 'alphaDown'}
                      onChange={handleFilterChange}
                    />{' '}
                    От Я до А
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="city"
                      checked={filters.sortBy === 'city'}
                      onChange={handleFilterChange}
                    />{' '}
                    По городу
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="articles"
                      checked={filters.sortBy === 'articles'}
                      onChange={handleFilterChange}
                    />{' '}
                    По рейтингу
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="partners__block__cards__div">
          <div className="partners__block__cards flex">
            {loading ? (
              <p>Загрузка...</p>
            ) : filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <PartnerCard key={partner.id} partner={partner} />
              ))
            ) : (
              <p>Партнёры не найдены</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersList;
