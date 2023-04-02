// Third party dependencies
// import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import sessions from 'express-session';
// import flash from 'express-flash';
import mongoose from 'mongoose';
import passport from 'passport';
import express from 'express';
import path from 'path';

// Local dependencies
import postsRouter from './routes/post.routes';
import userRouter from './routes/user.routes';
import config from './config/server.config';
import User from './models/user.model';

// Avoid deprecation
mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 3000;
const app = express();

(async () => {
	try {
		await mongoose.connect(config.db);
        console.log('Connected to database successfully.')
	} catch (err: any) {
		console.error(err.message || 'Error connecting to database.');
		process.exit();
	}
})();

app.use(sessions({
    store: MongoStore.create({
        mongoUrl: config.db,
        // ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native'
    }),
    secret: config.sessionSecret,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    saveUninitialized: false,
    resave: false
}));
// app.use(cookieParser());
// app.use(flash());

// Authentication
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// TODO: Learn about flash messages
app.use('/', userRouter);
app.use('/posts', postsRouter);

// Path to client build depends on whether server is running
//  from src or from dist/src folder. process.env.NODE_ENV is
//  undefined, so check the file extension instead:
//      ts - development
//      js - production (compiled Typescript)
let clientBuildPath = '../client/dist/';

if (__filename.split('.').pop() === 'js') {
    clientBuildPath = '../' + clientBuildPath;
}

app.use(express.static(path.join(__dirname, clientBuildPath)));

// For requests to unrecognized routes, defer to React app
app.use((req, res) => {
    res.sendFile(path.join(__dirname, clientBuildPath, 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}.`);
});
