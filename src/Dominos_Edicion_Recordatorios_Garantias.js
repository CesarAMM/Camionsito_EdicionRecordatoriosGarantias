const express = require('express');
const app = express();
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const port = process.env.PORT || 8011;
const fileUpload = require('express-fileupload');
const {expressCspHeader, INLINE, NONE, SELF} = require('express-csp-header')

//Middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 100000000000}));
app.engine('html', require('ejs').renderFile);
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());
app.use(cookieSession ({
    name: 'SessionDominosReGa',
    keys: ['key1', 'key2']
}));
app.use(helmet());
app.use(expressCspHeader({
    directives: {
        'script-src': [SELF, INLINE]
    }
}));

// config routes
app.use(require('./routes/index'))
app.use(require('./routes/Llenado'))
app.use(require('./routes/Edicion'))
app.use(require('./routes/Recordatorios'))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/bootstrap/scss')));
app.use(express.static(path.join(__dirname, '../node_modules/jquery/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/popper.js/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/xlsx/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/file-saver/dist')));
app.use(express.static(path.join(__dirname, '../node_modules/chosen-js')));

//Server
app.listen(port, () =>{
    console.log('Iniciandi: http://localhost:' + port)
});