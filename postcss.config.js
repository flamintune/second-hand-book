// postcss.config.mjs
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssPxtorem from 'postcss-pxtorem';

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
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