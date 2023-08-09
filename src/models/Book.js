const mongoose = require('mongoose')

const { Schema } = mongoose
const { Types: {ObjectId} } = Schema

const bookSchema = new Schema({
    lentBy:{
        type: ObjectId,
        required: true,
        ref: 'User',
    },
    category: {
        type: String,
        required: true,
    },
    title:{
        type: String,
        required: true,
        trim: true
    },
    author:{
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    lentAt: {
        type: Date,
        default: Date.now,
    },
    returnAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    }
})

const Book = mongoose.model('Book', bookSchema)
module.exports = Book

//book 데이터 생성 테스트
// const book = new Book({
//     category: '111111111111111111111111',
//     title: '무인도에서 살아남기',
//     author: '김땡땡',
//     status: '대출 중',
//     lentBy: '홍길동',
// })
// book.save()
// .then(()=> console.log('book created!'))
// .catch(e => console.log('failed to create books..'))