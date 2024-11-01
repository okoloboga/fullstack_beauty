import React from 'react';
import girlImage from '../../assets/images/girl.svg';

const FirstSection = () => {
  return (
    <section className="first__section">
      <div className="first__block">
        <div className="first__block__child flex justify-between">
          <div className="first__block__text flex justify-center item-center text-right flex-column">
            <div>
              <h1 className="base-text-color">
                Style<span className="base-text-color">.rf</span>
              </h1>
            </div>
            <div>
              <p className="base-text-color">
                Бьюти комьюнити. <br />
                Площадка для единомышленников.
              </p>
            </div>
          </div>
          <div className="first__block__img">
            <img src={girlImage} alt="" />
          </div>
        </div>
        <div className="first__block__nav flex">
          <div className="first__block__nav__small-block"></div>
          <div className="first__block__nav__main-block">
            <p>СТИЛЬ</p>
          </div>
          <div className="first__block__nav__main-block">
            <p>МОДА</p>
          </div>
          <div className="first__block__nav__main-block">
            <p>КРАСОТА</p>
          </div>
          <div className="first__block__nav__main-block">
            <p>ЭСТЕТИКА</p>
          </div>
          <div className="first__block__nav__small-block"></div>
        </div>
        <div className="first__block__nav first__block__nav__mobile flex">
          <div className="first__block__nav__small-block"></div>
          <div className="first__block__nav__main-block">
            <p>СТИЛЬ</p>
          </div>
          <div className="first__block__nav__main-block">
            <p>МОДА</p>
          </div>
          <div className="first__block__nav__small-block"></div>
        </div>
      </div>
    </section>
  );
};

export default FirstSection;
