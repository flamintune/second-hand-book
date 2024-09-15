module.exports = {
    plugins: {
      'postcss-pxtorem': {
        rootValue: 16,
        propList: ['*'],
        selectorBlackList: ['ignore-'],
        replace: true,
        mediaQuery: false,
        minPixelValue: 0,
      },
    },
  };