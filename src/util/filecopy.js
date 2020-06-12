const fs = require("fs");
const path = require("path");

const _filecopy = (srcfile, dist) =>
  new Promise((resolve, reject) => {
    if (!dist) {
      const err = new Error("target dir can't be undefined");
      reject(err);
      return;
    }
    fs.stat(dist, (err, data) => {
      if (err) {
        console.log(
          `${"ERROR:::".red} ${"[DART_COPY]".red} 
          ${err.toString().red}! 
          `
        );
        reject(err);
      } else {
        let targetFile = dist;

        if (data.isDirectory) {
            targetFile = path.join(dist, path.basename(srcfile));
        }
        console.log(srcfile)
        console.log(targetFile)
        fs.copyFileSync(srcfile, targetFile);
        console.log(
          `${"SUCCESS".green} ${" COPY:::".blue_bt} 
          srcfile: ${srcfile} ===> dist: ${targetFile} 
          `
        );
        resolve(true);
      }
    });
  });

const copyfile = (src, dist, ext) =>
  new Promise((resolve, reject) => {
    const srcDir = path.resolve(process.cwd(), src);
    const distDir = path.resolve(process.cwd(), dist);
    let files = fs
      .readdirSync(srcDir, "utf-8")
      .filter((value) => path.extname(value) === `${ext}`);
      files.forEach((file) => {
        _filecopy(path.join(srcDir,file), distDir).catch(err => {
          console.error(err);
          reject(err);
      }) ;
      resolve();
    });
  });

module.exports = copyfile;
