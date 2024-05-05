const Sequelize=require('sequelize');
const sequelize=require('../utils/database');



const content=sequelize.define('content',{
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
    url:{
        type: Sequelize.STRING,
        allowNull:false
    },
    // sessionId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'session', 
    //       key: 'id'
    //     }},
       
},{timestamps: true});


module.exports=content;