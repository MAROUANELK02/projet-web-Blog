import React from "react";
import { formatISO9075 } from "date-fns";

const Post = ({ titre, image, author, createdAt, contenu, categories }) => {
  return (
    <div className="post">
      <div className="image">
        <img src={'http://localhost:5000/'+image} alt="" />
      </div>
      <div className="texts">
        <h2>{titre}</h2>
        <p className="info">
          <a className="author" href=" ">
            {author}
          </a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </p>
        <p className="contenu">{contenu}</p>
        <div className="categories">
        <p>Catégories :</p>
          {categories.map((category) => (
            <span key={category.id} className="category">
              {category.nom}
            </span>
          ))}
        </div>
      </div>
    </div> 
  );
};

export default Post;
