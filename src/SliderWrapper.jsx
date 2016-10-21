import React, { Component, PropTypes } from 'react';
import Slider from './Slider';
import classNames from 'classnames';

const containerMaxWidth = 1280;
let offsetTop = 0;

function debounce(func, wait, immediate) {
  let timeout;
  return () => {
    const context = this;
    const args = arguments; // eslint-disable-line
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

class SliderWrapper extends Component {
  constructor(props) {
    super(props);
    this.checkHeightLimit = this.checkHeightLimit.bind(this);
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    this.setMaxWidth = iOS ? debounce(this.setMaxWidth.bind(this), 500) : () => {};
  }

  componentWillMount() {
    const smallScreen = window.innerWidth < 768;
    const isTouch = window.Modernizr && window.Modernizr.touch;

    this.setState({
      showThumbnails: !(smallScreen && isTouch),
    });
    this.last = 0;
    this.lastlast = 0;
  }

  componentDidMount() {
    this.disableBodyScroll();
    this.checkHeightLimit();
    window.addEventListener('resize', this.checkHeightLimit);
  }

  componentWillUnmount() {
    this.enableBodyScroll();
    window.removeEventListener('resize', this.checkHeightLimit);
  }

  setMaxWidth() {
    const contentHeight = this.contentWrapper.clientHeight;
    const contentWidth = this.contentWrapper.clientWidth;
    this.setState({
      contentHeight,
      contentWidth,
    });
  }

  enableBodyScroll() {
    document.body.classList.remove('no-scroll');
    scrollTo(0, offsetTop);
  }

  disableBodyScroll() {
    offsetTop = window.pageYOffset;
    document.body.classList.add('no-scroll');
  }

  checkHeightLimit() {
    const ratio = 1.5;
    let thumbHeight = 127;
    if (typeof window !== 'undefined') {
      const viewHeight = window.innerHeight;
      const viewWidth = window.innerWidth;

      if (viewWidth < 768) {
        thumbHeight = 0; // thumbnails hidden for < ipad
      }

      const heightLimitForWidth = (viewHeight - thumbHeight) * ratio;
      if (heightLimitForWidth < viewWidth) {
        this.setState({
          containerStyle: {
            width: heightLimitForWidth,
            marginTop: -thumbHeight,
            maxWidth: containerMaxWidth,
          },
          contentHeight: null,
          contentWidth: null,
        });
      // fix image overflowing thumbnails for special case for example width: 1550 height: 960
      } else if (viewHeight < ((Math.min(viewWidth, containerMaxWidth) / ratio) + (2 * thumbHeight))) {
        const marginTop = viewHeight - ((Math.min(viewWidth, containerMaxWidth) / ratio) + (2 * thumbHeight));
        this.setState({
          containerStyle: {
            width: '100%',
            marginTop,
            maxWidth: containerMaxWidth,
          },
          contentHeight: null,
          contentWidth: null,
        });
      } else {
        this.setState({
          containerStyle: {
            maxWidth: containerMaxWidth,
          },
          contentHeight: null,
          contentWidth: null,
        });
      }
      this.setMaxWidth();
    }
  }

  renderItem(item) {
    const { contentHeight, contentWidth } = this.state;

    return (
      <div className="gallery__imagecontainer">
        <div className={classNames('image-gallery__image', { 'image-gallery__image--portrait': item.portrait })}>
          <div className="content">
            <img
              src={item.original}
              alt={item.originalAlt}
              srcSet={item.srcSet}
              sizes={item.sizes}
              style={{
                maxHeight: contentHeight,
                maxWidth: contentWidth,
              }}
            />
            {item.description &&
              <span className="image-gallery__description">
                <span className="image-gallery__description__text">
                  {item.description}
                </span>
              </span>
            }
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { showThumbnails, containerStyle, contentHeight, contentWidth } = this.state;
    const { images, close, startIndex } = this.props;
    const items = images.map(image => {
      const portrait = image.width && image.height && image.height > image.width;
      return {
        original: image.uri,
        thumbnail: image.uri,
        description: image.text,
        portrait,
      };
    });

    return (
      <div className="gallery" onClick={e => !e.defaultPrevented && close()}>
        <div className="gallery__container" style={containerStyle}>
          <a className="button-close shadow tcneicon-close" />
          <div ref={i => (this.contentWrapper = i)} className="gallery__content" onClick={e => e.preventDefault()}>
            <Slider
              ref={i => (this.imageGallery = i)}
              items={items}
              showIndex
              onClick={() => this.imageGallery.slideToIndex(this.imageGallery.getCurrentIndex() + 1)}
              renderItem={item => this.renderItem(item)}
              showThumbnails={showThumbnails}
              maxHeight={contentHeight}
              maxWidth={contentWidth}
              startIndex={startIndex}
            />
          </div>
        </div>
      </div>
    );
  }
}

SliderWrapper.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      uri: PropTypes.string.isRequired,
      text: PropTypes.string,
    })
  ),
  close: PropTypes.func,
  startIndex: PropTypes.number,
};

SliderWrapper.defaultProps = {
  startIndex: 0,
};

export default SliderWrapper;
