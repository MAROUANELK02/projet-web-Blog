import React from "react";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

function isGeneratedLink(image) {
  return image.startsWith('uploads');
}

const Post = ({ id, titre, image, author, createdAt, categories }) => {
  return (
    <div className="post">
      <Link to={`/post/${id}`}>
          <div className="image">
          {isGeneratedLink(image) ? (
            <img src={'http://localhost:5000/' + image} alt="" />  
          ) : (
            <img src={image} alt="" />
          )}
        </div>
      </Link>
    
      <div className="texts">
        
        <Link to={`/post/${id}`}>
          <h2>{titre}</h2>
        </Link>
        
        <p className="info">
        <div className="author">
          Publié par : <strong style={{ fontSize: 'larger', fontWeight: 'bold' }}>{author}</strong><br />
          Créé le : <time style={{ fontSize: 'larger', fontWeight: 'bold' }}><strong>{formatISO9075(new Date(createdAt))}</strong></time>
        </div>
        </p>

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
