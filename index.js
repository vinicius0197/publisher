var showdown = require("showdown");
const { spawn } = require("child_process");
const { onExit } = require("@rauschma/stringio");
var fs = require("fs");

const BUILD_PATH = "./build";

function convertToHtml() {
  fs.readFile("markdown/test.md", "utf8", function (err, data) {
    if (err) throw err;
    converter = new showdown.Converter();
    html = converter.makeHtml(data);
    // Creates build directory if it does not exist yet
    if (!fs.existsSync(BUILD_PATH)) {
      fs.mkdirSync(BUILD_PATH);
    }
    fs.writeFile(`${BUILD_PATH}/index.html`, html, function (err) {
      if (err) throw err;
      console.log("Build completed");
    });
  });
}

async function main() {
  convertToHtml();
  const netlify = spawn("npm", ["run", "netlify"], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });

  await onExit(netlify);

  const netlifyProd = spawn("npm", ["run", "netlify-prod"], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });

  await onExit(netlifyProd);

  console.log("Done");
}

main();
