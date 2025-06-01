import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import CreatePostForm from './components/CreatePostForm';
import EditPost from './pages/EditPost';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Chat from './pages/Chat';
import CreateRequest from './pages/CreateRequest';
import RequestsPage from './pages/RequestsPage';
import RequestChat from './pages/RequestChat'; // або правильний шлях
import MyChats from './pages/MyChats';
import UserProfile from './pages/UserProfile';

const App = () => {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Публічні сторінки */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/my-chats" element={<MyChats />} />
        
        {/* Приватні сторінки */}
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        <Route path="/create" element={
          <PrivateRoute>
            <CreatePostForm />
          </PrivateRoute>
        } />
        <Route path="/edit/:id" element={
          <PrivateRoute>
            <EditPost />
          </PrivateRoute>
        } />
        <Route path="/chat/:postId" element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } />
        <Route path="/requests" element={<RequestsPage />} />
        <Route path="/create-request" element={<CreateRequest />} />
        <Route path="/request-chat/:requestId" element={<RequestChat />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/profile/:userId" element={<UserProfile />} />



      </Routes>
    </>
  );
};

export default App;
