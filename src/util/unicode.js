let UnicodeObject = {};

let startUnicode = 0xea01;

function unicodesForIcon(name) {
  const unicode = UnicodeObject[name];
  if (unicode) {
    return [unicode];
  }
  let newUnicode = String.fromCharCode(startUnicode++);
  UnicodeObject[name] = newUnicode;
  return [newUnicode];
}

module.exports = {
    unicodesForIcon: unicodesForIcon,
    objects: UnicodeObject
}