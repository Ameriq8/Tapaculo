import { BaseRoute } from '../structures/baseRouter';
import { Application, Request, Response } from 'express';
import { getUserById } from '../database/methods';
import checkAuth from '../middlewares/checkAuth';

export class User extends BaseRoute {
    app: Application;
    constructor(app: Application, path?: string) {
        super(app, path);

        this.router.get('/', checkAuth, async (req: Request, res: Response) => {
            const user = { msg: 99 }
            res.status(200).json(user);
        });
    }
}
