import Server from './models/server';
import bodyParser = require('body-parser');
import cors = require('cors');

const server = Server.instance;

//Parser 
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

//Cors conf
server.app.use(cors({origin:true, credentials:true}));

server.start(() => {
    console.log(`Server corriendo en el puerto ${server.port}`);
});