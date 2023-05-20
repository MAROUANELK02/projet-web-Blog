import { useContext, useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {formatISO9075} from "date-fns";
import {UserContext} from "../UserContext";

function isGeneratedLink(image) {
    return image.startsWith('uploads');
  }

export default function PostPage() {
    const [postInfo, setPostInfo] = useState(null);
    const [redirect, setRedirect] = useState(false);
    const {id} = useParams();
    const {userInfo} = useContext(UserContext);

    useEffect(() => {
        fetch(`http://localhost:5000/articles/${id}`)
        .then((response) => {
                response.json().then((postInfo) => {
                        setPostInfo(postInfo);
                });
            }
        )
    },[id]);

    if(!postInfo) return '';

    async function DeletePost() {
      try {
        const response = await fetch(`http://localhost:5000/articles/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userInfo.id,
          }),
          credentials: 'include',
        });
    
        if (response.ok) {
          alert('Article supprimé avec succès !');
          setRedirect(true);
        } else {
          alert("Vous n'êtes pas autorisé à supprimer l'article !");
        }
      } catch (error) {
        console.error(error);
      }
    }
    
    if(redirect) {
      return <Navigate to={'/'} />
    }

    return (
        <div className="post-page">
        <h1> {postInfo.titre} </h1>
        <time>Created at : {formatISO9075(new Date(postInfo.createdAt))}</time>   
        <div className="author">By : {postInfo.author} </div>
        {parseInt(userInfo.id) === parseInt(postInfo.utilisateurId) && (
            <div className="edit-rom"> 
                <Link to={`/edit/${postInfo.id}`} className="edit-btn">Editer l'article</Link>
                <button className="delete-btn" onClick={DeletePost}>Supprimer</button>
            </div> 
        )}   
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