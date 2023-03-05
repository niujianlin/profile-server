const express = require('express');
//调用用户详细信息集合构造函数
const { Userinfo } = require('../db/userinfo');
//调用用户集合构造函数
const { User } = require('../db/user');
// 创建博客展示页面路由,返回的是路由对象
const router = express.Router();
const pagination = require('mongoose-sex-page')


// 查看用户信息 /userinfo/detail?id=xxx
router.get("/detail", async (req, res) => {
    let id = req.query.id
    console.log(id)
    let userinfo = await Userinfo.find({ userid: id })
    // let userinfo = await Userinfo.findById({ userid: id })  这样写有objectId类型有对不上的问题
    console.log("userinfo=\n", userinfo)
    if (userinfo) {
        res.send({
            code: 200,
            msg: "查看成功",
            userinfo
        })
    } else {
        res.send({
            code: 500,
            msg: "查看失败"
        })
    }
})

// 编辑个人信息（用户登录时初始化好数据，再改就是编辑了）
router.put("/_token/update", async (req, res) => {
    // let { token } = req.headers;
    // console.log("token:", token)

    // // 查token
    // let tokenresult = await User.findOne({ logintoken: token })
    // if (!tokenresult || tokenresult.length == 0) {
    //     res.send({
    //         code: 403,
    //         msg: "请先登录"
    //     })
    //     return
    // }


    let { userid, name, gender, signature, hobby, work } = req.body;
    let userinfo = await Userinfo.updateOne({ userid: userid }, {
        name,
        gender,
        signature,
        hobby,
        work
    })

    if (userinfo) {
        res.send({
            code: 200,
            msg: "修改成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }
})

// 将路由对象作为模块成员进行导出
module.exports = router;