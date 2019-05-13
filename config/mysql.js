var mysql = require('mysql'); //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({
    host: '47.100.101.232', //主机
    user: 'youdao',     //数据库用户名
    password: 'youdao',     //数据库密码
    port: '3306',
    database: 'youdao', //数据库名称
    charset: 'UTF8_GENERAL_CI' //数据库编码
});

module.exports = connection