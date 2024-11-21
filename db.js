const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config()


const sequelize = new Sequelize(`${process.env.DB_HOST}`, {
  logging: false,
});


const User = sequelize.define('User', {
  telegram_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone_number: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true, 
  tableName: 'users', 
});


sequelize.authenticate()
  .then(() => {
    console.log('Соединение с базой данных установлено.');
    return sequelize.sync(); 
  })
  .catch(err => {
    console.error('Ошибка подключения к базе данных:', err.message);
  });

module.exports = { sequelize, User };
