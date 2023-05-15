import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../Post";

export default function IndexPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await axios.get("http://localhost:5000/articles");
        const posts = response.data;
        setPosts(posts);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }

    fetchPosts();
  }, []);

  if (posts.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {posts.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </>
  );
}
