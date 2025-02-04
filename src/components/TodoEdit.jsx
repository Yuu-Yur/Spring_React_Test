import React, { useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../util/axiosInstance';

const TodoEdit = () => {
  const { tno } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState({
    title: '',
    writer: '',
    dueDate: '',
    complete: false,
  });

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await axiosInstance.get(`/todo/${tno}`);
        setTodo(response.data);
      } catch (error) {
        alert('데이터를 불러오는 중 오류가 발생했습니다.');
      }
    };
    fetchTodo();
  }, [tno]);

  const handleChange = (e) => {
    setTodo({ ...todo, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setTodo({ ...todo, complete: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/todo/${tno}`, todo);
      alert('수정이 완료되었습니다.');
      navigate('/');
    } catch (error) {
      alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">할 일 수정</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>제목</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={todo.title}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>작성자</Form.Label>
          <Form.Control
            type="text"
            name="writer"
            value={todo.writer}
            onChange={handleChange}
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>마감일</Form.Label>
          <Form.Control
            type="date"
            name="dueDate"
            value={todo.dueDate}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="완료 여부"
            name="complete"
            checked={todo.complete}
            onChange={handleCheckboxChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          수정하기
        </Button>{' '}
        <Button variant="secondary" onClick={() => navigate('/')}>
          취소
        </Button>
      </Form>
    </Container>
  );
};

export default TodoEdit;
