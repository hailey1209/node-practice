const express = require('express')
const Books = require('../models/Book')
const expressAsyncHandler = require('express-async-handler')
const { isAuth } = require('../../auth')

const router = express.Router()

router.get('/', (req, res, next)=> {
    res.json('전체 책 목록 조회')
})
router.get('/:id', (req, res, next)=> {
    res.json('사용자 특정 책 목록 조회')
})
router.post('/', (req, res, next)=> {
    res.json('새로운 책 생성')
})
router.put('/:id', (req, res, next)=> {
    res.json('특정 책 변경')
})
router.delete('/:id', (req, res, next)=> {
    res.json('특정 책 삭제')
})

module.exports = router