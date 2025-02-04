// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import {
//   Table,
//   Button,
//   Container,
//   Spinner,
//   Form,
//   Row,
//   Col,
// } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';

// import axiosInstance from './axiosInstance';

// import TodoForm from './TodoForm';
// import ScrollToTopButton from './ScrollToTopButton';

// const TodoList = () => {
//   const [todos, setTodos] = useState([]); // 기존 데이터 유지
//   const [page, setPage] = useState(1);
//   const [size] = useState(10); // 한번에 불러올 항목 수
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalCount, setTotalCount] = useState(0); // ✅ 검색된 전체 개수
//   const [loading, setLoading] = useState(false);
//   const [isFetching, setIsFetching] = useState(false); // 추가 요청 방지
//   const [error, setError] = useState(null);
//   const [searchParams, setSearchParams] = useState({
//     type: '',
//     keyword: '',
//     from: '',
//     to: '',
//     completed: '',
//   });

//   const navigate = useNavigate();
//   const observerRef = useRef(null);
//   const scrollRef = useRef(null); // 스크롤 위치 유지용

//   // 🔹 데이터 가져오기
//   const fetchData = useCallback(
//     async (reset = false) => {
//       if (isFetching || page > totalPages) return; // 중복 요청 방지, 마지막 페이지 체크

//       setLoading(true);
//       setIsFetching(true);
//       try {
//         const response = await axiosInstance.get('/todo/list', {
//           params: {
//             page,
//             size,
//             type: searchParams.type,
//             keyword: searchParams.keyword,
//             from: searchParams.from,
//             to: searchParams.to,
//             completed: searchParams.completed,
//           },
//         });

//         setTodos((prevTodos) => {
//           const newData = response.data?.dtoList ?? [];
//           return reset ? newData : [...prevTodos, ...newData]; // ✅ 검색 시 기존 데이터 초기화
//         });

//         setTotalPages(Math.ceil(response.data?.total / size));
//         setTotalCount(response.data?.total || 0); // ✅ 검색된 전체 개수 저장
//       } catch (error) {
//         setError('데이터를 불러오는 중 오류가 발생했습니다.');
//       } finally {
//         setLoading(false);
//         setIsFetching(false);
//       }
//     },
//     [page, size, isFetching, totalPages, searchParams],
//   );

//   // 🔹 최초 실행 및 페이지 변경 시 데이터 로드
//   useEffect(() => {
//     fetchData();
//   }, [page]);

//   const handleTodoAdded = () => {
//     window.location.reload(); // ✅ 전체 페이지 새로고침
//   };

//   // 🔹 검색 버튼 클릭 (기존 데이터 유지하며 검색 결과만 변경)
//   const handleSearch = () => {
//     setPage(1);
//     setTodos([]); // ✅ 기존 데이터를 초기화하여 검색 결과만 표시
//     fetchData(true); // ✅ 새로운 검색 결과 가져오기
//   };

//   // 🔹 검색 입력값 변경 시 자동으로 페이지 초기화
//   useEffect(() => {
//     setPage(1);
//   }, [searchParams]);

//   // 🔹 삭제 기능 (데이터 유지)
//   const handleDelete = async (tno) => {
//     if (window.confirm('정말 삭제하시겠습니까?')) {
//       try {
//         await axiosInstance.delete(`/todo/${tno}`);
//         alert('삭제되었습니다.');
//         setTodos((prevTodos) => prevTodos.filter((todo) => todo.tno !== tno)); // ✅ 기존 데이터 유지하며 삭제
//         setTotalCount((prevCount) => prevCount - 1); // ✅ 검색된 총 개수 감소
//       } catch (error) {
//         alert('삭제 중 오류가 발생했습니다.');
//       }
//     }
//   };

//   // 🔹 무한 스크롤 이벤트 핸들러 (IntersectionObserver 활용)
//   useEffect(() => {
//     if (isFetching || page >= totalPages) return; // ✅ 데이터 요청 중이거나 마지막 페이지이면 실행하지 않음

//     // IntersectionObserver 객체를 생성하여
//     // 특정 요소(observerRef.current)가 화면에 보일 때
//     // 실행되는 함수를 정의
//     const observer = new IntersectionObserver((entries) => {
//       // entries[0].isIntersecting을 통해 요소가 뷰포트 안에 들어왔는지 확인
//       if (entries[0].isIntersecting) {
//         setPage((prevPage) => prevPage + 1); // ✅ 페이지 증가하여 데이터 로드 트리거
//       }
//     });

