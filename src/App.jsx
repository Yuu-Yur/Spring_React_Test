import './App.css';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import LoginSuccess from './components/LoginSuccess';
//추가, 로그인 정보 표기
import { AuthProvider } from './contexts/AuthContext';
import TodoList from './components/TodoList';
import TodoEdit from './components/TodoEdit';
import AiTest from './components/AiTest';

function App() {
  return (
    <>
      {/* 추가, 로그인 정보 표기 */}
      <AuthProvider>
        <h1 className="react">스프링, 리액트 연동 테스트</h1>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/loginSuccess" element={<LoginSuccess />} />
          <Route path="/list" element={<TodoList />} />
          <Route path="/todo/edit/:tno" element={<TodoEdit />} />
          <Route path="/ai" element={<AiTest />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
