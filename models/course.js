const Sequelize=require('sequelize');
const sequelize=require('../utils/database');



const course=sequelize.define('course',{
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
    description:{
        type: Sequelize.STRING,
        allowNull:false
    },
},{timestamps: true});


module.exports=course;