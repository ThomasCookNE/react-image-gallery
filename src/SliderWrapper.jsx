import React, { Component, PropTypes } from 'react';
import Slider from './Slider';
import classNames from 'classnames';
import keycode from 'keycode';

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

    let videoPlaying = -1;
    if (props.images[props.startIndex] && props.images[props.startIndex].type === 'video') {
      videoPlaying = props.startIndex;
    }
    this.state = {
      theatre: false,
      videoPlaying,
    };
    this.videoRefs = [];
    this.checkHeightLimit = this.checkHeightLimit.bind(this);
    this.onSlide = this.onSlide.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.onKeyBoardEvent = this.onKeyBoardEvent.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    const iOS = typeof navigator !== 'undefined'
      && typeof window !== 'undefined'
      && /iPad|iPhone|iPod/.test(navigator.userAgent)
      && !window.MSStream;
    this.setMaxWidth = iOS ? debounce(this.setMaxWidth.bind(this), 500) : () => {};
  }

  componentWillMount() {
    const smallScreen = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTouch = typeof window !== 'undefined' && window.Modernizr && window.Modernizr.touch;

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
    document.addEventListener('keydown', this.onKeyBoardEvent, false);
  }

  componentWillUnmount() {
    this.enableBodyScroll();
    window.removeEventListener('resize', this.checkHeightLimit);
    document.removeEventListener('keydown', this.onKeyBoardEvent, false);
  }

  onKeyBoardEvent(event) {
    switch (keycode(event)) {
      case 'esc':
        this.props.close();
        break;
      case 'space':
      case 'k':
        this.togglePlay(this.imageGallery.getCurrentIndex());
        break;
      case 'up':
        this.videoRefs[this.imageGallery.getCurrentIndex()].volume = Math.min(1, 0.05 + this.videoRefs[this.imageGallery.getCurrentIndex()].volume);
        break;
      case 'down':
        this.videoRefs[this.imageGallery.getCurrentIndex()].volume = Math.max(0, -0.05 + this.videoRefs[this.imageGallery.getCurrentIndex()].volume);
        break;
      case 'm':
        this.videoRefs[this.imageGallery.getCurrentIndex()].muted = !this.videoRefs[this.imageGallery.getCurrentIndex()].muted;
        break;
      default:
        break;
    }
  }

  togglePlay(index) {
    const { videoPlaying } = this.state;
    if (this.videoRefs[index]) {
      if (videoPlaying === index) {
        this.videoRefs[index].pause();
        this.setState({
          videoPlaying: -1,
          theatre: false,
        });
      } else {
        this.videoRefs[index].play();
        this.setState({
          videoPlaying: index,
          theatre: true,
        });
      }
    }
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
    document.body.classList.remove('gallery');
    scrollTo(0, offsetTop);
  }

  disableBodyScroll() {
    offsetTop = window.pageYOffset;
    document.body.classList.add('gallery');
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

  onSlide(index) {
    const { videoPlaying } = this.state;
    if (videoPlaying >= 0 && this.videoRefs[videoPlaying]) {
      this.videoRefs[videoPlaying].pause();
      this.setState({ videoPlaying: -1 });
    }
  }

  renderItem(item, index) {
    const { startIndex } = this.props;
    const { contentHeight, contentWidth, videoPlaying } = this.state;

    let content = null;
    let icon = null;
    switch (item.type) {
      case 'video':
        content = (
          <video
            ref={v => (this.videoRefs[index] = v)}
            src={item.original}
            autoPlay={index === startIndex}
            loop
            style={{
              maxHeight: contentHeight,
              maxWidth: contentWidth,
            }}
          />
        );
        icon = (
          <span
            className={classNames({
              'video-play': videoPlaying !== index,
              'video-pause': videoPlaying === index,
            })}
            onClick={(e) => {
              e.preventDefault();
              this.togglePlay(index);
            }}
          />
        );
        break;
      case 'image':
      default:
        content = (
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
        );
        break;
    }
    return (
      <div className="gallery__imagecontainer">
        <div className={classNames(`image-gallery__${item.type}`, { 'image-gallery__image--portrait': item.portrait })}>
          <div className="content">
            {content}
            {icon}
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
    const { showThumbnails, containerStyle, contentHeight, contentWidth, theatre } = this.state;
    const { images, close, startIndex } = this.props;
    const items = images.map(image => {
      const portrait = image.width && image.height && image.height > image.width;
      return {
        original: image.uri,
        thumbnail: image.thumbnail || image.uri,
        description: image.text,
        poster: image.poster,
        type: image.type || 'image',
        portrait,
      };
    });

    return (
      <div className={classNames('gallery', { 'gallery--theatre': theatre })} onClick={e => !e.defaultPrevented && close()}>
        <div className="gallery__container" style={containerStyle}>
          <a className="button-close shadow tcneicon-close" />
          <div ref={i => (this.contentWrapper = i)} className="gallery__content" onClick={e => e.preventDefault()}>
            <Slider
              ref={i => (this.imageGallery = i)}
              items={items}
              showIndex
              onSlide={this.onSlide}
              onClick={(e) => !e.defaultPrevented && this.setState({ theatre: !theatre })}
              renderItem={this.renderItem}
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
      type: PropTypes.string,
    })
  ),
  close: PropTypes.func,
  startIndex: PropTypes.number,
};

SliderWrapper.defaultProps = {
  startIndex: 0,
};

export default SliderWrapper;
