import Header from '../components/Header'; // 공통 Header 사용
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import ToolClassification from './ai/ToolClassification';
import SamsungStockPrediction from './ai/SamsungStockPrediction';
import AnimalImageClassification from './ai/AnimalImageClassification';
import WasteApplianceClassification from './ai/WasteApplianceClassification';
import '../App.css';

const AiTest = () => {
  const { user } = useAuth(); // Context에서 user 정보 가져오기
  const [selectedMenu, setSelectedMenu] = useState(1); // 현재 선택된 메뉴 (기본값: 1번)
  // 선택된 메뉴에 따라 렌더링할 컴포넌트 결정
  const renderContent = () => {
    switch (selectedMenu) {
      case 1:
        return <ToolClassification />;
      case 2:
        return <SamsungStockPrediction />;
      case 3:
        return <AnimalImageClassification />;
      case 4:
        return <WasteApplianceClassification />;
      default:
        return <ToolClassification />;
    }
  };
  return (
    <>
      <Header /> {/* ✅ 공통 헤더 추가 */}
      <Container fluid className="d-flex flex-column flex-md-row gap-0 mt-2">
        {/* <h2>AI 테스트 페이지</h2> */}
        {user ? (
          <>
            <Row className="flex-grow-1">
              {/* ✅ 왼쪽 사이드 메뉴 */}
              <Col
                md={3}
                lg={2}
                className="side-menu bg-light p-3 d-flex flex-column"
                style={{
                  height: 'auto', // 기본 높이
                  maxHeight: '100%', // 화면 크기에 맞춤
                }}
              >
                <h4 className="mb-3">AI 테스트 메뉴</h4>
                <Nav className="flex-column">
                  <Nav.Link
                    onClick={() => setSelectedMenu(1)}
                    active={selectedMenu === 1}
                  >
                    1. 공구 툴 이미지 분류
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setSelectedMenu(2)}
                    active={selectedMenu === 2}
                  >
                    2. 삼성주식 주가 예측
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setSelectedMenu(3)}
                    active={selectedMenu === 3}
                  >
                    3. 동물상 이미지 분류
                  </Nav.Link>
                  <Nav.Link
                    onClick={() => setSelectedMenu(4)}
                    active={selectedMenu === 4}
                  >
                    4. 폐가전 이미지 분류
                  </Nav.Link>
                </Nav>
              </Col>

              {/* ✅ 오른쪽 콘텐츠 화면 (선택된 메뉴에 따라 변경) */}
              <Col md={9} lg={10} className="p-4 flex-grow-1">
                {renderContent()}
              </Col>
            </Row>
          </>
        ) : (
          <p>로그인이 필요합니다.</p>
        )}
      </Container>
    </>
  );
};

export default AiTest;
