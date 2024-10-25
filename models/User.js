module.exports=(sequelize,Sequelize)=> {
    const User=sequelize.define(
        'User',
        {
            name: {
                type:Sequelize.DataTypes.STRING,
                allowNull:false
            },
            email: {
                type:Sequelize.DataTypes.STRING,
                allowNull:false
            },

            encryptedPassword: {
                type:Sequelize.DataTypes.BLOB,
                allowNull:false
            },
            salt: {
                type:Sequelize.DataTypes.BLOB,
                allowNull:false
            },
            userColor : {
                type:Sequelize.DataTypes.STRING,
                allowNull:false
            }
        },
         {
             timestamps:false
         }
    );

    return User;
}