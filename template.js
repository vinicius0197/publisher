function buildHTML(title, input) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="styles.css">
    </head>
    <body class="container">    
    ${input}
    
    </body>
    </html>
    `;
}

module.exports = { buildHTML };
