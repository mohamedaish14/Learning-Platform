const express=require('express');
const sequelize=require('./utils/database');

const ApiError=require('./utils/apiError');
const user=require('./models/user');
const content=require('./models/content');
const session=require('./models/session');
const course=require('./models/course');
const user_course=require('./models/user_course');

const courseRoutes=require('./routes/course');
const sessionRoutes=require('./routes/session');
const contentRoutes=require('./controllers/content')

// express app  
const app=express();

//midellware
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

// mount routes
app.use('/courses',courseRoutes);
app.use('/courses',sessionRoutes);
app.use('/courses',contentRoutes);
app.all('*',(req,res,next)=>{
    next(new ApiError(`can not find this route :${req.originalUrl}`,400));
    
})

// global error handelling
app.use((err,req,res,next)=>{
    err.statusCode=err.statusCode||500
    err.status=err.status||'error'
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack,

    });
    next();
})


//server
const server=app.listen(3000)

//error outside express
process.on('unhandledRejection',(err)=>{
    console.log(`unhandledRejection:${err}`);
    server.close(()=>{
        console.log('shutting down......');
        process.exit(1);
    })

})