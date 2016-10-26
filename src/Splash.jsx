import React, { PropTypes } from 'react';
import classNames from 'classnames';

const Splash = ({ images, select }) => {
  return (
    <div className="splash__images">
      {images.map((image, i) => {
        return (
          <div key={i} className={classNames({ 'splash__images__image': image.type === 'image', 'splash__images__video': image.type === 'video' })} onClick={() => select(i)}>
            <div className="content">
              <img src={image.poster || image.uri} alt={image.text} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

Splash.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string.isRequired,
      text: PropTypes.string,
    })
  ).isRequired,
  select: PropTypes.func.isRequired,
};

export default Splash;
