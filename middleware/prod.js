const helmet = require("helmet");
const compression = require("compression");
const func = require("joi/lib/types/func");

module.exports = function (app) {
  app.use(helmet());
  app.use(compression());
};
