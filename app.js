const express = require("express")
const app = express()
// 用户上传
const multer = require("multer")

const port = 8080

//开放跨域请求
app.use(function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
})

// 引入数据库
require("./db/DbUtils")
// 第一次链接数据库引入数据
// require('./db/user');
// require("./db/userinfo")

// 可以看到客户端所有请求
const morgan = require('morgan')

// 路径拼接模块
const path = require("path")
// post请求解析
const bodyParser = require('body-parser')
// 拦截所有post请求，用bodyParser解析
app.use(bodyParser.urlencoded({ extended: false }))
// 中间件json解析
app.use(bodyParser.json())

// 用户上传目录，后面UploadRouter将位置改到./public/upload
const update = multer({
    dest: "./public/upload/temp"
})
app.use(update.any())
//指定静态资源路径
app.use(express.static(path.join(__dirname, "public")))


// 路由如下
// app.get("/", (req, res) => {
//     res.send("hello world")
// })

//调用用户集合构造函数
const { User } = require('./db/user');
const ADMIN_TOKEN_PATH = "/_token"
app.all("*", async (req, res, next) => {
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
        let { token } = req.headers;
        console.log("token:", token)

        // 查token
        let tokenresult = await User.findOne({ logintoken: token })
        if (!tokenresult || tokenresult.length == 0) {
            // 找不到token、token为空（需要登录）
            res.send({
                code: 403,
                msg: "请先登录"
            })
            return
        } else {
            // 找到token
            next()
        }

    } else {
        // 不修改=》不需要验证token
        next()
    }
})

app.use("/admin", require("./routers/AdminRouter"))
app.use("/userinfo", require("./routers/UserInfoRouter"))
app.use("/upload", require("./routers/UploadRouter"))

app.listen(port, () => {
    console.log(`服务器启动成功，端口为：${port}`)
})

