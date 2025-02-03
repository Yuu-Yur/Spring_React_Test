import React, { useState } from 'react';
import axiosInstance from './axiosInstance';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const TodoForm = ({ onTodoAdded }) => {
  // 🔹 상태 관리
  const [todo, setTodo] = useState({
    title: '',
    writer: '',
    dueDate: '',
    complete: false,
  });
  const [error, setError] = useState(null);

  // 🔹 입력값 변경 처리
  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  // 🔹 체크박스 변경 처리
  const handleCheckboxChange = (e) => {
    setTodo({ ...todo, complete: e.target.checked });
  };

  // 🔹 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axiosInstance.post('/todo/', todo);
      console.log('등록된 할 일 ID:', response.data.tno);

      // 성공 시 목록 업데이트 요청
      onTodoAdded();

      // 입력 필드 초기화
      setTodo({
        title: '',
        writer: '',
        dueDate: '',
        complete: false,
      });

      alert('할 일이 성공적으로 추가되었습니다.');
    } catch (error) {
      setError('할 일 추가 중 오류가 발생했습니다.');
      console.error('Error adding todo:', error);
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">새로운 할 일 추가</h2>
      {error && <p className="text-center text-danger">{error}</p>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={4}>
            <Form.Control
              type="text"
              name="title"
              value={todo.title}
              onChange={handleChange}
              placeholder="제목 입력"
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              name="writer"
              value={todo.writer}
              onChange={handleChange}
              placeholder="작성자 입력"
              required
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              name="dueDate"
              value={todo.dueDate}
              onChange={handleChange}
              required
            />
          </Col>
          <Col md={1} className="d-flex align-items-center">
            <Form.Check
              type="checkbox"
              label="완료"
              name="complete"
              checked={todo.complete}
              onChange={handleCheckboxChange}
            />
          </Col>
          <Col md={1}>
            <Button variant="primary" type="submit">
              추가
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default TodoForm;
