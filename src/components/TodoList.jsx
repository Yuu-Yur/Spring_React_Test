import { useEffect, useRef } from 'react';
import {
  Table,
  Button,
  Container,
  Spinner,
  Form,
  Row,
  Col,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchTodosRequest,
  setPage,
  setSearchParams,
  deleteTodoRequest,
} from '../store/todoSlice';
import TodoForm from './TodoForm';
import ScrollToTopButton from './ScrollToTopButton';
import '../App.css';

const TodoList = () => {
  // Redux 액션을 실행하여 상태를 변경함 (dispatch(action))
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const observerRef = useRef(null);

  // Redux 상태를 읽음 (store에서 state를 가져오는 역할)
  const { todos, page, totalPages, totalCount, loading, searchParams } =
    useSelector((state) => state.todo);

  // ✅ 최초 실행 및 검색 후 데이터 리셋 (전체 목록 로드)
  useEffect(() => {
    dispatch(setPage(1)); // 페이지를 1로 설정하여 첫 번째 데이터를 불러옴

    setTimeout(() => {
      dispatch(fetchTodosRequest({ reset: true }));
    }, 50); // ✅ 약간의 지연을 추가하여 `page` 업데이트 후 API 요청
  }, [dispatch]);

  // 🔹 검색 버튼 클릭 시 데이터 로드
  const handleSearch = () => {
    dispatch(setPage(1));
    dispatch(fetchTodosRequest({ reset: true }));
  };

  // 🔹 삭제 기능 (Redux에서 처리)
  const handleDelete = (tno) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      dispatch(deleteTodoRequest(tno));

      setTimeout(() => {
        dispatch(setPage(1)); // ✅ 삭제 후 페이지를 초기화하여 스크롤 영향 방지
        dispatch(fetchTodosRequest({ reset: true })); // ✅ 최신 목록 다시 불러오기
      }, 100);
    }
  };
  // 🔹 무한 스크롤 (IntersectionObserver 활용)
  // useEffect(() => {
  //   if (page >= totalPages) return; // 마지막 페이지면 더 이상 요청 안함

  //   const observer = new IntersectionObserver((entries) => {
  //     if (entries[0].isIntersecting) {
  //       dispatch(setPage(page + 1)); // 페이지 증가하여 다음 데이터 불러오기
  //       dispatch(fetchTodosRequest({ reset: false })); // 새 데이터 추가
  //     }
  //   });

  //   if (observerRef.current) {
  //     observer.observe(observerRef.current);

  //     return () => observer.disconnect(); // ✅ 옵저버가 실행된 경우만 disconnect 실행
  //   }
  // }, [page, totalPages, dispatch]);
  //
  useEffect(() => {
    if (page >= totalPages) return; // 마지막 페이지면 요청 중단

    let timeoutId = null; // 타이머 ID 저장

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log('📌 스크롤 감지됨! 1초 후 데이터 요청 예정...');

        // ✅ 1초(1000ms) 후에 데이터 요청
        timeoutId = setTimeout(() => {
          dispatch(setPage(page + 1)); // 페이지 증가
          dispatch(fetchTodosRequest({ reset: false })); // 새 데이터 추가 요청
          console.log('✅ 1초 후 새로운 데이터 요청 완료');
        }, 1000);
      }
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId); // ✅ 불필요한 중복 요청 방지
      observer.disconnect();
    };
  }, [page, totalPages, dispatch]);

  return (
    <Container className="mt-4">
      <h2 className="text-center">할 일 목록 (Redux + Saga)</h2>

      {/* 🔹 검색 필터 */}
      <Form className="mb-4">
        <Row>
          <Col md={3}>
            <Form.Select
              value={searchParams.type}
              onChange={(e) =>
                dispatch(
                  setSearchParams({ ...searchParams, type: e.target.value }),
                )
              }
            >
              <option value="">검색 유형</option>
              <option value="T">제목</option>
              <option value="C">내용</option>
              <option value="W">작성자</option>
              <option value="TC">제목+내용</option>
              <option value="TWC">제목+내용+작성자</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control
              type="text"
              placeholder="검색어 입력"
              value={searchParams.keyword}
              onChange={(e) =>
                dispatch(
                  setSearchParams({ ...searchParams, keyword: e.target.value }),
                )
              }
            />
          </Col>
          <Col md={2}>
            <Button variant="primary" onClick={handleSearch}>
              검색
            </Button>
          </Col>
        </Row>
      </Form>

      <p className="text-center text-muted">총 {totalCount}개의 검색 결과</p>

      <TodoForm />

      {loading && <Spinner animation="border" variant="primary" />}

      <Table
        striped
        bordered
        hover
        responsive
        style={{ tableLayout: 'fixed', width: '100%' }}
      >
        <thead>
          <tr>
            <th>#</th>
            <th>제목</th>
            <th>작성자</th>
            <th>마감일</th>
            <th>완료 여부</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {todos.length > 0 ? (
            todos.map((todo, index) => (
              <tr key={todo.tno}>
                <td>{index + 1}</td>
                <td className="long-text">{todo.title}</td>
                <td className="long-text">{todo.writer}</td>
                <td>
                  {todo.dueDate
                    ? new Date(todo.dueDate).toLocaleDateString()
                    : '-'}
                </td>
                <td
                  style={{
                    color: todo.complete ? 'red' : 'black',
                    fontWeight: todo.complete ? 'bold' : 'normal',
                  }}
                >
                  {todo.complete ? '완료' : '미완료'}
                </td>
                <td>
                  <Button
                    variant="warning"
                    onClick={() => navigate(`/todo/edit/${todo.tno}`)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(todo.tno)}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                검색 결과가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <div ref={observerRef} style={{ height: '20px' }} />
      <ScrollToTopButton />
    </Container>
  );
};

export default TodoList;
