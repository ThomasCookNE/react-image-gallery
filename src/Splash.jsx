import React, { PropTypes } from 'react';

const Splash = ({ images, select }) => {
  return (
    <div className="splash__images">
      {images.map((image, i) => {
        let className = image.type === 'video' ? 'splash__images__video' : 'splash__images__image';
        return (
          <div key={i} className={className}>
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
