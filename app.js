const express=require('express');
const cors=require('cors')
const sequelize=require('./utils/database');

const ApiError=require('./utils/apiError');
const globalError=require('./middleware/errorMiddleware');

const user=require('./models/user');
const content=require('./models/content');
const session=require('./models/session');
const course=require('./models/course');
const user_course=require('./models/user_course');

const courseRoutes=require('./routes/course');
const sessionRoutes=require('./routes/session');
const userRoutes=require('./routes/user');
const authRoutes=require('./routes/auth');
const contentRoutes=require('./controllers/content')

// express app  
const app=express();
const allowedOrigins = ['https://storky-lite.vercel.app', `http://localhost:${process.env.PORT || 3000}`];

// Configure CORS options
var corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}


//midellware
// Use CORS middleware with
app.use(cors(corsOptions));
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', `http://localhost:${process.env.PORT || 3000}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });



//database
course.hasMany(session);
session.belongsTo(course,{constrains:true,onDelet:'CASCADE'});

session.hasMany(content);
content.belongsTo(session,{constrains:true,onDelet:'CASCADE'});

user.belongsToMany(course, { through: user_course });
course.belongsToMany(user, { through: user_course });


sequelize.sync().then(console.log('connected'))
.catch(err=>{console.log(`err:${err}`)})

// mount routes

app.use('/courses',courseRoutes);
app.use('/courses',sessionRoutes);
app.use('/courses',contentRoutes);
app.use('/user',userRoutes);
app.use('/auth',authRoutes);
app.all('*', (req, res, next) => {

    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
  
  });


// Global error handling
app.use(globalError);


//server
const PORT = process.env.PORT || 3000
const server=app.listen(PORT)

//error outside express
process.on('unhandledRejection',(err)=>{
    console.log(`unhandledRejection:${err}`);
    server.close(()=>{
        console.log('shutting down......');
        process.exit(1);
    })

})