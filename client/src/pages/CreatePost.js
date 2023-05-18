import { useState,useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import { Navigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';
import axios from "axios";
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
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState(undefined);
  const [redirect, setRedirect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const {userInfo} = useContext(UserContext);

  useEffect(() => {
    async function fetchCategories() {
      try{
        const response = await axios.get("http://localhost:5000/categories");
        const categories = response.data;
        setCategories(categories);
      }catch(err){
        console.log("Error fetching categories: ",err);
      }
    }
    fetchCategories();
  },[setCategories]);

  const data = new FormData();
  data.set('titre', title);
  data.set('image', files);
  data.set('contenu', content);
  data.set('userId', userInfo.id);
  data.set('categorieId', selectedCategory);

  async function createNewPost(ev) {
    ev.preventDefault();
    try {
        const articleResponse = await fetch('http://localhost:5000/articles/', {
          method: 'POST',
          body: data,
        });
        if (articleResponse.ok) {
          alert('Article ajouté avec succès !');
          setRedirect(true);
        } else {
          // Gérez les erreurs lors de la création du post
          const error = await articleResponse.json();
          console.log('Erreur lors de la création du post :', error);
        }
    } catch (error) {
      console.log('Une erreur s\'est produite :', error);
    }
  };

        if(redirect) {
          return <Navigate to={'/'} />
        }

  return (
    <form onSubmit={createNewPost}>
      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFiles(e.target.files[0])}
        placeholder="Lien de l'image"
      />

      <ReactQuill
        value={content}
        onChange={newValue => setContent(newValue)}
        modules={modules}
        formats={formats}
      />

      <select value={selectedCategory} 
      onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">Sélectionnez une catégorie</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.nom}
          </option> 
        ))}
      </select>

      <button style={{ marginTop: '5px' }}>Create Post</button>
    </form>
  );
}
