const Sequelize=require('sequelize');
const sequelize=require('../utils/database');



const content=sequelize.define('content',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
        unique: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull:false
    },
    url:{
        type: Sequelize.STRING,
        allowNull:false
    },
    type:{
        type:Sequelize.STRING,
        allowNull:false
    },

    courseId:{type:Sequelize.INTEGER,allowNull:false},

    // sessionId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'session', 
    //       key: 'id'
    //     }},
       
},{timestamps: true});


module.exports=content;