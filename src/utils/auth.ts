import jwt from 'jsonwebtoken';
import config from '../config';
import { getUserById } from '../database/methods';

export function generateAccessToken(user) {
    return jwt.sign(
        {
            username: user.username,
            id: user._id
        },
        config.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: '15m', algorithm: "RS256" }
    );
}

export function generateRefreshToken(user) {
    return jwt.sign(
        {
            username: user.username,
            id: user._id
        },
        config.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: '7d', algorithm: "RS256" }
    );
}

export function generateNewAccessToken(req, res) {
    try {
        let refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ msg: 'Refresh token not found' });

        jwt.verify(refreshToken, config.JWT_REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ msg: 'Invalid refresh token!' });

            const accessToken = generateAccessToken({
                username: user.username,
                id: user._id
            });

            res.setHeader('Content-Type', 'application/json');
            res.cookie('accessToken', accessToken, {
                sameSite: 'strict',
                expires: new Date(new Date().getTime() + 900000),
                httpOnly: true /*secure: true*/
            });

            return res.sendStatus(201);
        });
    } catch (err) {
        return res.status(403).json({ msg: 'Invalid refresh token!' });
    }
}
