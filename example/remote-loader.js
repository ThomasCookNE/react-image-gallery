var fetch = require('isomorphic-fetch');

module.exports = function remoteLoader(src) {
  var callback = this.async();
  var regex = /@import 'http:\/\/.*';/;
  if (regex.test(src)) {
    var match = regex.exec(src)[0];
    var url = match.substring(9, match.length - 2); // remove "@imort '" and "';" to get url
    return fetch(url).
      then(response => {
        if (response.status >= 400) {
          throw new Error('Bad response from server');
        }
        return response.text();
      }).
      then(text => {
        return src.replace(match, text);
      }).
      then(result => {
        callback(null, result);
      }).
      catch(error => {
        callback(error, src);
      });
  }
  return callback(null, src);
};
