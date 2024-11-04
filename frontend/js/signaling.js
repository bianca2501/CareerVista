const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3000 });

let clients = {};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message) {
        const data = JSON.parse(message);
        
        switch(data.type) {
            case 'register':
                clients[data.id] = ws;
                break;
            case 'signal':
                const targetClient = clients[data.targetId];
                if (targetClient) {
                    targetClient.send(JSON.stringify({
                        type: 'signal',
                        signal: data.signal,
                        fromId: data.fromId
                    }));
                }
                break;
            case 'chat':
                const chatClient = clients[data.targetId];
                if (chatClient) {
                    chatClient.send(JSON.stringify({
                        type: 'chat',
                        message: data.message,
                        fromId: data.fromId
                    }));
                }
                break;
        }
    });

    ws.on('close', () => {
        // Handle client disconnection (remove from clients)
        for (const id in clients) {
            if (clients[id] === ws) {
                delete clients[id];
                break;
            }
        }
    });
});
