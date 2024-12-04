import React from 'react';
import girlImage1 from '../../assets/images/second__section__girl.png';
import girlImage2 from '../../assets/images/second__section__girl2.png';
import girlImage3 from '../../assets/images/second__section__girl3.png';
import girlImage4 from '../../assets/images/second__section__girl4.png';
import girlsImage from '../../assets/images/second__section__girls.png';
import './SecondSection.css';

// Компонент SecondSection - секция "О проекте", которая описывает платформу
const SecondSection: React.FC = () => {
  return (
    <section className="second__section">
      <div className="container">
        {/* Заголовок секции */}
        <div className="second__section-title">
          <div></div>
          <h1 className="title">о проекте</h1>
        </div>

        {/* Основные карточки секции */}
        <div className="second__section__cards">
          {/* Первая карточка секции */}
          <div className="second__section__card">
            <h4 className="second__section__card-title flex flex-column">
              <span className="second__section__card-title-1">
                <span>Style</span>.rf - это новое онлайн пространство, где собраны
              </span>
              <span className="second__section__card-title-2">
                все, причастные к бьюти-сфере, в одном месте.
              </span>
              <span className="second__section__card-title-3">
                Это красота, мода, фитнес, визаж, развитие, релакс,
              </span>
              <span className="second__section__card-title-4">
                фото, дизайн, стиль, эстетика и многое другое.
              </span>
            </h4>

            {/* Заголовок для мобильной версии */}
            <h4 className="second__section__card-title flex flex-column">
              <span className="mobile" style={{ width: 'auto', margin: '30px 0 10px' }}>
                <span style={{ fontSize: '40px', lineHeight: '0px' }}>Style.rf </span>
                - это новое онлайн пространство, где собраны все, причастные к бьюти-сфере, в одном месте.
                Это красота, мода, фитнес, визаж, развитие, релакс, фото, дизайн, стиль, эстетика и многое другое.
              </span>
            </h4>

            {/* Блоки с мини-описанием и изображениями */}
            <div className="second__section__card-mini-divs flex justify-between">
              <div className="second__section__card-mini">
                <div>
                  <img src={girlImage1} alt="Девушка" />
                  <img src={girlImage2} alt="Девушка" />
                </div>
                <p>
                  Что модно в этом сезоне?
                  Какой макияж подобрать для свидания в ресторане?
                  Какие продукты помогают улучшить кожу лица?
                  Ответы на эти и многие другие вопросы можно найти на нашем сайте.
                </p>
              </div>

              <div className="second__section__card-mini flex">
                <p>
                  На нашей площадке встречаются люди всех бьюти-профессий и обмениваются опытом!
                  Style.rf - удобный поисковик партнёров для создания совместных проектов,
                  работы над текущими проектами и просто для знакомства и общения.
                  Каждый зарегистрированный пользователь становится партнёром проекта Style.rf.
                  Присоединяйся и пиши, мы ждём именно тебя!
                </p>
                <img src={girlImage3} alt="Девушка" />
              </div>
            </div>
          </div>

          {/* Вторая карточка секции */}
          <div className="second__section__card">
            <h4 className="second__section__card-title flex flex-column">
              <span className="second__section__card-title-1">
                Если вы являетесь экспертом в своей нише
              </span>
              <span className="second__section__card-title-2">
                и хотите поделиться с девушками полезными
              </span>
              <span className="second__section__card-title-3">
                лайфхаками и советами, то скорее регистрируйтесь
              </span>
              <span className="second__section__card-title-4">
                и расскажите о себе и своём деле на нашем сайте.
              </span>
            </h4>

            {/* Заголовок для мобильной версии */}
            <h4 className="second__section__card-title flex flex-column">
              <span className="mobile" style={{ width: 'auto', margin: '30px 0 10px' }}>
                Если вы являетесь экспертом в своей нише и хотите поделиться с девушками полезными лайфхаками
                и советами, то скорее регистрируйтесь и расскажите о себе и своём деле на нашем сайте.
              </span>
            </h4>

            {/* Блоки с мини-описанием и изображениями */}
            <div className="second__section__card__mini flex justify-between">
              <div>
                <img src={girlImage4} alt="Девушка" />
                <p>
                  Девушки, вы ещё не с нами?
                  Тогда скорее подписывайтесь и не пропускайте наши новости
                  и статьи - там кладезь полезной информации, секретные техники
                  и современные тенденции. Присоединяйтесь и преображайтесь вместе с нами!
                </p>
              </div>
              <div>
                <img src={girlsImage} alt="Группа девушек" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecondSection;
