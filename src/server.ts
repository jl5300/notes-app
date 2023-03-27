// Third party dependencies
import MongoStore from 'connect-mongo';
import sessions from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';
import express from 'express';
import path from 'path';

// Local dependencies
import dbConfig from '../config/database.config';
import postsRouter from './routes/post.routes';
import User from './models/user.model';

// Avoid deprecation
mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 3000;
const app = express();

(async () => {
	try {
		await mongoose.connect(dbConfig.url);
        console.log('Connected to database successfully.')
	} catch (err: any) {
		console.error(err.message || 'Error connecting to database.');
		process.exit();
	}
})();

app.use(sessions({
    store: MongoStore.create({
        mongoUrl: dbConfig.url,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native'
    }),
    secret: '8t7ablgdg6',
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: true,
    resave: false
}));

// Authentication
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Other middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req);
    res.redirect('/');
});

app.use(express.static(path.join(__dirname, '../client/dist')));

// For requests to unrecognized routes, defer to React app
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.use('/posts', postsRouter);

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}.`);
});
