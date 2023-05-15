import React from "react";
import { formatISO9075 } from "date-fns";

const Post = ({ titre, image, author, createdAt, contenu }) => {
  return (
    <div className="post">
      <div className="image">
        <img src={image} alt="" />
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
      </div>
    </div>
  );
};

export default Post;
