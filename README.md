React Image Gallery
===

## Getting started

```
npm install @tcne/web-react-image-gallery

import Gallery from '@tcne/web-react-image-gallery'; // react comp
import '../node_modules/@tcne/web-react-image-gallery/src/gallery'; // css

const images = [
  {
    uri: '//images1.ving.se/images/Hotel/HERASPR1062_2_30.jpg?v=2',
    text: 'enrumslägenhet',
  },
]

...
  return (
    <Gallery images={images} close={() => {}} />
  );
```

## development
```
npm start
```
