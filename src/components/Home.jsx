import React from 'react';
import { Link } from 'react-router-dom';
//추가, 로그인 정보 표기
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { Container, Button, Navbar, Nav } from 'react-bootstrap';
import TodoList from './TodoList';

const Home = () => {
  //추가, 로그인 정보 표기
  const { user, logout, extendSession, remainingTime } = useAuth(); // Context에서 user 정보 가져오기
  const navigate = useNavigate();

  // 🔹 남은 시간을 MM:SS 형식으로 변환
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };
  return (
    <>
      {/* ✅ 반응형 Navbar 추가 */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            MyApp
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user ? (
                <>
                  <Nav.Link as={Link} to="/">
                    홈
                  </Nav.Link>
                  <Nav.Link>환영합니다, {user.mid}님!</Nav.Link>
                  <Nav.Link>
                    {remainingTime !== null
                      ? `로그아웃까지: ${formatTime(remainingTime)}`
                      : ''}
                  </Nav.Link>
                  <Button
                    variant="warning"
                    className="ms-2"
                    onClick={extendSession}
                  >
                    세션 연장 (10분)
                  </Button>
                  <Button
                    variant="danger"
                    className="ms-2"
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/register">
                    회원가입
                  </Nav.Link>
                  <Nav.Link as={Link} to="/login">
                    로그인
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✅ 홈 화면 */}
      <Container className="mt-5 text-center">
        <h2>홈페이지</h2>
        {user ? (
          <>
            <h4>
              환영합니다, {user.mid}님!{' '}
              {remainingTime !== null && (
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  (로그아웃까지: {formatTime(remainingTime)})
                </span>
              )}
            </h4>
            <div>
              <TodoList />
            </div>
          </>
        ) : (
          <p>로그인이 필요합니다.</p>
        )}
      </Container>
    </>
  );
};

export default Home;
