import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
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
  useEffect(() => {
    setPasswordMatch(formData.mpw === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);
  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // 회원가입 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      alert('비밀번호가 일치하지 않습니다.');
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
          <Form.Control
            type="text"
            name="mid"
            value={formData.mid}
            onChange={handleChange}
            required
            placeholder="아이디 입력"
          />
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
