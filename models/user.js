const Sequelize=require('sequelize');
const sequelize=require('../utils/database');
const bcrypt = require('bcryptjs');


const user=sequelize.define('user',{
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
    email:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
   
    role:{
        type: Sequelize.ENUM('student', 'instructor'),
        defaultValue: 'instructor'
    },
},{timestamps: true});

user.beforeCreate(async (user) => {
     
      user.password = await bcrypt.hash(user.password, 12);
      user.passwordConfirm=user.password;
})
  ;
user.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        console.log("hashing")
      user.password = await bcrypt.hash(user.password, 12);
      console.log('hashed')
      user.passwordConfirm = user.password; 
    }
  })

module.exports=user;