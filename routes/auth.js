const {Router} = require("express");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgrid = require("nodemailer-sendgrid-transport");
const keys = require("../keys");
const regMail = require("../email/register");
const resetMail = require("../email/resetPassword");
const crypto = require("crypto");
const {registerValidators} = require("../utils/validators");
const {validationResult} = require("express-validator");

const router = Router();

const transporter = nodemailer.createTransport(sendgrid({
    auth: {api_key: keys.SENDGRID_API_KEY,}

}));

router.get('/login', (req, res) => {
    res.render('auth/login', {
        title: "Авторизация",
        isLogin: true,
        loginError: req.flash('loginError'),
        registerError: req.flash('registerError')
    });
});

router.post('/login', async (req, res) => {

    const {email, password} = req.body;
    const candidate = await User.findOne({email});

    if (candidate) {

        const isSame = await bcrypt.compare(password, candidate.password)
        console.log(isSame);

        if (isSame) {
            req.session.isAuthenticated = true;
            req.session.user = candidate;
            req.session.save(error => {
                if (error) {
                    throw error;
                } else {
                    res.redirect('/');
                }
            })

        } else {
            req.flash('loginError', 'Неверные данные для входа');
            res.redirect('/auth/login');
        }
    } else {
        req.flash('loginError', 'Пользователя с таким email не существует');
        res.redirect('/auth/login');
    }
});

router.post('/register', registerValidators, async (req, res) => {
    try {
        const {email, password, repeat, name} = req.body;

        const error = validationResult(req);
        if (!error.isEmpty()) {
            req.flash('registerError', error.array()[0].msg)
            return res.status(422).redirect('/auth/login#register');
        }


        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            name,
            password: hashPassword,
            cart: {items: []}
        })
        await user.save();

        res.redirect('/auth/login');

        await transporter.sendMail(regMail(email));


    } catch (error) {
        throw error;
    }
});

router.get('/logout', async (req, res) => {
    req.session.destroy(error => {
        if (error) {
            throw error
        } else {
            res.redirect('/auth/login');
        }
    });
});

router.get('/password/:token', async (req, res) => {

    if (!req.params.token) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenLifeTime: {$gt: Date.now()}
        });

        if (!user) {
            req.flash('resetPasswordError', 'Закончилось время ожидания на сброс пароля, повторите попытку еще раз');
            res.redirect('/auth/reset');
        } else {
            res.render('auth/reset-password', {
                title: "Сброс пароля",
                userId: user._id.toString(),
                token: req.params.token,
                resetPasswordError: req.flash('resetPasswordError'),
            });
        }

    } catch (error) {
        throw error;
    }


});

router.post('/password', async (req, res) => {
    const {userId, token, password, repeat} = req.body;
    console.log(req.body);

    const user = await User.findOne({
        _id: userId,
        resetToken: token,
    });

    if (password === repeat) {
        const hashPassword = await bcrypt.hash(password, 10);

        user.password = hashPassword;
        user.resetToken = undefined;
        user.resetTokenLifeTime = undefined;
        await user.save();

        res.redirect('/auth/login');

    } else {
        req.flash('resetPasswordError', 'пароли не совпадают');
        res.redirect(`/auth/password/${token}`);
    }


})

router.get('/reset', (req, res) => {
    res.render('auth/reset', {
        title: "Сброс пароля",
        resetPasswordError: req.flash('resetPasswordError'),
        resetSuccess: req.flash('resetSuccess')
    });
});

router.post('/reset', async (req, res) => {
    try {

        const candidate = await User.findOne({email: req.body.email});

        if (candidate) {
            crypto.randomBytes(32, async (error, bufer) => {
                if (error) {
                    req.flash('resetPasswordError', 'Что-то пошло не так, повторите попытку позже');
                    return res.redirect('/auth/reset');
                }
                const token = bufer.toString('hex');
                candidate.resetToken = token;
                candidate.resetTokenLifeTime = Date.now() + 60 * 60 * 1000;
                await candidate.save();
                await transporter.sendMail(resetMail(req.body.email, token));
                req.flash('resetSuccess', true);
                res.redirect('/auth/reset');
            });
        } else {
            req.flash('resetPasswordError', 'Пользователя с таким email не существует');
            res.redirect('/auth/reset');
        }

    } catch (error) {
        throw error;
    }
})

module.exports = router;