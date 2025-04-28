const multer = require('multer')
const storage = multer.memoryStorage()
const multerFile = multer({
    storage,
    fileType :(req,audio,cb)=>{
        const audioMimeTypes = ["audio/mpeg","audio/ogg","audio/wav","audio/mp4","audio/webm","audio/midi"]
        if (audioMimeTypes.includes(audio)){
            cb(null,true)
        }
        else{
            cb("invalid audio Type",false)
        }
    }
})

module.exports= multerFile