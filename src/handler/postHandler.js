const https = require('https');

const postHandler = {};

postHandler.getAllPost = (req, res) => {
  // Ambil data postingan dari JSON Placeholder
  https.get('https://jsonplaceholder.typicode.com/posts', (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      // Mengubah data sesuai permintaan
      const posts = JSON.parse(data).map((post) => ({
        userId: post.userId,
        postId: post.id,
        judulPost: post.title,
        content: post.body,
      }));

      // Mengirim data yang telah diubah sebagai respons
      const jsonResponse = JSON.stringify(posts, null, 2); // Mengatur indentasi menjadi 2 spasi
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(jsonResponse);
    });
  }).on('error', (error) => {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
};

module.exports = postHandler;
