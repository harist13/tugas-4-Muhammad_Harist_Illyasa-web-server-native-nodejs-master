const https = require('https');

const commentHandler = {};

commentHandler.getAllComments = (req, res) => {
  // Ambil data komentar dari JSON Placeholder
  https.get('https://jsonplaceholder.typicode.com/comments', (response) => {
    let data = '';

    response.on('data', (chunk) => {
      data += chunk;
    });

    response.on('end', () => {
      try {
        // Ubah data JSON menjadi array JavaScript
        const comments = JSON.parse(data);

        // Hapus key "id" dan ubah key "body" menjadi "content" dari setiap objek dalam array
        const commentsWithoutId = comments.map((comment) => {
          const { id, body, ...commentWithoutId } = comment;
          return { ...commentWithoutId, content: body };
        });

        // Kirim respons dengan data tanpa key "id" dan format JSON yang rapi
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(commentsWithoutId, null, 2)); // Gunakan null, 2 untuk indentasi 2 spasi
      } catch (error) {
        console.error(error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      }
    });
  }).on('error', (error) => {
    console.error(error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
};

module.exports = commentHandler;
