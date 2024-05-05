const Sequelize=require('sequelize');
const sequelize=require('../utils/database');


const user=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    role:{
        type: Sequelize.ENUM('student', 'instructor', 'admin'),
        defaultValue: 'student'
    },
},{timestamps: true});


module.exports=user;