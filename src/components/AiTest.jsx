import { Container } from 'react-bootstrap';
import Header from '../components/Header'; // 공통 Header 사용
import { useAuth } from '../contexts/AuthContext';

const AiTest = () => {
  const { user } = useAuth(); // Context에서 user 정보 가져오기

  return (
    <>
      <Header /> {/* ✅ 공통 헤더 추가 */}
      <Container className="mt-5 text-center">
        <h2>AI 테스트 페이지</h2>
        {user ? (
          <>
            <div>
              <p>이곳에서 AI 모델을 테스트할 수 있습니다.</p>
            </div>
          </>
        ) : (
          <p>로그인이 필요합니다.</p>
        )}
      </Container>
    </>
  );
};

export default AiTest;
