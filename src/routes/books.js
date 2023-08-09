const express = require('express')
const Books = require('../models/Book')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')
const Book = require('../models/Book')

const router = express.Router()


//해당 사용자 기준 전체 책 목록 조회
router.get('/', isAuth, expressAsyncHandler(async (req, res, next)=> {
    const books =await Books.find({lentBy: req.user._id}) //req.user => isAuth에서 전달된 값
    if(books.length === 0 ){
        res.status(404).json( {code: 404, message: 'Failed to find books!!'})
    }else{
        res.json({ code: 200, books})
    }
}))

//사용자 특정 책 조회
//{id} => 조회하고싶은 책의 _id 값
router.get('/:id', isAuth, expressAsyncHandler(async (req, res, next)=> {
    const book = await Books.findOne({
        lentBy: req.user._id, // req.user 는 isAuth 에서 전달 됨
        _id: req.params.id //book id
    })
    if(!book){
        res.status(404).json({code: 404, message: 'Book is not found'})
    }else{
        res.json({code: 200, book})
    }
}))

//특정 책 생성
router.post('/', isAuth, expressAsyncHandler(async (req, res, next)=> {
    const searchedBook = await Books.findOne({
        lentBy: req.user._id,
        category: req.body.category,
        title: req.body.title,
        author: req.body.author,
        status: req.body.status,
    })
    if(searchedBook){ //카테고리 값으로 입력된 값이 이미 리스트에 존재하는경우 204 에러 처리
        res.status(204).json({code: 204, message: '추가하려는 책이 이미 리스트에 있습니다.'})
    }else{
        const book = new Book({ //중복된 값이 없다면 새로운 book 객체를 생성해서 저장
            lentBy: req.user._id,
            category: req.body.category,
            title: req.body.title,
            author: req.body.author,
            status: req.body.status,
        })
        const newBook = await book.save() //새로 생성된 book 객체를 db에 저장
        if(!newBook){
            res.status(401).json({code: 401, message: 'Failed to save book'})
        }else{
            res.status(201),json({
                code: 201, 
                message: 'New book has been created.',
                newBook //DB에 저장된 book
            })
        }
    }
}))

//특정 책 변경
//{id} => 변경하고싶은 책의 _id 값
router.put('/:id',isAuth, expressAsyncHandler(async (req, res, next)=> {
    const book = await Books.findById(req.params.id)
    if(!book){
        res.status(404).json({code: 404, message: 'Book is not founded'})
    }else{
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.status = req.body.status || book.status
        book.lastUpdated = new Date() //수정시각 업데이트

        const updatedBook = await book.save()  //업데이트된 책의 정보를 DB에 저장
        res.json({
            code: 200,
            message: 'Book Updated',
            updatedBook
        })
    }
}))

//특정 책 삭제
//{id} => 삭제하고싶은 책의 _id 값
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res, next)=> {
    const book = await Books.findOne({
        lentBy: req.user._id,
        _id: req.params.id
    })
    if(!book){
        res.status(404).json({code: 404, message: 'Book is not founded'})
    }else{
        await Books.deleteOne({
            lentBy: req.user._id,
            _id: req.params.id
        })
        res.status(204).json({code: 204, message: 'Books has been deleted successfully.'})
    }
}))

module.exports = router