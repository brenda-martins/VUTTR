const { User } = require("../models");


class AuthController {


    async auth(req, res) {

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json("User Not Found");
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json("Unauthorized")
        }

        return res.status(200).json({
            user,
            token: user.generateToken()
        });
    }
}

module.exports = new AuthController();