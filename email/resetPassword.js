const keys = require("../keys");

module.exports = function (email, token) {
    return {
        to: email,
        from: keys.EMAIL_FROM,
        subject: "Восстановление пароля",
        html: `
        <h1>Восстановление пароля<h1/>
        <p>Если это были не вы - проигнорируйте данное сообщение</p>
        <p>Иначе нажмите на ссылку:</p>
        <hr/>
        <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
        `
    };
};