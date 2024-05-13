const Sequelize=require('sequelize');
const sequelize=require('../utils/database');



const session=sequelize.define('session',{
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
    description:{
        type: Sequelize.STRING,
        allowNull:false
    },
    // courseId: {
    //     type: Sequelize.INTEGER,
    //     allowNull: false,
    //     references: {
    //       model: 'course', 
    //       key: 'id'
    //     }},
        duration: {
            type:Sequelize.INTEGER,
            allowNull: false
          },
},{timestamps: true});


module.exports=session;

















