const { response } = require('express')
const express = require('express')  //require : 모듈을 가져와서 임포트 하는 키워드
const app =express()
const router = express.Router() 
const port = 3000 //서버 포트
const books = {"홍길동" : ["가나다", "라마바사", "아자차"], 
               "김철수": ["ABC", "DEF","HGT"],
               "김영희": ["해리포터", "아기돼지 삼형제"]}

// 요청에 대한 로그 기록
const logger = function(req, res, next){
    console.log(`LOGGED - ${new Date}`)
    next()
}
app.use(logger)

//URL 파라메터로 전달된 현재 사용자를 req.user 객체에 저장
app.use('/users/:uname/books', function(req, res, next){
    req.user = req.params.uname
    next()
})

//현재 사용자의 전체 도서 목록 조회
app.get('/users/:uname/books', function(req, res, next){
    if(req.params.uname == "홍길동"){
        console.log(req.params.uname)
        console.log(books.홍길동)
        req.books = books.홍길동
        // console.log(req.books)
        res.send({user: `${req.user}`, book: `${req.books}`})
        next('route')
    }else if(req.params.uname == "김철수"){
        console.log(req.params.uname)
        console.log(books.김철수)
        req.books = books.김철수
        res.send({user: `${req.user}`, book: `${req.books}`})
        next('route')
    }else if(req.params.uname =="김영희"){
        console.log(req.params.uname)
        console.log(books.김영희)
        req.books = books.김영희
        res.send({user: `${req.user}`, book: `${req.books}`})
        next('route')
    }else next()
})

//현재 사용자의 도서목록에 특정 도서 추가
app.post('/users/:uname/books', function(req, res, next){
    if(req.params.uname == '홍길동'){
        console.log(req.query.book)
        req.addBook = req.query.book
        books.홍길동.push(req.addBook)
        res.send(books.홍길동)
        // console.log(res)
        next('route')

    }else if(req.params.uname == '김영희'){
        console.log(req.query.book)
        req.addBook = req.query.book
        books.김영희.push(req.addBook)
        res.send(books.김영희)
        // console.log(res)
        next('route')

    }else if(req.params.uname == '김철수'){
        console.log(req.query.book)
        req.addBook = req.query.book
        books.김철수.push(req.addBook)
        res.send(books.김철수)
        // console.log(res)
        next('route')
    }else
    next()
})

//현재 사용자의 특정 도서 조회
app.get('/users/:uname/books/:name', function(req, res, next){

    next()
})

// 현재 사용자의 특정 도서내용 변경
app.put('/users/:uname/books/:name?book=apple', function(req, res, next){

    next()
})

//현재 사용자의 특정 도서 삭제
app.delete('/users/:uname/books/:name', function(req, res, next){

    next()
})

app.listen(port, ()=> { 
    console.log(`Example app listening on port ${port}`)
})