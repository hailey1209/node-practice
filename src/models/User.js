const mongoose = require('mongoose')

const { Schema }= mongoose

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now,
    }
})

const User = mongoose.model('User', userSchema)
module.exports = User

//User 데이터 생성 테스트
// const user = new User({
//     name: '홍길동',
//     email: '홍길동@gmail.com',
//     userId: '홍길동짱',
//     password: '1234567890',
//     isAdmin: true,
// })
// user.save()
// .then(()=> console.log('user created!'))
// .catch(e => console.log('failed to create user..'))