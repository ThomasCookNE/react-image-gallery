import React, { PropTypes } from 'react';

const Splash = ({ images, select }) => {
  return (
    <div className="splash__images">
      {images.map((image, i) => {
        return (
          <div key={i} className={ 'splash__images__' + image.type } onClick={() => select(i)}>
            <div className="content">
              <img src={image.poster || image.url || image.uri} alt={image.text} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

Splash.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string,
      text: PropTypes.string,
    })
  ).isRequired,
  select: PropTypes.func.isRequired,
};

export default Splash;
