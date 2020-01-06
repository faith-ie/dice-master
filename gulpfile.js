const {src, dest} = require("gulp");
const ts = require("gulp-typescript");

module.exports = {
  compile() {
    return src("./src/**/*.ts").pipe(ts("tsconfig.json")).pipe(dest("./out/"));
  }
}
