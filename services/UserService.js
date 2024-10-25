
class UserService {
    constructor(db) {
        this.client=db.sequelize;
        this.User=db.User;

    }

    async getOne(email) {
        return this.User.findOne({
            where: {email:email}
        })
    }

    async create(name,email,encryptedPassword,salt,userColor) {
        return this.User.create({
            name:name,
            email:email,
            encryptedPassword:encryptedPassword,
            salt:salt,
            userColor:userColor
        })
    }

    async deleteByEmail(email) {
        return this.User.destroy({
            where: {email:email}
        });
    }
}

module.exports=UserService;