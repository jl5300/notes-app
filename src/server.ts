// Third party dependencies
import MongoStore from 'connect-mongo';
import sessions from 'express-session';
// import flash from 'express-flash';
import mongoose from 'mongoose';
import passport from 'passport';
import express from 'express';
import path from 'path';

// Local dependencies
import dbConfig from '../config/database.config';
import postsRouter from './routes/post.routes';
import userRouter from './routes/user.routes';
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
    saveUninitialized: false,
    resave: false
}));
// app.use(flash());

// Authentication
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO: Learn about flash messages
app.use('/posts', postsRouter);
app.use('/', userRouter);

app.use(express.static(path.join(__dirname, '../client/dist')));

// For requests to unrecognized routes, defer to React app
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}.`);
});
