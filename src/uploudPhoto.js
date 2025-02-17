// filepath: /C:/Users/user/latihan-nest/uploadPhoto.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

async function uploadPhoto(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));

  try {
    const response = await axios.post('http://localhost:3000/mahasiswa/upload', form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    console.log('Upload successful:', response.data);
  } catch (error) {
    console.error('Upload failed:', error.response ? error.response.data : error.message);
  }
}

const filePath = path.resolve(__dirname, 'path/to/your/photo.jpg'); // Ganti dengan path file yang sesuai
uploadPhoto(filePath);