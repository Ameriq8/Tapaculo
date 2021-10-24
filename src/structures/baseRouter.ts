import { Router, Application } from 'express';

export class BaseRoute {
    router: Router;
    app: Application;
    path: string;
    constructor(app: Application, path = '/') {
        this.app = app;
        this.path = path;
        this.router = Router();
        this.app.use(this.path, this.router);
    }
}
