
const { v4: uuid } = require("uuid");
const cloudinary = require("cloudinary").v2;

const uploadAudios = async (audios = []) => {
  if (!audios || audios.length === 0) {
    console.log("Audio not found");
    return [];
  }

  const uploadPromises = audios.map((audio) => {
    return new Promise((resolve, reject) => {
      if (!audio.buffer) {
        return reject("Audio buffer is undefined");
      }

      const public_id = uuid(); // define public_id here

      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          public_id, // now this is properly defined
        },
        (error, result) => {
          if (error) {
            return reject("Audio failed to upload: " + error.message);
          }

          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      );

      stream.end(audio.buffer);
    });
  });

  const results = await Promise.all(uploadPromises);
  return results;
};

module.exports = uploadAudios;
