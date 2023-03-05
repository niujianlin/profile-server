//创建用户集合
const mongoose = require('mongoose');

//创建用户集合规则
const userinfoSchema = new mongoose.Schema({
    userid: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
        minlength: 2,
        maxlength: 20
    },
    gender: {
        type: String,
        minlength: 1,
    },
    signature: {
        type: String,
        maxlength: 200
    },
    hobby: {
        type: String,
        maxlength: 200
    },
    work: {
        type: String,
        maxlength: 200
    }
})
//创建集合
const Userinfo = mongoose.model('Userinfo', userinfoSchema);

async function createUserinfo() {
    // const pass = bcryptjs.hashSync('123456', 10);
    // 创建一些数据，第一次导入初始化数据用的
    const info = await Userinfo.create({
        userid: "6400dc113d8df754a539ae49",
        name: "小红",
        gender: "女",
        signature: "hellohellohellohellohello",
        hobby: "打球踢球羽毛球",
        work: "xxx一等奖"
    })
}
createUserinfo();


module.exports = {
    // User: User;与下面一样
    Userinfo,
    // validateUser
}

