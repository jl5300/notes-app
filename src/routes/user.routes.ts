import User from '../models/user.model';
import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Failureflash?
router.post('/login', passport.authenticate('local'), (req, res) => {
    console.log(req.session);
    res.redirect('/');
});

router.post('/register', async (req, res, next) => {
    await User.register(new User(
        {username: req.body.username}), req.body.password
    );

    res.redirect('/');
});

export default router;