import { useContext, useEffect, useState } from "react";
import {Navigate, useParams} from "react-router-dom";
import Editor from "../Editor";
import { UserContext } from "../UserContext";

export default function EditPost() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState(undefined);
    const [redirect, setRedirect] = useState(false);
    const {userInfo} = useContext(UserContext);

    useEffect(() => {
        fetch('http://localhost:5000/articles/'+id)
        .then(response => {
            response.json().then(postInfo => {
                setTitle(postInfo.titre);
                setContent(postInfo.contenu);
            });
        });
    },[id]);

    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('id',id);
        data.set('titre',title);
        data.set('contenu',content);
        data.set('userId',userInfo.id);

        if(files) 
          data.set('image',files);

        const response = await fetch('http://localhost:5000/articles', {
            method: 'PATCH',
            body: data,
            credentials: 'include',
        });
        
        if(response.ok) {
          alert('Article modifié avec succès !');
          setRedirect(true);
        }
        else{
            alert('erreur !');
        };
    };

    if(redirect) {
        return <Navigate to={'/post/'+id} />
    }

    return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFiles(e.target.files[0])}
        placeholder="Upload an image"
      />

      <Editor onChange={setContent} value={content}/>

      <button style={{ marginTop: '5px' }}>Edit Post</button>
    </form>
  );
} 