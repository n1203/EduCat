var express = require('express');
var router = express.Router();
// 引用md5加密模块
const md5 = require('md5')
// 引入解析JSON、Raw、文本、URL-encoded格式的请求体中间件
var bodyParser = require('body-parser')
// 创建 application/x-www-form-urlencoded 解析
router.use(bodyParser.urlencoded({extended:false}))
//导入mysq配置文件
const connection = require('../config/mysql')
// 引入jwt模块，生成登录携带的token
const jwt = require('jsonwebtoken')
// 引入passport模块，验证token
const passport = require('passport')


// 用户/老师注册接口
// 接口维护人：平昔
// 维护时间：2019年5月12日21点32分
router.post('/register', (req, res, next) => {
  const username = req.body.username
  const type = req.body.type
  const phonenum = req.body.phonenum
  const tag = md5(username + phonenum).slice(6,16)
  // 逻辑加密
  const password = md5(md5(req.body.password),tag)
  const sql = "INSERT INTO users (username,password,tag,type,phonenum) VALUES ('" + username + "','" + password + "','" + tag + "','" + type + "','" + phonenum + "')"
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log('[query] - :' + err);
      return res.json({ success: false, message: '注册失败!' })
    }
    res.json({ success: true, message: '成功创建新用户!' ,tag:tag })
  })
})


// 用户/老师登录接口
// 接口维护人：平昔
// 维护时间：2019年5月13日14点12分
router.post('/login', (req, res, next) => {
  const username = req.body.username
  // 逻辑加密
  const password = md5(md5(req.body.password))
  const sql = "SELECT * FROM users WHERE username = '"+ username+ "' or phonenum = '"+ username+ "' and password ='"+ password +"'"
  connection.query(sql, (err, rows, fields) => {
    if (err) {
      console.log('[query] - :' + err);
      return res.json("{ success: false, message: '登录失败！' }")
    }
    if(rows != ''){
      const rule = {username:username}
      const keys = 'kuaidian'
      jwt.sign(rule,keys,{expiresIn:60*8},(err,token)=>{
        if(err)throw err
        res.json({success:true,message:'成功登录!',username:username,token:"Bearer " + token})
      })

    }else{
      return res.json({success: false, message: '登录失败！账号或密码错误。' })
    }
  })
})





// 用户数据获取接口
// 接口维护人：平昔
// 维护时间：2019年5月13日16点39分
router.get('/userInfo',passport.authenticate("jwt",{session:false}),(req,res,next)=>{
    res.json({
      tag:req.user[0].tag,
      username:req.user[0].username,
      type:req.user[0].type,
      phonenum:req.user[0].phonenum,
      qq:req.user[0].qq,
      address:req.user[0].address,
      name:req.user[0].name
    })
})




module.exports = router;
