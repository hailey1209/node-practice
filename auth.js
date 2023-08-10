const config = require('./config')
const jwt = require('jsonwebtoken')

const generateToken = (user) => { //토큰 생성
    return jwt.sign({
        _id: user._id, //사용자 정보(json)
        name: user.name,
        email: user.email,
        userId: user.userId,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
    },
    config.JWT_SECRET, //jwt secret key
    {
        expiresIn: '1d',
        issuer: 'hailey'
    })
}

//사용자 권한 검증
const isAuth = (req, res, next) => {
    const bearerToken = req.headers.authorization //요청 헤더에 저장된 토큰
    if(!bearerToken){
        res.status(401),json( { code: 401, message: 'Token is not supplied'} )
    }else{
        const token = bearerToken.slice(7, bearerToken.length)
        jwt.verify(token, config.JWT_SECRET, (err, userInfo) => {
            if( err && err.name === 'TokenExpiredError'){
                res.status(419).json({ code: 419, message: 'Token has been expired!'})
            }else if(err){
                res.status(401).json({code: 401, message: 'Invailed token!'})
            }else{
                req.user = userInfo
                next()
            }
        })
    }
}

// 관리자 권한 검증
const isAdmin = (req, res, next)=> { //사용자가 관리자 권한이 있는지 검사
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401).json({code: 401, message: 'You are not valid admin user!'})
    }
}


module.exports = {
    generateToken,
    isAuth,
    isAdmin,
}