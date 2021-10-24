import express, { Application, Response, Request } from 'express';
import reload from 'reload';
import morgan from "morgan"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { Main, User, Auth } from './routes';
import config from "./config"

class Server {
  app: Application;
  constructor() {
    this.app = express();
    this.app.use(helmet())
    this.app.use(morgan('dev'))
    this.app.use(cookieParser())

    this.app.listen(config.port, () => {
      console.info(`Server has started on port ${config.port}`);
    });

    new Main(this.app, "/")
    new User(this.app, '/user');
    new Auth(this.app, '/auth');
    reload(this.app);
  }
}

export default Server;