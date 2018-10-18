if (process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://khoa:khoa95@ds115263.mlab.com:15263/ideasjot-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost:27017/ideasjot'
    }
    
}