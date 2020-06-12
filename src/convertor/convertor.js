const SVGIcons2SVGFont = require("svgicons2svgfont");
const OptionKeys = require("../options").keys;
const path = require("path");
const fs = require("fs");
const Unicode = require("../util/unicode");
const svg2ttf = require("svg2ttf");
// const ejs = require("ejs")
const CopyTemplateDir = require("copy-template-dir");
const Name = require("../util/string")
require("colors-cli/toxic");
const shell = require("child_process")

function readSVGFiles(folder) {
  let dir = path.resolve(process.cwd(), folder);

  let files = fs
    .readdirSync(dir, "utf-8")
    .filter(
      (value) => typeof value === "string" && path.extname(value) === ".svg"
    );
  if (!files) {
    throw new Error(`Error! Svg folder is empty.${dir}`);
  }
  
  const result = files.map((value) => path.join(dir, value));
  if(process.env.VERBOSE) {
    console.log("INPUT FILES:".yellow)
    console.log(result.join("\n").yellow)
  }
  return result;
}

/**
 * 准备output文件夹
 * @param {*} options
 */
const prepareOutputDir = (options) =>
  new Promise((resolve, reject) => {
    const outputDir = path.resolve(process.cwd(), options[OptionKeys.output]);
    if (!fs.existsSync(outputDir)) {
      fs.mkdir(outputDir, () => resolve(outputDir));
    } else {
      resolve(outputDir);
    }
  });

const createSVG = (options) =>
  new Promise((resolve, reject) => {
    const icons2Font = new SVGIcons2SVGFont({
      fontName: options[OptionKeys.fontname],
      fixedWidth: true,
    });

    const OUTPUT_SVG_FILE = path.join(
      process.cwd(),
      options[OptionKeys.output],
      options[OptionKeys.fontname] + ".svg"
    );
    icons2Font
      .pipe(fs.createWriteStream(OUTPUT_SVG_FILE))
      .on("finish", () => {
        console.log(`${"SUCCESS::".green} ${"SVG".blue} font create success!
        ===> ${OUTPUT_SVG_FILE}`);
        
        resolve(fs.readFileSync(OUTPUT_SVG_FILE, "utf-8"));
      })
      .on("error", (err) => {
        if (err) {
          console.error(`${err.toString().red}`);
          console.error(err);
          reject(err);
        }
      });
    readSVGFiles(options[OptionKeys.input]).forEach((svg) => {
      let _name = path.basename(svg, ".svg");
      const glyph = fs.createReadStream(svg);
      glyph.metadata = { unicode: Unicode.unicodesForIcon(_name), name: _name };
      icons2Font.write(glyph);
    });
    icons2Font.end();
  });

const createTTF = (svg, options) =>
  new Promise((resolve, reject) => {
    if (!svg) {
      const err = new Error(`Error! can't find svg file!`);
      reject(err)
      return;
    }
    
    let ttf = svg2ttf(svg);

    const OUTPUT_TTF_FILE = path.join(
      process.cwd(),
      options[OptionKeys.output],
      options[OptionKeys.fontname] + ".ttf"
    );
    
    fs.writeFile(OUTPUT_TTF_FILE, ttf.buffer, (err, data) => {
      if (err) {
        console.err(`${"ERROR".red} ${err.toString().red}`);
        return reject(err);
      }
      console.log(
        `${"SUCCESS".green} ${
          "TTF".blue_bt
        } font successfully created! 
        ====> ${OUTPUT_TTF_FILE}`
      );
      resolve(data);
    });
  });

const createHTML = (options) =>
  new Promise((resolve, reject) => {
    // 生成css和html内容
    let cssString = [];
    let iconList = [];

    Object.keys(Unicode.objects).forEach((key) => {
      let unicode = Unicode.objects[key];
      let className = `icont-${key}`;
      cssString.push(
        `
      .${className}:before { 
        content: "\\${unicode.charCodeAt(0).toString(16)}";
      }
      `
      );
      iconList.push(
        `
        <li class="class-icon"><i class="${className}"></i><p class="name">${key}</p></li>`
      );
    });
    const templateDir = path.join(__dirname, "../html");
    const outDir = path.join(process.cwd(), options[OptionKeys.output]);
    const data = {
      cssString: cssString.join(""),
      fontname: options[OptionKeys.fontname],
      timestamp: new Date().getTime(),
      iconList: iconList.join(""),
      cssPath: "index.css",
    };
    CopyTemplateDir(templateDir, outDir, data, (err, html) => {
      if (err) {
        console.error(err);
        reject(err);
      } else {
        console.log(
          `${"SUCCESS".green} ${
            "HTML".blue_bt
          } index.html successfully created! `
        );
        resolve(html);
      }
    });
  });

  const _dartFileInfo = options => {
    const fontname = options[OptionKeys.fontname]
    const filename = Name.toLine(fontname);
    const className = Name.titleCase(Name.toHump(fontname));
    
    const outDir = path.join(process.cwd(), options[OptionKeys.output]);
    const dartFilePath = path.join(outDir, filename+".dart")
    return {fontname, filename, className, outDir, dartFilePath}
  }

const createDart = (options) => new Promise((resolve, reject) => {
  let iconList = [];
  
  Object.keys(Unicode.objects).forEach((name) => {
    let unicode = Unicode.objects[name];
    const code = unicode.charCodeAt(0).toString(16);
   
    iconList.push(
      `
      static const IconData ${name} =
      IconData(0x${code}, fontFamily: _family, fontPackage: _fontPackage);`
    );
  });

  const dartFile = _dartFileInfo(options);
  
  const data = {
    fontname: dartFile.fontname,
    iconList: iconList.join(""),
    filename: dartFile.filename,
    className: dartFile.className,
    timestamp: new Date().getTime(),
  };
  
  const templateDir = path.join(__dirname, "../dart");
  CopyTemplateDir(templateDir, dartFile.outDir, data, (err, dart) => {
    if (err) {
      console.error(err);
      reject(err);
    } else {
      shell.execSync(`
      if [ \`command -v flutter\` ];then
        echo "format dart file"
        flutter format ${dartFile.outDir}
      fi
      `)
      console.log(
        `${"SUCCESS".green} ${
          "DART".blue_bt
        } ${dartFile.filename}.dart successfully created! `
      );
      resolve(dart);
    }
  });
})



module.exports = {
  prepareOutputDir,
  createSVG,
  createTTF,
  createHTML,
  createDart,
  // copyDart
};
