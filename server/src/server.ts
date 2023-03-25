import express from 'express';
import dbConfig from '../config/database.config';
import postsRouter from './routes/post.routes';
import MongoStore from 'connect-mongo';
import sessions from 'express-session';
import mongoose from 'mongoose';
import passport from 'passport';

mongoose.set('strictQuery', false);

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

app.use(passport.session())
app.use('/posts', postsRouter);

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}.`);
});