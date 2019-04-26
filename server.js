net = require('net');

// Keep track of the chat clients
var clients = [];

// Start a TCP Server
net
    .createServer(function (socket) {
        // Identify this client
        socket.name = socket.remoteAddress + ':' + socket.remotePort;

        // Put this new client in the list
        clients.push(socket);

        // Send a nice welcome message and announce

        broadcast(socket.name + ' joined the chat\n', socket);

        // Handle incoming messages from clients.
        socket.on('data', function (data) {
            broadcast(data, socket);
        });

        // Remove the client from the list when it leaves
        socket.on('end', function () {
            clients.splice(clients.indexOf(socket), 1);
            broadcast(socket.name + ' left the chat.\n');
        });

        // Send a message to all clients
        function broadcast(message, sender) {
            clients.forEach(function (client) {
                client.write(message);
            });
            // Log it to the server output too
            process.stdout.write(message);
        }
    })
    .listen(8080);

// Put a friendly message on the terminal of the server.
console.log('Chat server running at port 8080\n');