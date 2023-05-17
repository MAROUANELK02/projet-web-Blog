import { useState } from "react";
import ReactQuill from "react-quill";
import { Navigate } from "react-router-dom";
import 'react-quill/dist/quill.snow.css';

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
  const [email, setEmail] = useState('');
  const [files, setFiles] = useState(undefined);
  const [redirect, setRedirect] = useState(false);

  const data = new FormData();
  data.set('titre', title);
  data.set('image', files);
  data.set('contenu', content);
  data.set('email', email);

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
        type="email"
        placeholder="Email"
        value={email}
        onChange={ev => setEmail(ev.target.value)}
      />

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

      <button style={{ marginTop: '5px' }}>Create Post</button>
    </form>
  );
}
