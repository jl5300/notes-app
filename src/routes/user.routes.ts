import User from '../models/user.model';
import { Router } from 'express';
import passport from 'passport';
import multer from 'multer';
import path from 'path';

const router = Router();

// Set up file storage for profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login/failure'
}));

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    });
    res.redirect('/');
});

router.post('/register', async (req, res, next) => {
    if (await User.findOne({ username: req.body.username })) {
        return res.redirect('/register/failure');
    }

    const username = req.body.username;
    await User.register(new User({
        username: username,
        profilePicture: null
    }), req.body.password
    );
    next();
}, passport.authenticate('local', {successRedirect: '/'}));

router.post('/uploadProfilePicture', upload.single('profilePicture'), async (req, res) => {
    try {
        // @ts-ignore
        let user = await User.findById(req.user._id);
        
        user.profilePicture = req.file.path;
        await user.save();

        // @ts-ignore
        user = await User.findById(req.user._id);
        console.log(user);

        res.send({ message: 'Profile picture uploaded successfully.' });
    } catch (err: any) {
        console.error(err);
        res.status(500).send({ message: err.message || 'Failed to upload profile picture.' });
    }
});

// Convenience for getting the current user client-side
// There's probably a better way to do this
router.get('/user', (req, res) => {
    res.send(req.user);
});

export default router;