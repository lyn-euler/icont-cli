
// 下划线转换驼峰
const toHump = function (name) {
    return name.replace(/\_(\w)/g, function(all, letter){
        return letter.toUpperCase();
    });
}
// 驼峰转换下划线
const toLine = function (name) {
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}

// 首字母大写
const titleCase = function (str){
    return str.toLowerCase().replace(/^\w|\s\w/g,w=>w.toUpperCase())
}

module.exports = {
    toHump,
    toLine,
    titleCase
}