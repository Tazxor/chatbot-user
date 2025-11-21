// Importation des modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

//Initialisation d'Express et du serveur HTTP
const app = express();
const server = http.createServer(app);

//Initialisation de Socket.io et attachement au serveur HTTP

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

//Servir les fichiers statiques (le front-end)
// Le fichier 'index.html' sera servi à la racine
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

//Gestion des événements Socket.io (Le cœur du TP)
io.on('connection', (socket) => {

  console.log('Un utilisateur est connecté (ID:', socket.id, ')');

// Événement personnalisé pour la réception des messages

  // socket.on('chat message', (msg) => {
  //   // console.log('Message reçu:', msg);
  //   io.emit('chat message', msg); 
  // });

  socket.on('chat message', (data) => {
  io.emit('chat message', {
    sender: data.sender,
    message: data.message
  });
});

// Gestion de la déconnexion
  socket.on('disconnect', () => {
    console.log('Un utilisateur est déconnecté');
  });
});

// Démarrage du serveur
// const PORT = 3000;
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});