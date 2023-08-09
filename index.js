const { response } = require('express')
const express = require('express')  //require : 모듈을 가져와서 임포트 하는 키워드
const app =express()
const router = express.Router() 
const port = 3000 //서버 포트
const cors = require('cors')
const logger = require('morgan')
const mongoose = require('mongoose')
const axios = require('axios')
// const book = require('./src/models/Book')
// const user = require('./src/models/User')
const usersRouter = require('./src/routes/users')
const booksRouter = require('./src/routes/books')
const config = require('./config')
const books = {"홍길동" : ["가나다", "라마바사", "아자차"], 
               "김철수": ["ABC", "DEF","HGT"],
               "김영희": ["해리포터", "아기돼지 삼형제"]}


//cors 옵션 , 설정
const corsOptions = {
    origin: 'http://127.0.0.1:5500',
    credentials: true,
}

// mongo db 연결
mongoose.connect(config.MONGODB_URL)
.then(()=> console.log('mongo db connected...'))
.catch(e => console.log(`failed to connect mongo db: ${e}`))

app.get('/fetch', async(req, res)=> {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos')
    res.send(response.data)
})

//사용자 요청이 들어온 경우 공통적으로 처리되어야하는 미들웨어
app.use(cors(corsOptions))
app.use(express.json()) //request body 파싱
app.use(logger('tiny'))// Logger 설정
app.use('/api/users', usersRouter)
app.use('/api/books', booksRouter)

app.get('/hello', (req, res)=> {
    res.json('hello world!')
})
app.post('/hello', (req, res)=> {
    console.log(req.body)
    res.json({ userId: req.body.userId, email: req.body.email})
})
               
// 요청에 대한 로그 기록
const mylogger = function(req, res, next){
    console.log(`LOGGED - ${new Date}`)
    next()
}
app.use(mylogger)

//URL 파라메터로 전달된 현재 사용자를 req.user 객체에 저장
app.use('/users/:uname/books', function(req, res, next){
    req.user = req.params.uname
    next()
})

//현재 사용자의 전체 도서 목록 조회
app.get('/users/:uname/books', function(req, res, next){
    if(req.params.uname == "홍길동"){
        req.books = books.홍길동
        res.send({user: `${req.user}`, book: `${req.books}`})
        next()
    }else if(req.params.uname == "김철수"){
        req.books = books.김철수
        res.send({user: `${req.user}`, book: `${req.books}`})
        next()
    }else if(req.params.uname =="김영희"){
        req.books = books.김영희
        res.send({user: `${req.user}`, book: `${req.books}`})
        next()
    }else next()
})

//현재 사용자의 도서목록에 특정 도서 추가
app.post('/users/:uname/books', function(req, res, next){
    if(req.params.uname == '홍길동'){
        req.addBook = req.query.book
        books.홍길동.push(req.addBook)
        res.send({book: `${books.홍길동}`})
        next()
    }else if(req.params.uname == '김영희'){
        console.log(req.query.book)
        req.addBook = req.query.book
        books.김영희.push(req.addBook)
        res.send({book: `${books.김영희}`})
        next()
    }else if(req.params.uname == '김철수'){
        console.log(req.query.book)
        req.addBook = req.query.book
        books.김철수.push(req.addBook)
        res.send({book: `${books.김철수}`})
        next()
    }
    else next()
})

// 현재 사용자의 특정 도서 조회
app.get('/users/:uname/books/:name', function(req, res, next){
    for(let i=0; i<books["김영희"].length; i++){
        if(req.params.uname == "김영희"){
            req.book = req.params.name
           return res.send({book: `${req.book}`})
        }
        else next()
    }
    for(let i=0; i<books["김철수"].length; i++){
        if(req.params.uname == "김철수"){
            req.book = req.params.name
            return res.send({book: `${req.book}`})
        }
        else next()
    }
    for(let i=0; i<books["홍길동"].length; i++){
        if(req.params.uname == "홍길동"){
            req.book = req.params.name
            return res.send({book: `${req.book}`})
        }
        else next()
    }
    next()
})

// // 현재 사용자의 특정 도서내용 변경
app.put('/users/:uname/books/:name', function(req, res, next){
    for(let i=0; i<books["홍길동"].length; i++){
        if(req.params.name == "홍길동"){
            req.change = req.query.book
            books.홍길동.splice(books["홍길동"].indexOf(`${req.params.name}`), 1, `${req.change}`)
            return res.send({book: `${books["홍길동"]}`})
        }
        else next()
    }
    for(let i=0; i<books["김철수"].length; i++){
        if(req.params.name = "김철수"){
            req.change = req.query.book
            books.김철수.splice(books["김철수"].indexOf(`${req.params.name}`), 1, `${req.change}`)
            return res.send({book: `${books["김철수"]}`})
        }
        else next()
    }
    for(let i=0; i<books["김영희"].length; i++){
        if(req.params.name == "김영희"){
            req.change = req.query.book
            books.김영희.splice(books["김영희"].indexOf(`${req.params.name}`), 1, `${req.change}`)
            return res.send({book: `${books["김영희"]}`})
        }
        else next()
    }
    next()
})

// //현재 사용자의 특정 도서 삭제
app.delete('/users/:uname/books/:name', function(req, res, next){

    next()
})

app.use((req, res, next)=>{
    res.status(404).send('Page not found')
})
app.use((err, req, res, next)=> {
    console.error(err.stack)
    res.status(500).send('오류가 발생하였습니다!')
})
app.listen(port, ()=> { 
    console.log(`Example app listening on port ${port}`)
})