//     if (observerRef.current) {
//       observer.observe(observerRef.current); // ✅ 관찰할 요소 지정
//       // 아래의 이요소를 보고 판단.
//       //   <div ref={observerRef} style={{ height: '20px' }} />
//     }

//     return () => observer.disconnect(); // ✅ 컴포넌트 언마운트 시 옵저버 해제
//   }, [isFetching, page, totalPages]);

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center">
//         할 일 목록 (Infinite Scroll & Search Sync)
//       </h2>

//       {/* 🔹 검색 필터 */}
//       <Form className="mb-4">
//         <Row>
//           <Col md={3}>
//             <Form.Select
//               name="type"
//               value={searchParams.type}
//               onChange={(e) =>
//                 setSearchParams({ ...searchParams, type: e.target.value })
//               }
//             >
//               <option value="">검색 유형</option>
//               <option value="T">제목</option>
//               <option value="C">내용</option>
//               <option value="W">작성자</option>
//               <option value="TC">제목+내용</option>
//               <option value="TWC">제목+내용+작성자</option>
//             </Form.Select>
//           </Col>
//           <Col md={3}>
//             <Form.Control
//               type="text"
//               placeholder="검색어 입력"
//               name="keyword"
//               value={searchParams.keyword}
//               onChange={(e) =>
//                 setSearchParams({ ...searchParams, keyword: e.target.value })
//               }
//             />
//           </Col>
//           <Col md={2}>
//             <Form.Control
//               type="date"
//               name="from"
//               value={searchParams.from}
//               onChange={(e) =>
//                 setSearchParams({ ...searchParams, from: e.target.value })
//               }
//             />
//           </Col>
//           <Col md={2}>
//             <Form.Control
//               type="date"
//               name="to"
//               value={searchParams.to}
//               onChange={(e) =>
//                 setSearchParams({ ...searchParams, to: e.target.value })
//               }
//             />
//           </Col>
//           <Col md={2}>
//             <Button variant="primary" onClick={handleSearch}>
//               검색
//             </Button>
//           </Col>
//         </Row>
//       </Form>

//       {/* 검색 결과 개수 출력 */}
//       <p className="text-center text-muted">총 {totalCount}개의 검색 결과</p>

//       {/* 할 일 추가 폼 */}
//       <TodoForm onTodoAdded={handleTodoAdded} />

//       {error && <p className="text-center text-danger">{error}</p>}

//       {/* 🔹 할 일 목록 */}
//       <Table striped bordered hover>
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>제목</th>
//             <th>작성자</th>
//             <th>마감일</th>
//             <th>완료 여부</th>
//             <th>액션</th>
//           </tr>
//         </thead>
//         <tbody>
//           {todos.length > 0 ? (
//             todos.map((todo, index) => (
//               <tr key={todo.tno}>
//                 <td>{index + 1}</td>
//                 <td>{todo.title}</td>
//                 <td>{todo.writer}</td>
//                 <td>
//                   {todo.dueDate
//                     ? new Date(todo.dueDate).toLocaleDateString()
//                     : '-'}
//                 </td>
//                 <td
//                   style={{
//                     color: todo.complete ? 'red' : 'black',
//                     fontWeight: todo.complete ? 'bold' : 'normal',
//                   }}
//                 >
//                   {todo.complete ? '완료' : '미완료'}
//                 </td>

//                 <td>
//                   <Button
//                     variant="warning"
//                     size="sm"
//                     onClick={() => navigate(`/todo/edit/${todo.tno}`)}
//                   >
//                     수정
//                   </Button>{' '}
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => handleDelete(todo.tno)}
//                   >
//                     삭제
//                   </Button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="6" className="text-center text-muted">
//                 검색 결과가 없습니다.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </Table>

//       {/* 🔹 로딩 표시 */}
//       {loading && (
//         <div className="text-center my-3">
//           <Spinner animation="border" variant="primary" />
//           <p>불러오는 중...</p>
//         </div>
//       )}

//       {/* 🔹 무한 스크롤을 위한 감지 요소 */}
//       <div ref={observerRef} style={{ height: '20px' }} />

//       {/* ✅ 맨 위로 가기 버튼 */}
//       <ScrollToTopButton />
//     </Container>
//   );
// };

// export default TodoList;
