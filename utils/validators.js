const {body} = require("express-validator");
const User = require('../models/user');

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Некорректный email')
        .custom(async (value, {req}) => {
            try {
                const user = await User.findOne({email: value});
                if (user) {
                    return Promise.reject('Пользователь с таким email уже существует');
                }
            } catch (error) {
                console.log(error);
            }
        }),
    body('password')
        .isLength({min: 6, max: 50})
        .withMessage('Пароль должен быть минимум 6 символов')
        .isAlphanumeric()
        .withMessage('В пароле можно использовать только латиницу'),
    body('repeat')
        .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать');
        } else {
            return true;
        }
    }),
    body('name')
        .isLength({min: 3})
        .withMessage('Имя должно быть минимум 3 символа'),
];