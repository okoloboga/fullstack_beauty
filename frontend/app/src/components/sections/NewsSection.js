import React from 'react';
import { Link } from 'react-router-dom';
import newsImage1 from '../../assets/images/news1.png';
import newsImage2 from '../../assets/images/news2.png';
import newsImage3 from '../../assets/images/news3.png';
import newsImage4 from '../../assets/images/news4.png';
import newsImage5 from '../../assets/images/news5.png';
import newsImage6 from '../../assets/images/news6.png';

const NewsSection = () => {
  return (
    <section className="news__section">
      <div className="news__block container">
        <div className="news__block__title flex">
          <div></div>
          <h1 className="title">новости</h1>
        </div>
        <div>
          <div className="news__block__cards flex">
            <div>
              <div className="news__block__card">
                <div>
                  <img src={newsImage1} alt="" />
                  <p>
                    Нашумевший бренд Rhode, который создан Хейли Болдуин в девичестве,
                    сейчас может продать многое.
                  </p>
                </div>
                <Link className="button__without__bg" to="/news-best">
                  Читать далее
                </Link>
              </div>
            </div>
            <div className="flex news__block__cards__gap">
              <div className="news__block__card">
                <div>
                  <img src={newsImage2} alt="" />
                  <p>Essie Punk At Heart Fall 2024 Collection</p>
                </div>
                <Link className="button__without__bg" to="/news-best">
                  Читать далее
                </Link>
              </div>
              <div className="news__block__card">
                <div>
                  <img src={newsImage3} alt="" />
                  <p>Artdeco Cosmetic Summer Brights Collection</p>
                </div>
                <Link className="button__without__bg" to="/news-best">
                  Читать далее
                </Link>
              </div>
            </div>
          </div>
          <div className="news__block__cards2 flex">
            <div className="news__block__card">
              <div>
                <img src={newsImage4} alt="" />
                <p>Осенняя коллекция Dior Map of Paris Makeup Collection Fall 2024</p>
              </div>
              <Link className="button__without__bg" to="/news-best">
                Читать далее
              </Link>
            </div>
            <div className="news__block__card">
              <div>
                <img src={newsImage5} alt="" />
                <p>Новые коллекции от Givenchy и Byredo</p>
              </div>
              <Link className="button__without__bg" to="/news-best">
                Читать далее
              </Link>
            </div>
            <div className="news__block__card">
              <div>
                <img src={newsImage6} alt="" />
                <p>Летняя сказка от Flowerknows</p>
              </div>
              <Link className="button__without__bg" to="/news-best">
                Читать далее
              </Link>
            </div>
          </div>
        </div>
        <div className="news__block__card__btn">
          <Link className="button__with__bg" to="/news-best">
            Все новости
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
