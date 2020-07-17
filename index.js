var showdown = require("showdown");
var fs = require("fs");

/**
 * 1) should open a folder with markdown files and create an object with keys being names of folders
 *    and contents being the converted HTML content
 * 2) create HTML template with sample CSS styling
 * 3) Add searchbox for searching markdown
 * 4) Deploy script to upload easily
 */
fs.readFile("markdown/test.md", "utf8", function (err, data) {
  if (err) throw err;
  converter = new showdown.Converter();
  html = converter.makeHtml(data);
  console.log(html);
});
