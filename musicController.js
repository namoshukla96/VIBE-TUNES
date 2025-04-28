const Music = require("../Schemas/MusicSchema")
const  uploadAudios = require("../features/feature")

const createMusic = async (req,res) => {
    const { name, genre, artistName , artistBio ,action} = req.body
   
    const { likes=0, dislike=0 } = action || {}
    const audio = req.file
    if (!audio) {
        return res.status(400).json({ msg: "Audio file is required" });
    }
   
    const results = await uploadAudios([audio])
    let attachments=null
    if(results.length>0){
attachments = {
public_id :results[0].public_id,
url: results[0].url
}
    }
    else {
        console.log("Cloudinary upload failed or returned empty result.");
      }
      const exists = await Music.findOne({ "attachments.url": attachments.url });
    if(exists){
        return res.status(400).json({msg:"music already exists"})
    }
  const music=   await Music.create({ name,attachments,genre, artist :{ name: artistName, bio: artistBio} , action:{likes, dislike}})
  return res.status(200).json(music)
}
const music = async (req,res) => {
    const songs = await Music.find({})
    if(songs.length>0){
        return res.status(200).json(songs)
    }
    
}
const getMusicQuery = async (req,res) => {
    const{name ,  artistName }= req.query
    const music = await Music.find({ $or:[
        { name: { $regex: name, $options: 'i' } },
        {"artist.name" : { $regex: artistName, $options: 'i' } },
      ],
})
    if(music){
        return res.status(200).json(music)   
    }
    return res.status(400).json({msg:"music do not exists"})
}
const getMusicParams = async (req,res) => {
    const{genre} = req.params
    const music = await Music.find({  genre: { $regex: genre, $options: 'i' }})
    if(music){  
        return res.status(200).json(music)   
    }
    return res.status(400).json({msg:"invalid genre"})
}

const getAction = async (req, res) => {
    try {
      const { type, _id } = req.body;
      const userId = req.user._id;
  
      const music = await Music.findById(_id);
  
      if (!music) {
        return res.status(404).json({ message: "Music not found" });
      }
  
      // If likedBy or dislikedBy are undefined, initialize them
      if (!music.likedBy) {
        music.likedBy = [];
      }
      if (!music.dislikedBy) {
        music.dislikedBy = [];
      }
  
      if (type === "likes") {
        if (music.likedBy.includes(userId)) {
          return res.status(400).json({ message: "You already liked this song" });
        }
        music.action.likes += 1;
        music.likedBy.push(userId);
      } else if (type === "dislikes") {
        if (music.dislikedBy.includes(userId)) {
          return res.status(400).json({ message: "You already disliked this song" });
        }
        music.action.dislikes += 1;
        music.dislikedBy.push(userId);
      } else {
        return res.status(400).json({ message: "Invalid action type" });
      }
  
      await music.save();
  
      return res.status(200).json({
        action: music.action,
        msg: type === "likes" ? "Thanks for your like!" : "Aww, you disliked the song 😢",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server error" });
    }
  };

const deleteSong = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ msg: "Error occurred: song ID not found" });
    }

    const music = await Music.findById(id);
    if (!music) {
      return res.status(400).json({ msg: "Error occurred: song not found" });
    }

    await Music.findByIdAndDelete(id); 

    return res.status(200).json({ msg: "Song deleted successfully" });
    
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error, msg: "Error occurred: song not deleted" });
  }
};

  
  

module.exports = {createMusic, getMusicQuery, getMusicParams, music,getAction, deleteSong}