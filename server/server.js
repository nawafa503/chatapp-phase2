import {app, socketServer} from "./app.js";
import { ExpressPeerServer } from "peer";

const PORT = process.env.PORT || 3000;
const SOCKET_PORT = process.env.SOCKET_PORT || 3001;
const PEER_PORT = process.env.PEER_PORT || 3002;

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

socketServer.listen(SOCKET_PORT, () => {
    console.log(`Socket server running on port ${SOCKET_PORT}`);
})

// Create and attach PeerJS server
const peerServer = ExpressPeerServer(server, {
    path: "/video",
  });
app.use('/peerjs', peerServer);