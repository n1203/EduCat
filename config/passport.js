// token验证模块
// 接口维护人：平昔
// 维护时间：2019年5月14日24点46分

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const mysql = require('mysql')
const connection = require('./mysql')
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()  //通过配置信息来生成jwt的请求，验证这个token
opts.secretOrKey = "kuaidian"

module.exports = passport => {
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        const sql = "SELECT * FROM users WHERE username = '"+ jwt_payload.username+ "' or phonenum = '"+ jwt_payload.username + "'"
        connection.query(sql, (err, rows, fields) => {
            if (err) {
              console.log('[query] - :' + err);
              return res.json("{ success: false, message: '登录失败！' }")
            }
            if(rows){
                return done(null,rows)

            }else{
                return done(null,false)
            }
          })
    }));
}