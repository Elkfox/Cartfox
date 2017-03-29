const Images = {
  getImageUrl: (src, size) => {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    const match = src.match(/\.(jpg|jpeg|gif|png|tiff|tif|bmp|bitmap)(\?v=\d+)$/i);

    if (match !== null) {
      const prefix = src.split(match[0]);
      const suffix = match[0];

      return this.removeProtocol(`${prefix[0]}_${size}${suffix}`);
    }

    return null;
  },

  removeProtocol: url => url.replace(/http(s)?:/, ''),
};

module.exports = Images;
