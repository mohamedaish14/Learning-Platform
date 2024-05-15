
const Sequelize=require('sequelize');
const sequelize=require('../utils/database');

const user_course = sequelize.define('user_course', {
  
    // userEmail: {
    //   type: Sequelize.STRING,
    //   allowNull: false,
    //
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