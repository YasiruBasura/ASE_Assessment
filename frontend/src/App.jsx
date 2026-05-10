import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HomeFeed from './pages/HomeFeed';
import PostDetail from './pages/PostDetail';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeFeed />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
      </Routes>
    </Router>
  );
}

export default App;