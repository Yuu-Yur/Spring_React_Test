import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
//추가, 로그인 정보 표기
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();

  //추가, 로그인 정보 표기
  const { login } = useAuth(); // Context의 로그인 함수 사용

  const [credentials, setCredentials] = useState({
    mid: '',
    mpw: '',
  });
  // 입력 값 변경 핸들러
  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };
  // 로그인 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8080/generateToken',
        credentials,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      );

      //추가, 로그인 정보 표기
      login({ mid: credentials.mid }); // Context에 로그인 정보 저장

      localStorage.setItem('accessToken', response.data.accessToken); // 토큰 저장
      localStorage.setItem('refreshToken', response.data.refreshToken); // 토큰 저장
      alert('로그인 성공!');
      navigate('/'); // 로그인 후 대시보드로 이동
    } catch (error) {
      alert('로그인 실패');
      console.error(error);
    }
  };
  return (
    <Container className="mt-5">
      <h2 className="text-center">로그인</h2>
      <Form onSubmit={handleSubmit} className="w-50 mx-auto">
        <Form.Group className="mb-3">
          <Form.Label>아이디</Form.Label>
          <Form.Control
            type="text"
            name="mid"
            value={credentials.mid}
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
            value={credentials.mpw}
            onChange={handleChange}
            required
            placeholder="비밀번호 입력"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          로그인
        </Button>
      </Form>
    </Container>
  );
};
export default Login;
