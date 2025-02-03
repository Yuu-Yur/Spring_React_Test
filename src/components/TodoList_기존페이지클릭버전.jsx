// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   Table,
//   Button,
//   Form,
//   Container,
//   Row,
//   Col,
//   Pagination,
// } from 'react-bootstrap';
// import axiosInstance from './axiosInstance';
// import TodoForm from './TodoForm';
// import { useNavigate } from 'react-router-dom';

// const TodoList = () => {
//   // 🔹 상태 관리
//   const [todos, setTodos] = useState([]);
//   const [page, setPage] = useState(1);
//   const [size, setSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchParams, setSearchParams] = useState({
//     type: '',
//     keyword: '',
//     from: '',
//     to: '',
//     completed: '',
//   });
//   const [loading, setLoading] = useState(false); // ✅ 로딩 상태 추가
//   const [error, setError] = useState(null); // ✅ 에러 상태 추가

//   const navigate = useNavigate();

//   // 🔹 데이터 가져오기
//   const fetchData = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       // 방법1
//       //   const token = localStorage.getItem('accessToken'); // ✅ 로컬 스토리지에서 액세스 토큰 가져오기

//       //   const response = await axios.get(`http://localhost:8080/api/todo/list`, {
//       //     params: {
//       //       page,
//       //       size,
//       //       type: searchParams.type,
//       //       keyword: searchParams.keyword,
//       //       from: searchParams.from,
//       //       to: searchParams.to,
//       //       completed: searchParams.completed,
//       //     },
//       //     headers: {
//       //       Authorization: `Bearer ${token}`, // ✅ 액세스 토큰을 Authorization 헤더에 포함
//       //     },
//       //   });

//       //방법2
//       const response = await axiosInstance.get(`/todo/list`, {
//         params: {
//           page,
//           size,
//           type: searchParams.type,
//           keyword: searchParams.keyword,
//           from: searchParams.from,
//           to: searchParams.to,
//           completed: searchParams.completed,
//         },
//       });

//       setTodos(response.data?.dtoList ?? []); // ✅ API 응답이 null이면 빈 배열로 설정
//       setTotalPages(Math.ceil(response.data?.total / size));
//     } catch (error) {
//       setError('데이터를 불러오는 중 오류가 발생했습니다.');
//       setTodos([]); // ✅ 오류 발생 시 빈 배열로 설정
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 최초 실행 및 검색어 변경 시 데이터 로드
//   useEffect(() => {
//     fetchData();
//   }, [page, searchParams]);

//   // 🔹 할 일 추가 후 목록 갱신
//   const handleTodoAdded = () => {
//     fetchData();
//   };

//   // 🔹 삭제 기능
//   const handleDelete = async (tno) => {
//     if (window.confirm('정말 삭제하시겠습니까?')) {
//       try {
//         await axiosInstance.delete(`/todo/${tno}`);
//         alert('삭제되었습니다.');
//         fetchData();
//       } catch (error) {
//         alert('삭제 중 오류가 발생했습니다.');
//       }
//     }
//   };

//   useEffect(() => {
//     if (!todos) {
//       setTodos([]);
//     }
//   }, [todos]);

//   // 🔹 검색 입력값 변경
//   const handleChange = (e) => {
//     setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
//   };

//   // 🔹 검색 버튼 클릭
//   const handleSearch = () => {
//     setPage(1);
//     fetchData();
//   };

//   // 🔹 페이징 버튼 클릭
//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   return (
//     <Container className="mt-4">
//       <h2 className="text-center">할 일 목록 (Paging & Search)</h2>

//       {/* 🔹 검색 필터 */}
//       <Form className="mb-4">
//         <Row>
//           <Col md={3}>
//             <Form.Select
//               name="type"
//               value={searchParams.type}
//               onChange={handleChange}
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
//               onChange={handleChange}
//             />
//           </Col>
//           <Col md={2}>
//             <Form.Control
//               type="date"
//               name="from"
//               value={searchParams.from}
//               onChange={handleChange}
//             />
//           </Col>
//           <Col md={2}>
//             <Form.Control
//               type="date"
//               name="to"
//               value={searchParams.to}
//               onChange={handleChange}
//             />
//           </Col>
//           <Col md={2}>
//             <Button variant="primary" onClick={handleSearch}>
//               검색
//             </Button>
//           </Col>
//         </Row>
//       </Form>

//       {/* 할 일 추가 폼 */}
//       <TodoForm onTodoAdded={handleTodoAdded} />

//       {/* 🔹 로딩 상태 표시 */}
//       {loading && <p className="text-center">데이터를 불러오는 중...</p>}

//       {/* 🔹 오류 메시지 표시 */}
//       {error && <p className="text-center text-danger">{error}</p>}

//       {/* 🔹 할 일 목록 */}
//       {!loading && !error && (
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>#</th>
//               <th>제목</th>
//               <th>작성자</th>
//               <th>마감일</th>
//               <th>완료 여부</th>
//               <th>액션</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(todos) && todos.length > 0 ? (
//               todos.map((todo, index) => {
//                 const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
//                 const today = new Date();
//                 const isOverdue = dueDate && dueDate < today;

//                 return (
//                   <tr key={index}>
//                     <td>{index + 1 + (page - 1) * size}</td>
//                     <td>{todo.title}</td>
//                     <td>{todo.writer}</td>
//                     <td>
//                       {dueDate ? (
//                         <span
//                           style={{
//                             color: isOverdue ? 'red' : 'black',
//                             fontWeight: isOverdue ? 'bold' : 'normal',
//                           }}
//                         >
//                           {dueDate.toLocaleDateString()}
//                         </span>
//                       ) : (
//                         '-'
//                       )}
//                     </td>
//                     <td>{todo.complete ? '완료' : '미완료'}</td>
//                     <td>
//                       <Button
//                         variant="warning"
//                         size="sm"
//                         onClick={() => navigate(`/todo/edit/${todo.tno}`)}
//                       >
//                         수정
//                       </Button>{' '}
//                       <Button
//                         variant="danger"
//                         size="sm"
//                         onClick={() => handleDelete(todo.tno)}
//                       >
//                         삭제
//                       </Button>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan="5" className="text-center text-muted">
//                   검색 결과가 없습니다.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </Table>
//       )}
//     </Container>
//   );
// };

// export default TodoList;
