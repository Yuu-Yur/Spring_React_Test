import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { user, logout, extendSession, remainingTime } = useAuth();
  const navigate = useNavigate();

  // 남은 시간을 MM:SS 형식으로 변환하는 함수
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
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
                <Nav.Link as={Link} to="/ai">
                  Ai Test
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
  );
};

export default Header;
