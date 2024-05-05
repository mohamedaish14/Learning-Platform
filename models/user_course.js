
const Sequelize=require('sequelize');
const sequelize=require('../utils/database');

const user_course = sequelize.define('user_course', {
  
    // userId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'user', 
    //     key: 'id'
    //   }
    // },
    // courseId: {
    //   type: Sequelize.INTEGER,
    //   allowNull: false,
    //   references: {
    //     model: 'course', 
    //     key: 'id'
    //   }
    // }
  });
  
 

  module.exports=user_course;