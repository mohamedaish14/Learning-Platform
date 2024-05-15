const dotenv=require('dotenv')
dotenv.config({path:'config.env'})
const Sequelize= require('sequelize');
// const sequelize=new Sequelize(process.env.databaseName,'root',process.env.password,{
//     dialect:'mysql',
//     host:'localhost'
// });
const sequelize = new Sequelize("sql8706699", "sql8706699", 'ZkJf4GqfXX', {
    host: 'sql8.freesqldatabase.com',
    port: '3306',
    dialect: 'mysql',
    dialectOptions: {
        ssl: false // Disable SSL
      }
  });
module.exports=sequelize;