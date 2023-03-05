const express = require('express');
//调用用户集合构造函数
const { User } = require('../db/user');
// 创建博客展示页面路由,返回的是路由对象
const router = express.Router();
const { v4: uuidv4 } = require("uuid")

//二级路由：匹配/login（先匹配/admin，后匹配/login）
// 渲染登录页面
router.post('/login', async (req, res) => {
    // const { account, password } = req.query;
    const { account, password } = req.body;
    console.log(account, password)
    console.log(req.body)

    // let { err, rows } = await db.async.all("select * from `admin` where `account` = ? AND `password` = ?", [account, password])

    // if (account.trim().length == 0 || password.trim().length == 0) {
    //     res.send({
    //         code: 400,
    //         msg: "登录失败"
    //     })
    // }
    // {"username" : "joe", "age" : 27}
    let user = await User.findOne({ account: account, password: password })
    // console.log(user)
    if (user) {
        // 匹配到用户名和密码
        let logintoken = uuidv4() // token要添加到数据库中
        await User.updateOne({ _id: user._id }, {
            account,
            password,
            logintoken
        })

        // 别把密码也传出去
        let userinfo = user
        userinfo.logintoken = logintoken
        userinfo.password = ""
        // console.log("userinfo=", userinfo)

        res.send({
            code: 200,
            msg: "登录成功",
            data: userinfo
        })
    } else {
        // 没匹配到
        console.log("没匹配到用户名或密码")
        res.send({
            code: 500,
            msg: "登录失败"
        })
    }
})


// 将路由对象作为模块成员进行导出
module.exports = router;