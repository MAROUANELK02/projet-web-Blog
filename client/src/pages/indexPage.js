import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "../Post";

export default function IndexPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const response = await axios.get("http://localhost:5000/articles");
        const articles = response.data;
 
        // Fetch categories for each article
        const updatedArticles = await Promise.all(
          articles.map(async (article) => {
            const categoriesResponse = await axios.get(`http://localhost:5000/articles/categories/${article.id}`);
            const categories = categoriesResponse.data;
            return { ...article, categories };
          })
        ); 

        setArticles(updatedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }

    fetchArticles();
  }, []);

  if (articles.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {articles.map((article) => (
        <Post key={article.id} {...article} />
      ))}
    </>
  );
}
