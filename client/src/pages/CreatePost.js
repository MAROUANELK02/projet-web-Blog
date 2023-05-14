import { useState, useContext, useEffect } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { UserContext } from "../UserContext";


const modules = {
        toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' },
            ],
            ['link', 'image'],
            ['clean'],
          ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

export default function CreatePost() {
    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    const [files, setFiles] = useState(undefined);
    const [category, setCategory] = useState('');
    
    const {setUserInfo,userInfo} = useContext(UserContext);
    useEffect(() => { 
    fetch('http://localhost:5000/auth/profile', {
      credentials: 'include',
    }).then(response => {
      response.json().then(userInfo => {
        setUserInfo(userInfo);
      });
    });
    }, [setUserInfo]);
    
    const handleCategoryChange = (event) => {
      setCategory(event.target.value);
    };
    
    const data = new FormData();
    data.set('titre',title);
    data.set('image',files);
    data.set('contenu',content);
    data.set('utilisateurId', userInfo && userInfo.id);
    data.set('nom', category);
    
    async function createNewPost(ev) {
      
        ev.preventDefault();
        await fetch('http://localhost:5000/articles', {
            method: 'POST',
            body: data, 
        })
    }
    return (
        <form onSubmit={createNewPost}>
            
            <input type="title" 
            placeholder={'Titre'} 
            value={title} 
            onChange={ev => setTitle(ev.target.value)}/>
            
            <input
            type="file"
            onChange={(e) => setFiles(e.target.files[0])}
            placeholder="Lien de l'image"/>

            <ReactQuill 
            value={content} 
            onChange={newValue => setContent(newValue)}
            modules={modules} 
            formats={formats} />

            <div className="category-container">
            <label htmlFor="category">Catégorie :</label>
            <select id="category" value={category} onChange={handleCategoryChange}>
              <option value="">Sélectionnez une catégorie</option>
              <option value="food">Food</option>
              <option value="science">Science</option>
              <option value="cinema">Cinema</option>
            </select>
          </div>
            <button style={{marginTop:'5px'}}>Create Post</button>
        </form>
    )
}