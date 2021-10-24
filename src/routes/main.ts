import { BaseRoute } from '../structures/baseRouter';
import { Application, Request, Response } from 'express';

export class Main extends BaseRoute {
    app: Application;
    constructor(app: Application, path?: string) {
        super(app, path);

        this.router.get('/', (req: Request, res: Response) => {
            res.status(200).json({ msg: 'Hello World!!' });
        });
    }
}
