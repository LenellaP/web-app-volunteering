import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get('/api/posts')
      .then((res) => setPosts(res.data))
      .catch((err) => console.log('Error fetching posts'));
  }, []);

  return (
    <div>
      <h2>Список постів</h2>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
