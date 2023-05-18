import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {formatISO9075} from "date-fns";

function isGeneratedLink(image) {
    // Vérifiez si le lien commence par "http://localhost:5000/"
    return image.startsWith('uploads');
  }

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const {id} = useParams();
    useEffect(() => {
        fetch(`http://localhost:5000/articles/${id}`)
        .then((response) => {
                response.json().then((postInfo) => {
                        setPostInfo(postInfo);
                });
            }
        )
    });

    if(!postInfo) return '';

    return (
        <div className="post-page">
        <h1> {postInfo.titre} </h1>
        <time>Created at : {formatISO9075(new Date(postInfo.createdAt))}</time>   
        <div className="author">By : {postInfo.author} </div>
        <div className="image">
          {isGeneratedLink(postInfo.image) ? (
            <img src={'http://localhost:5000/' + postInfo.image} alt="" />  
          ) : (
            <img src={postInfo.image} alt="" />
          )}
        </div>
        <div className="contenu" dangerouslySetInnerHTML={{__html:postInfo.contenu}}/>
        </div>
    )
}