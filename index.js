var fs = require("fs");
var showdown = require("showdown");

const { spawn } = require("child_process");
const { onExit } = require("@rauschma/stringio");
const { lstatSync, readdirSync } = require("fs");
const { join } = require("path");

const template = require("./template");

const BUILD_PATH = "./build";

function buildReadme() {
  //TODO: should build an index with the object created by the convertToHtml function
}

const isDirectory = (source) => lstatSync(source).isDirectory();
const getDirectories = (source) =>
  readdirSync(source)
    .map((name) => join(source, name))
    .filter(isDirectory);

const readFiles = (sourceFolder) => {
  fs.readdir(sourceFolder, (err, files) => {
    files.forEach((file) => {
      convertToHtml(sourceFolder, file);
    });

    buildIndex();
  });
};

/**
 * This function ties everything together. It reads the content of the build
 * directory and builds the index.html page with links to all content. Finally,
 * it calls deploy() to deliver the page to Netlify.
 */
const buildIndex = () => {
  let summary = [];
  fs.readdir("./build", (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      if (file != "index.html" && file.split(".").pop() === "html") {
        let li = `<a href=${file}>${file}</a>`;
        summary.push(li);
      }
    });

    const html = template.buildHTML("My blog", summary.join(""));

    fs.writeFile(`${BUILD_PATH}/index.html`, html, function (err) {
      if (err) throw err;
    });

    deploy();
  });
};

const removeExtension = (input) => {
  return input.replace(/\.[^/.]+$/, "");
};

function convertToHtml(dir, source) {
  fs.readFile(`${dir}/${source}`, "utf8", function (err, data) {
    if (err) throw err;
    converter = new showdown.Converter();
    rawHTML = converter.makeHtml(data);
    html = template.buildHTML(removeExtension(source), rawHTML);
    // Creates build directory if it does not exist yet
    if (!fs.existsSync(BUILD_PATH)) {
      fs.mkdirSync(BUILD_PATH);
    }
    fs.writeFile(
      `${BUILD_PATH}/${removeExtension(source)}.html`,
      html,
      function (err) {
        if (err) throw err;
        console.log("Build completed");
      }
    );
  });
}

const deploy = async () => {
  const netlify = spawn("npm", ["run", "netlify"], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });

  await onExit(netlify);

  const netlifyProd = spawn("npm", ["run", "netlify-prod"], {
    stdio: [process.stdin, process.stdout, process.stderr],
  });

  await onExit(netlifyProd);
};

async function main() {
  var directories = getDirectories("./markdown");
  directories.forEach((dir) => {
    readFiles(dir);
  });
}

main();
