module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "jsx-a11y",
    "import"
  ],
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module"
  },
  "env": {
    "browser": true,
    "es6": true,
    "jquery": true
  },
  "rules": {
    "strict": 0,
    "brace-style": 0,
    "arrow-body-style": 0,
    "jsx-a11y/no-static-element-interactions": 0,
    "react/forbid-prop-types": 0,
    "react/jsx-indent": 0,
    "react/no-danger": 0,
    "react/jsx-first-prop-new-line": 0,
    "react/jsx-closing-bracket-location": 0,
    "react/jsx-no-bind": 0,
    "react/prefer-stateless-function": 0,
    "react/jsx-filename-extension": 0,
    "object-property-newline": 0,
    "no-nested-ternary": 0,
    "no-console": 0,
    "no-prototype-builtins": 0,
    "class-methods-use-this": 0,
    "comma-dangle": [
      "warn",
      "never"
    ],
    "indent": [
      "warn",
      2
    ],
    "linebreak-style": [
      "warn",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    /* Advanced Rules*/
    "no-unused-expressions": "warn",
    "no-useless-concat": "warn",
    "block-scoped-var": "error",
    "consistent-return": "error"
  }
};
