const express = require('express');
const app = express();
const dotenv = require('dotenv');
const articleRoute = require('./routes/articles');
const categorieRoute = require('./routes/categories');
const commentaireRoute = require('./routes/commentaires');
const userRoute = require('./routes/users');
const userAuth = require('./routes/auth');
const morgan = require('morgan');

dotenv.config();

app.use(express.json());
app.use(morgan('dev'));
app.use("/users",userRoute);
app.use("/articles",articleRoute);
app.use("/categories",categorieRoute);
app.use("/commentaires",commentaireRoute);
app.use("/auth",userAuth);

app.listen(process.env.PORT, ()=>{
    console.log("Backend server is running !");
})