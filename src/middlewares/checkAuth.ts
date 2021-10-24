import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../database/schema';
import config from '../config';
import { IToken } from "../utils/types"

export default function checkAuth(req: Request, res: Response, next: NextFunction) {
    try {
        let accessToken = req.cookies.accessToken;
        if (!accessToken) return res.status(401).json({ msg: 'Not logged in' });

        try {
            const tokenVerify = jwt.verify(accessToken, config.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {

            req.user = decoded.id    
            next();
            });
        } catch (err) {
            console.error(err);
            return res.status(403).json({ msg: 'Invalid accessToken' });
        }
    } catch (err) {
        return res.status(403).json({ msg: 'Invalid accessToken' });
    }
}
