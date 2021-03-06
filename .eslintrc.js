module.exports = {
    "extends": "airbnb",
    "parserOptions": {
    	"sourceType": "script"
    },
    "rules": {
      "strict": ["error", "global"],
      "radix": ["error", "as-needed"],
      "no-console": ["off"],
      // allowed for mongo's ._id parameter, but should be avoided
      "no-underscore-dangle": ["off"],
      "valid-jsdoc": ["error"],
      "require-jsdoc": ["off"],
      "class-methods-use-this": ["off"],
      "react/jsx-filename-extension": ["off"],
      "global-require": ["off"],
      "react/prop-types": ["off"]
    },
    "env": {
      "node": true
    },
    "globals": {
      "system": true
    },
};
