const OptionKeys = require("./options").keys;
const Convertor = require("./convertor/convertor");

module.exports = function generate(options) {
  Convertor.prepareOutputDir(options)
    .then(() => Convertor.createSVG(options))
    .then((svg) => Convertor.createTTF(svg, options))
    .then(() => Convertor.createHTML(options))
    .then(() => Convertor.createDart(options))
    // .then((unicode) => Convertor.createDart(options));
};
