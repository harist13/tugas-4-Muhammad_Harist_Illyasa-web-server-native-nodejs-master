const https = require('https');

const postCommentHandler = {};

postCommentHandler.getAllPostComments = (req, res) => {
  // Ambil data postingan dari JSON Placeholder
  https.get('https://jsonplaceholder.typicode.com/posts', (postResponse) => {
    let postData = '';

    postResponse.on('data', (postChunk) => {
      postData += postChunk;
    });

    postResponse.on('end', () => {
      // Ambil data komentar dari JSON Placeholder
      https.get('https://jsonplaceholder.typicode.com/comments', (commentResponse) => {
        let commentData = '';

        commentResponse.on('data', (commentChunk) => {
          commentData += commentChunk;
        });

        commentResponse.on('end', () => {
          // Menggabungkan data postingan dan komentar berdasarkan postId
          const posts = JSON.parse(postData);
          const comments = JSON.parse(commentData);
          const postCommentsMap = new Map();

          for (const comment of comments) {
            if (!postCommentsMap.has(comment.postId)) {
              postCommentsMap.set(comment.postId, []);
            }
            postCommentsMap.get(comment.postId).push(comment);
          }

          // Gabungkan data postingan dan komentar
          const combinedData = posts.map((post) => {
            const { id, title, body } = post;
            return {
              id,
              judulPost: title, // Mengubah key 'title' menjadi 'judulPost'
              contentPost: body, // Mengubah key 'body' menjadi 'contentPost'
              comments: postCommentsMap.get(post.id) || [],
            };
          });

          // Menghapus komentar dengan email "Eliseo@gardner.biz"
          combinedData.forEach((item) => {
            item.comments = item.comments.filter((comment) => comment.email !== "Eliseo@gardner.biz");
          });

          // Mengubah key dalam komentar
          combinedData.forEach((item) => {
            item.comments = item.comments.map((comment) => ({
              postId: comment.postId, // Tidak mengubah key 'postId'
              namaUser: comment.name, // Mengubah key 'name' menjadi 'namaUser'
              emailUser: comment.email, // Mengubah key 'email' menjadi 'emailUser'
              contentComment: comment.body, // Mengubah key 'body' menjadi 'contentComment'
            }));
          });

          // Mengatur indentasi menjadi 2 spasi
          const jsonResponse = JSON.stringify(combinedData, null, 2);

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(jsonResponse);
        });
      });
    });
  }).on('error', (error) => {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
};

module.exports = postCommentHandler;
