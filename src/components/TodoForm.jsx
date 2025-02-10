import { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { addTodoRequest } from '../store/todo/todoSlice';
import { useAuth } from '../contexts/AuthContext'; // ✅ 로그인 정보 가져오기
import { fetchTodosRequest } from '../store/todo/todoSlice';

// const TodoForm = ({ onTodoAdded }) => {
const TodoForm = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.todo);
  const { user } = useAuth(); // ✅ 로그인한 유저 정보 가져오기

  // ✅ 오늘 날짜 구하기 (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];

  // 🔹 상태 관리
  const [todo, setTodo] = useState({
    title: '',
    writer: user?.mid || '', // ✅ 로그인한 사용자 ID 자동 입력
    dueDate: today, // ✅ 기본값을 오늘 날짜로 설정
    complete: false,
  });

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
    //참고,
    // addTodoRequest(todo)는 createSlice에 의해 자동 생성된 액션을 반환합니다.
    // {
    //   type: "todo/addTodoRequest",
    //   payload: todo  // 🔹 전달된 `todo` 객체가 payload에 저장됨
    // }

    dispatch(addTodoRequest(todo));

    // ✅ 새로고침 없이 Redux 상태에 직접 추가하여 즉시 반영
    setTimeout(() => {
      // dispatch(setPage(1)); // ✅ 삭제 후 페이지를 초기화하여 스크롤 영향 방지
      dispatch(fetchTodosRequest({ reset: true })); // ✅ 최신 데이터 불러오기 (기존 데이터 유지)
    }, 100);

    // 입력 필드 초기화
    setTodo({
      title: '',
      writer: user?.mid || '',
      dueDate: today,
      complete: false,
    });
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center">새로운 할 일 추가 (Redux + Saga)</h2>
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
              disabled
            />
          </Col>
          <Col md={3}>
            <Form.Control
              type="date"
              name="dueDate"
              value={todo.dueDate}
              onChange={handleChange}
              min={today} // ✅ 이전 날짜 선택 불가능
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
