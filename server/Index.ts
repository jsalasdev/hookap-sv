import Server from './models/server';

const server = Server.instance;

server.start(() => {
    console.log(`Server corriendo en el puerto ${server.port}`);
});