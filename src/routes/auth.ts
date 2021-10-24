import { BaseRoute } from '../structures/baseRouter';
import { Application, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { userModel } from '../database/schema';
import { getUserByEmail, getUserByUsername, createNewUser } from '../database/methods';
import { generateAccessToken, generateRefreshToken, generateNewAccessToken } from '../utils/auth';
import { validateRegister, validateLogin } from '../utils/validates';

export class Auth extends BaseRoute {
    app: Application;
    constructor(app: Application, path?: string) {
        super(app, path);

        this.router.post('/register', async (req: Request, res: Response) => {
            try {
                const { error } = validateRegister(req.body);
                if (error) return res.status(400).send(error.details[0].message);

                if (await getUserByEmail(req.body.email)) return res.status(400).json({ msg: 'Email already exists!' });
                if (await getUserByUsername(req.body.username)) return res.status(400).json({ msg: 'Username already exists!' });

                const hashedPassword = bcrypt.hash(req.body.password, 21);

                await createNewUser({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashedPassword,
                    createdAt: new Date().getTime()
                });

                const accessToken = generateAccessToken(getUserByEmail(req.body.email));
                const refreshToken = generateRefreshToken(getUserByEmail(req.body.email));

                if (!accessToken || !refreshToken) return res.status(500).json({ msg: 'Unknown error occured, please try again later!' });

                res.cookie('accessToken', accessToken, {
                    sameSite: 'strict',
                    expires: new Date(new Date().getTime() + 900000),
                    httpOnly: true
                    /*secure: true*/
                    // ephemeral: true
                });
                res.cookie('refreshToken', refreshToken, {
                    sameSite: 'strict',
                    expires: new Date(new Date().getTime() + 604800000),
                    httpOnly: true /*secure: true*/
                });

                return res.sendStatus(201);
            } catch (err) {
                console.error(err);
            }
        });

        this.router.post('/login', async (req: Request, res: Response) => {
            const { error } = validateRegister(req.body);
            if (error) return res.status(400).send(error.details[0].message);

            const user = await getUserByEmail(req.body.email)

            if (!user) return res.status(401).json({ msg: 'Invalid email or password!' });

            const validPassword = await bcrypt.compare(req.body.password, user.password);

            if (!validPassword) return res.status(401).json({ msg: 'Incorrect password!' });

            const accessToken = generateAccessToken(getUserByEmail(req.body.email));
            const refreshToken = generateRefreshToken(getUserByEmail(req.body.email));

            if (!accessToken || !refreshToken) return res.status(500).json({ msg: 'Unknown error occured, please try again later!' });

            res.setHeader('Content-Type', 'application/json');
            res.cookie('accessToken', accessToken, {
                sameSite: 'strict',
                expires: new Date(new Date().getTime() + 900000),
                httpOnly: true,
                /*secure: true*/
                // ephemeral: true
            });
            res.cookie('refreshToken', refreshToken, {
                sameSite: 'strict',
                expires: new Date(new Date().getTime() + 604800000),
                httpOnly: true /*secure: true*/
            });

            return res.status(200).send(user.username);
        });

        this.router.post('/logout', (req: Request, res: Response) => {
            const id = req.user._id;
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');

            return res.sendStatus(200);
        });
    }
}
