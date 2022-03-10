module.exports = {
  "root": true,
  "parserOptions": {
    "parser": "babel-eslint"
  },
  "env": {
    "browser": true,
    "node": true,
    "es6": true
  },
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  "extends": ["plugin:vue/essential", "standard"],
  // required to lint *.vue files
  "plugins": [
    "import",
    "vue",
    "html"
  ],
  // check if imports actually resolve
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "./node_modules/start-kit-builder/build/webpack.base.conf.js"
      }
    },
    "import/core-modules": ["env"]
  },
  // add your custom rules here
  "rules": {
    "import/extensions": "off",
    "no-new": 0,
    "no-param-reassign": 0,
    "generator-star-spacing": "off",
    "no-tabs": "off",
    "vue/no-parsing-error": [2, {
      "x-invalid-end-tag": false,
      "invalid-first-character-of-tag-name": false
    }],
    "space-before-function-paren": 0,
    "object-curly-spacing": 0,
    "semi": "off",
    "no-undef": "off",
    "camelcase": "off"
  }
}
