import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

// Function to upload the image to ImgBB
const uploadImageToImgBB = async (imagePath) => {
  const form = new FormData();
  form.append('image', fs.createReadStream(imagePath));

  try {
    // Make a POST request to ImgBB's upload endpoint
    const response = await axios.post('https://api.imgbb.com/1/upload?key=34e47b6076eb3203f89a245b62e19b35', form, {
      headers: form.getHeaders(),
    });

    // Return the URL of the uploaded image
    return response.data.data.url;
  } catch (error) {
    console.error('Error uploading image to ImgBB:', error);
    throw error;
  }
};

export default uploadImageToImgBB;
