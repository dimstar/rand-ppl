const http = require('http');
const fs = require('fs');

const log = console.log;

/**
 * Recieves a string and returns a content type.
 * @param {string} resource 
 * @returns {string}
 */
const getContentType = (resource) => {
  const ext = resource.split('.')[1];
  
  switch(ext) {
    case 'js':
      return 'text/javascript';
    case 'css':
      return 'text/css';
    default:
      return 'text/html';
    }
}

/**
 * Handles requests and routes them to available resources
 * @param {http.IncomingMessage} req 
 * @param {http.ServerResponse} res 
 */
const router = (req, res) => {
  const queryIndex = req.url.indexOf('?');
  const fragIndex = req.url.indexOf('#');
  let resource = req.url === '/' ? 'index.html' : req.url;

  // clean off query and fragments
  if( queryIndex > 0) {
    resource = resource.split(queryIndex)[0];
  } else if( fragIndex > 0) {
    resource = resource.split(fragIndex)[0];
  }

  try {
    // Check method
    if(req.method !== 'GET') {
      throw new Error('Not a get request.');
    }
    // Check resource exists
    if(!fs.existsSync(`src/${resource}`)) {
      throw new Error(`Resource "${resource}" does not exist.`);
    }
    res.writeHead(
      200, {
        'content-type': getContentType(resource)
      }
    );
    fs.createReadStream(`src/${resource}`).pipe(res);
  } catch (e) {
    log(e);
    res.writeHead(
      404, {
        'content-type': 'text/html'
      }
    );
    fs.createReadStream(`src/404.html`).pipe(res);
  }
  
}

const server = http.createServer((req, res) => {
  log({ reqUrl: req.url });
  router(req, res);
});

server.listen(process.env.PORT || 3000);
