const http = require('http');
const PORT = process.env.PORT || 80;

const requestHandler = (req, res) => {
  res.end('Hello World!');
};

const server = http.createServer(requestHandler);
server.listen(PORT, () => {
  console.log(`Serveur lancé sur le port ${PORT}`);
});

