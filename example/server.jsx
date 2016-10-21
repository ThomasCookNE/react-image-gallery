import Express from 'express';
import path from 'path';

// Initialize the Express App
const app = new Express();

const webpack = require('webpack'); // eslint-disable-line global-require, import/no-extraneous-dependencies
const webpackConfig = require('../webpack.config'); // eslint-disable-line global-require, import/no-extraneous-dependencies
const webpackDevMiddleware = require('webpack-dev-middleware'); // eslint-disable-line global-require, import/no-extraneous-dependencies
const webpackHotMiddleware = require('webpack-hot-middleware'); // eslint-disable-line global-require, import/no-extraneous-dependencies

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
app.use(webpackHotMiddleware(compiler));

// Render Initial HTML
app.get('/', (req, res) => {
  res.end(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>React Image Gallery</title>
      <link href="http://cssjs.dev.int/v2/css/main.css" rel="stylesheet" type="text/css">
    </head>
    <body>
      <div id="container"></div>
      <script src="public/bundle.js"></script>
    </body>
  </html>
  `);
});

// start app
app.listen(3001, (error) => {
  if (!error) {
    console.log(`MERN is running on port: 3001! Build something amazing!`);
  } else {
    console.log('Error on startup', error);
  }
});

export default app;
