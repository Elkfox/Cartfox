var Images = {
  getImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|tiff|tif|bmp|bitmap)(\?v=\d+)$/i);

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + "_" + size + suffix);
    }

    return null;
  },

  removeProtocol: function(url) {
    return url.replace(/http(s)?:/, '');
  }
  
};

module.exports = Images;