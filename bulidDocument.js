const mongoose = require('mongoose')
const User = require('./src/models/User')
const Book = require('./src/models/Book')
const config = require('./config')

//랜덤 더미 데이터 생성을 위한 도서 카테고리, 대출상태
const category = ['자기개발', '교육', '과학', '요리', '여행', '언어', '취미', '소설', '수필', '경제']
const status = [true, false]
let users = []

//데이터 베이스 연결
mongoose.connect(config.MONGODB_URL)
.then(()=> console.log('mongo DB connected...'))
.catch( e => console.log(`Failed to connect Mongo DB: ${e}`))



//랜덤 문자열 생성
const randomString = n => {
    const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]
    const string = new Array(n).fill('a') // a로 시작하는 n개의 문자 배열
    return string.map( str => alphabet[Math.floor(Math.random() * alphabet.length)]).join("")
}

//랜덤 날짜 생성
const randomDate = (from, to) => {
    return new Date(
        from.getTime() + Math.random() * (to.getTime() - from.getTime())
    )
}

//배열에서 랜덤으로 값 선택하여 넣어주는 함수
const selectRandomValue = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)]
    //인자로 들어온 배열내의 값을 랜덤으로 추출해서 새로운 배열에 담아준다
}

//User 데이터 생성
const createUsers = async ( n, users ) => {
    console.log('Creating users now ....')
    for(let i=0; i<n; i++){
        const user = new User({
            name: randomString(5),
            email: `${randomString(7)}@example.com`,
            userId: randomString(10),
            password: randomString(15)
        })
        users.push(await user.save())
    }
    return users
}

//book 데이터 생성 테스트
const createBooks = async (n, user) => { 
    console.log(`Creating books by ${user.name} now...`)
    for(let i=0; i<n; i++){
        const book = new Book({
            lentBy: user._id,
            category: selectRandomValue(category),
            imgURL: `https://www.${randomString(7)}.com/${randomString(10)}.png`,
            title: randomString(10),
            author: randomString(6),
            status: selectRandomValue(status),
            lentAt: randomDate(new Date(2023, 5, 1), new Date()),
            returnAt: randomDate(new Date(2023, 5, 1), new Date()),
            lastUpdated: randomDate(new Date(2023, 5, 1), new Date())
        })
        await book.save()
    }
}

//사용자, 해당 사용자의 책 리스트 순서대로 생성
const createData = async (users) => {
    users = await createUsers(5, users)
    users.forEach(user => {
        createBooks(15, user)
    });
}

//데이터 생성
createData(users)