import React, { PropTypes } from 'react';
import Splash from './Splash';
import SliderWrapper from './SliderWrapper'

class Gallery extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.smallScreen =  typeof window !== 'undefined' && window && window.innerWidth < 768;
    this.state = {
      selectedImage: 0,
      galleryOpen: !this.smallScreen,
    };
  }

  close() {
    if (window.innerWidth >= 768) {
      this.props.close();
    } else {
      this.setState({ galleryOpen: false });
    }
  }

  render() {
    const { images, close, heading } = this.props;
    const { selectedImage, galleryOpen } = this.state;

    return (
      <div className="splash">
        <Splash images={images} select={i => this.setState({ galleryOpen: true, selectedImage: i })} />
        <div className="splash__top-bar">
          <span className="splash__top-bar__title">{heading}</span>
        </div>
        <div className="splash__close button-close tcneicon-close" onClick={() => close()} />
        {galleryOpen && <SliderWrapper images={images} close={() => this.close()} startIndex={selectedImage} />}
      </div>
    );
  }
}

Gallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string.isRequired,
      text: PropTypes.string,
    })
  ).isRequired,
  close: PropTypes.func.isRequired,
};

export default Gallery;
