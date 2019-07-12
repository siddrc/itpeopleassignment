import * as express from 'express';
import {Server} from "http";
import {TodosRouter} from './modules/todos/todos-router';
import {Tokens} from './modules/tokens/tokens'
const app: express.Application = express();
import * as cors from 'cors';
app.use(express.json());
app.use(cors())
app.use('/', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,x-token');
  next();
});
app.use("/api/token", new Tokens().router);
app.all('/api/todos/*',Tokens.verifyToken,(req:express.Request,res:express.Response,next)=>{
    next();
})
app.use('/api/todos',new TodosRouter().router)
let server:Server;
const startServer = ()=>{
  server = app.listen(3001, ()=> {
    console.log('API Server listening on 3001.');
  });
}
const stopServer = ()=>{
  server.close();
}
if(process.argv[2] === 'start')
  startServer();
export {app,startServer,stopServer};