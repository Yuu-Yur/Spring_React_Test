import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mid: '',
    mpw: '',
    confirmPassword: '',
    email: '',
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  // 패스워드 일치 여부 체크
  const [isChecking, setIsChecking] = useState(false); // ✅ 중복 확인 요청 상태
  const [idCheckResult, setIdCheckResult] = useState(null); // ✅ 중복 체크 결과 메시지

  useEffect(() => {
    setPasswordMatch(formData.mpw === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === 'mid') {
      setIdCheckResult(null); // ✅ 아이디 입력 시 중복 검사 결과 초기화
    }
  };

  // 중복 아이디 체크
  const handleCheckId = async () => {
    if (!formData.mid.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }

    setIsChecking(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/member/check-mid`,
        {
          params: { mid: formData.mid },
        },
      );

      if (response.status === 200 && response.data === false) {
        setIdCheckResult({
          available: true,
          message: '사용 가능한 아이디입니다.',
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setIdCheckResult({ available: false, message: '중복된 아이디입니다.' });
      } else {
        console.error('아이디 확인 중 오류 발생:', error);
        setIdCheckResult({ available: false, message: '오류가 발생했습니다.' });
      }
    } finally {
      setIsChecking(false);
    }
  };

  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!idCheckResult || !idCheckResult.available) {
      alert('아이디 중복 체크를 해주세요.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/member/register',
        formData,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );
      alert('회원가입 성공!');
      navigate('/login'); // 로그인 페이지로 이동
    } catch (error) {
      alert('회원가입 실패');
      console.error(error);
    }
  };
  return (
    <Container className="mt-5">
      <h2 className="text-center">회원가입</h2>
      <Form onSubmit={handleSubmit} className="w-50 mx-auto">
        <Form.Group className="mb-3">
          <Form.Label>아이디</Form.Label>
          <Row>
            <Col>
              <Form.Control
                type="text"
                name="mid"
                value={formData.mid}
                onChange={handleChange}
                required
                placeholder="아이디 입력"
                isInvalid={idCheckResult && !idCheckResult.available}
                isValid={idCheckResult && idCheckResult.available}
              />
              <Form.Control.Feedback
                type={idCheckResult?.available ? 'valid' : 'invalid'}
              >
                {idCheckResult?.message}
              </Form.Control.Feedback>
            </Col>
            <Col xs="auto">
              <Button
                variant="secondary"
                onClick={handleCheckId}
                disabled={isChecking}
              >
                {isChecking ? '확인 중...' : '중복 체크'}
              </Button>
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            name="mpw"
            value={formData.mpw}
            onChange={handleChange}
            required
            placeholder="비밀번호 입력"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            placeholder="비밀번호 확인"
            isValid={passwordMatch && formData.confirmPassword.length > 0}
            isInvalid={!passwordMatch && formData.confirmPassword.length > 0}
          />
          <Form.Control.Feedback type="invalid">
            비밀번호가 일치하지 않습니다.
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>이메일</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="이메일 입력"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          가입하기
        </Button>
      </Form>
    </Container>
  );
};
export default Register;
