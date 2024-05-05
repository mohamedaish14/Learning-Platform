const dotenv=require('dotenv')
dotenv.config({path:'config.env'})
const Sequelize= require('sequelize');
const sequelize=new Sequelize(process.env.databaseName,'root',process.env.password,{
    dialect:'mysql',
    host:'localhost'
});
module.exports=sequelize;