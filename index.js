//npm i koa koa-bodyparser koa-mysql-session koa-router koa-session-minimal koa-static koa-views md5 moment mysql ejs markdown-it chai mocha koa-static-cache --save-dev
//koa node框架
//koa-bodyparser 表单解析中间件
//koa-mysql-session、koa-session-minimal 处理数据库的中间件
//koa-router 路由中间件
//koa-static 静态资源加载中间件
//ejs 模板引擎
//md5 密码加密
//moment 时间中间件
//mysql 数据库
//markdown-it markdown语法
//koa-views 模板呈现中间件
//chai mocha 测试使用
//koa-static-cache 文件缓存
var Koa=require('koa');
var path=require('path');
var bodyParser=require('koa-bodyparser');
var ejs=require('ejs');
var session = require('koa-session-minimal');
var MysqlStore = require('koa-mysql-session');
var router=require('koa-router');
var views = require('koa-views');
var staticCache = require('koa-static-cache');
var config = require('./config/default.js');
var app = new Koa();
// session存储配置
const sessionMysqlConfig = {
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  host: config.database.host,
};
// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}));

// 配置静态资源加载中间件
// app.use(koaStatic(
//   path.join(__dirname , './public')
// ))
// 缓存
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}));
app.use(staticCache(path.join(__dirname, './images'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}));
// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))
app.use(bodyParser({
  formLimit: '1mb'
}))
//  路由(我们先注释三个，等后面添加好了再取消注释，因为我们还没有定义路由，稍后会先实现注册)
app.use(require('./routers/signin.js').routes());
app.use(require('./routers/signup.js').routes());
app.use(require('./routers/posts.js').routes());
app.use(require('./routers/signout.js').routes());
app.listen(3000);

console.log(`listening on port ${config.port}`);
