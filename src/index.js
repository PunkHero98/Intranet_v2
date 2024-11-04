import express from  'express';
import morgan from 'morgan';
import {dirname}  from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars  from 'express-handlebars';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;


app.use(express.static(path.join(__dirname , 'public')));
// app.use(express.static(path.join(__dirname , 'public')));
app.use(morgan('combined'));


app.engine('hbs' , handlebars.engine({
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.set('views' , path.join( __dirname , 'resources\\views'));

app.get('/' , (req , res)=>{
    res.render('login');
});

app.get('/news' , (req , res )=>{
    res.render('login');
})

app.listen(port , ()=>{
    console.log(`This server is running at http://localhost${port}`);
})