const express=require('express');
const sequelize=require('./utils/database');


const user=require('./models/user');
const content=require('./models/content');
const session=require('./models/session');
const course=require('./models/course');
const user_course=require('./models/user_course');

const courseRoutes=require('./routes/course');
const sessionRoutes=require('./routes/session');


const app=express();
app.use(express.json());


//database
course.hasMany(session);
session.belongsTo(course,{constrains:true,onDelet:'CASCADE'});

session.hasMany(content);
content.belongsTo(session,{constrains:true,onDelet:'CASCADE'});

user.belongsToMany(course, { through: user_course });
course.belongsToMany(user, { through: user_course });


sequelize.sync({}).then(console.log('connected'))
.catch(err=>{console.log(`err:${err}`)})

//routes
app.use('/courses',courseRoutes);
app.use('/courses',sessionRoutes);

app.use((req,res,next)=>{
    res.status(404).send('<h1>404 page not found</h1>');
    next();
})







//server
app.listen(3000)