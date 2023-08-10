const express =require('express')
const User = require('../models/User')
const expressAsyncHandler = require('express-async-handler')
const { generateToken, isAuth } = require('../../auth')

const router = express.Router()

//회원가입
router.post('/register', expressAsyncHandler(async (req, res, next)=> {
    console.log(req.body)
    const user = new User({ //새로운 사용자 정보 생성
        name: req.body.name, //사용자가 입력한 값이 각각의 프로퍼티 안으로 들어간다 
        email: req.body.email,
        userId: req.body.userId,
        password: req.body.password,
    })
    const newUser = await user.save() //새롭게 생성된 유저의 정보를 DB에 저장
    if(!newUser){
        res.status(401),json({code: 401, message: 'Invalid User Data'})
    }else{
        const {name, email, userId, isAdmin, createdAt} = newUser //새로운 유저라면 각 프로퍼티 값을 newUser 객체에 저장
        res.json({ // 새로운 유저 정보를 브라우저에 전송해야하기 때문에 json 형태로 변환
            code: 200,
            token: generateToken(newUser), //새로운 사용자의 토큰 생성
            name, email, userId, isAdmin, createdAt //password는 민감한 정보이기 때문에 제외
        })
    }
}))

//로그인
router.post('/login', expressAsyncHandler(async (req, res, next)=> {
    console.log(req.body)
    const loginUser = await User.findOne({ //사용자의 아이디, 비밀번호값을 db에서 조회
        email: req.body.email,
        password: req.body.password,
    })
    if(!loginUser){
        res.status(401).json({code: 401, message: 'Invalid Email or Password !'})
        //사용자가 입력한 이메일, 패스워드가 맞지 않으면 에러를 날려준다
    }else{
        const {name, email, userId, isAdmin, createdAt} = loginUser 
        //사용자가 입력한 값이 db에 있다면
        //db에 저장되있던 사용자의 정보 중 필요 프로퍼티만 배열로 추출해서 liginUser 객체에 저장
        res.json({
            code: 200,
            token: generateToken(loginUser), //토큰 재생성
            name, email, userId, isAdmin, createdAt
        })
    }
}))

//로그아웃
router.post('/logout', (req, res, next)=> {
    res.json('logout')
})

//사용자 정보 수정 (수정권한이 있는지 체크 후 권한 부여)
router.put('/:id', isAuth, expressAsyncHandler(async (req, res, next)=> {
    const user = await User.findById(req.params.id) //url에 입력된 아이디값으로 db에 저장된 정보 조회
    if(!user){
        res.status(404).json({code: 404, message: 'User Not Founded :-('})
        //사용자의 아이디값을 조회할 수 없으면 404 에러 처리
    }else{
        user.name = req.body.name || user.name //사용자의 이름 값이 변경이되어서 요청이 들어오면 그 값을 저장하고 요청이 없다면 기존의 값을 저장
        user.email = req.body.email || user.email
        user.password = req.body.password || user.password
        user.lastModifiedAt = new Date() //수정시각 업데이트(추가)
        const updatedUser = await user.save() //변경된 사용자의 정보를 db에 저장
        const {name, email, userId, isAdmin, createdAt} =updatedUser // 업데이트된 정보를 updatedUser 객체에 저장
        res.json({
            code: 200,
            token: generateToken(updatedUser), //토큰 재생성
            name, email, userId, isAdmin, createdAt
        })
    }
}))

//사용자 정보 삭제
router.delete('/:id', isAuth, expressAsyncHandler(async (req, res,next)=> {
    const user = await User.findByIdAndDelete(req.params.id)//url에 입력된 사용자의 아이디 값을 조회 후 삭제
    if(!user){
        res.status(404).json({code: 404, message: 'User not founded :-('})
    }else{
        res.status(204).json({code: 204, message: 'User has been deleted successfully!'})
    }
}))

module.exports = router