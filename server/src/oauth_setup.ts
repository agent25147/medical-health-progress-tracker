import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AppDataSource } from './db_config';
import { User } from './entity/user';

const dotenv = require('dotenv');
var passport = require('passport');
const jwt = require("jsonwebtoken");

const setupOAuth = (app) => {
    dotenv.config();

    const googleClientId = process.env.GOOGLE_OAUTH_CLIENT_ID ?? "";
    const googleClientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET ?? "";

    passport.use(new GoogleStrategy({
        clientID: googleClientId,
        clientSecret: googleClientSecret,
        callbackURL: process.env.CLIENT_APP_URL + "/auth/google/callback"
    },
        async function (accessToken, refreshToken, profile, cb) {
            var repository = AppDataSource.getRepository(User);
            const emails = profile.emails ?? [];
            if (emails.length === 0) {
                return cb(new Error('No email found in profile'));
            }
            const email = emails[0].value;

            const userFromDb = await repository.findOne({ where: { email } });

            if (!userFromDb) {
                var userToAdd = new User();
                userToAdd.email = email;
                userToAdd.name = profile.displayName;
                const newUser = repository.create(userToAdd);
                await repository.save(newUser);
                return cb(null, newUser);
            }

            return cb(null, userFromDb);
        }
    ));

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback', passport.authenticate('google', { session: false }),
        (req, res) => {
            const user = req.user as User; 
            const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_Secret, { expiresIn: '10h' });
            console.log('token sent');
            res.json({ token: token });
        }
    );
}

export default setupOAuth;