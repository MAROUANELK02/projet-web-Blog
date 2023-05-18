import './App.css';
import {Routes,Route} from "react-router-dom";
import Layout from "./Layout"
import IndexPage from './pages/indexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { UserContextProvider } from './UserContext';
import CreatePost from './pages/CreatePost';
import UsersPage from './pages/UsersPage';

function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<IndexPage />} /> 
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/create' element={<CreatePost/>}/>
        <Route path='/users' element={<UsersPage/>}/>
      </Route>
    </Routes>
    </UserContextProvider>

    
    
  );
}

export default App;
