

const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

// Updated to include SSL settings and use the correct dialect options
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    dialectOptions: {
        ssl: {
            require: process.env.SSL === 'true', // Use SSL if required by the environment
            rejectUnauthorized: false  // Necessary if SSL certificate verification is an issue
        }
    }
});

const db = {};
db.sequelize = sequelize;
fs.readdirSync(__dirname)
    .filter((file) => {
        return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(sequelize, Sequelize);
        db[model.name] = model;
    });
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
module.exports = db;
