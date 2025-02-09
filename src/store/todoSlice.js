import { createSlice } from '@reduxjs/toolkit';

// ✅ 초기 상태 정의 (Redux Store에서 관리하는 기본 값)
// 페이징_기반_코드
// const initialState = {
//   todos: [], // 할 일 목록 저장
//   page: 1, // 현재 페이지 번호
//   size: 10, // 한 번에 불러올 개수
//   totalPages: 1, // 전체 페이지 수
//   totalCount: 0, // 전체 할 일 개수
//   loading: false, // 로딩 상태
//   error: null, // 에러 메시지
//   searchParams: {
//     type: '', // 검색 타입 (제목, 내용 등)
//     keyword: '', // 검색 키워드
//     from: '', // 시작 날짜
//     to: '', // 종료 날짜
//     completed: '', // 완료 여부
//   },
// };
// 커서_기반_코드
const initialState = {
  todos: [],
  total: 0,
  cursor: null, // ✅ 커서 상태 추가 (최초 요청시 null)
  hasMore: true, // ✅ 추가 데이터 여부
  loading: false,
  error: null,
  searchParams: {
    type: 'TWC', // 검색 타입 (제목, 내용 등)
    keyword: '', // 검색 키워드
    from: '', // 시작 날짜
    to: '', // 종료 날짜
    completed: '', // 완료 여부
  },
};

// ✅ `createSlice`를 사용하여 Redux 상태 및 액션 정의
const todoSlice = createSlice({
  name: 'todo', // Redux store에서 사용할 slice 이름
  initialState, // 위에서 정의한 초기 상태
  reducers: {
    // 🔹 1️⃣ 할 일 목록 조회 요청 (로딩 상태 true로 변경)
    // 페이징_기반_코드
    // fetchTodosRequest(state) {
    //   state.loading = true;
    //   state.error = null; // ✅ 기존 오류 초기화
    // },

    // 커서_기반_코드
    fetchTodosRequest: (state, action) => {
      if (action.payload?.reset) {
        state.todos = []; // ✅ 초기 로딩 시 기존 데이터 초기화
        state.cursor = null; // ✅ 커서 초기화
        state.hasMore = true;
      }
      state.loading = true;
      state.error = null;
    },

    // 페이징_기반_코드
    // 🔹 2️⃣ 할 일 목록 조회 성공
    // fetchTodosSuccess(state, action) {
    //   state.loading = false; // ✅ 로딩 완료
    //   const newTodos = action.payload.todos || []; // 새로운 데이터 가져오기

    //   state.todos = action.payload.reset
    //     ? newTodos // ✅ `reset`이 true이면 기존 데이터를 초기화
    //     : [...state.todos, ...newTodos].filter(
    //         (v, i, arr) => arr.findIndex((t) => t.tno === v.tno) === i,
    //       ); // ✅ 기존 데이터 유지 & 중복 제거
    //   state.totalPages = Math.ceil(action.payload.total / state.size);
    //   state.totalCount = action.payload.total;
    // },

    // 커서_기반_코드
    fetchTodosSuccess: (state, action) => {
      // state.todos = [...state.todos, ...action.payload.todos]; // ✅ 데이터 추가
      state.todos = action.payload.reset
        ? action.payload.todos
        : [...state.todos, ...action.payload.todos]; // ✅ 기존 데이터에 추가
      state.cursor = action.payload.nextCursor; // ✅ 다음 커서 업데이트
      state.hasMore = action.payload.hasNext; // ✅ 다음 데이터 여부
      state.total = action.payload.total;
      state.loading = false;
    },
    // 🔹 3️⃣ 할 일 목록 조회 실패 (에러 저장)
    fetchTodosFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ 검색 필터 설정
    // 커서_기반_코드
    setSearchParams: (state, action) => {
      state.searchParams = action.payload;
    },

    // 🔹 5️⃣ 검색 필터 설정 (검색어 입력 시 호출)
    // 페이징_기반_코드
    // setSearchParams(state, action) {
    //   state.searchParams = { ...state.searchParams, ...action.payload };
    //   state.page = 1; // ✅ 검색 시 페이지 초기화 (1페이지부터 다시 검색)
    // },

    // 🔹 6️⃣ 할 일 삭제 요청 (로딩 상태 true로 변경)
    deleteTodoRequest(state) {
      state.loading = true;
    },

    // 🔹 7️⃣ 할 일 삭제 성공
    deleteTodoSuccess(state, action) {
      state.todos = state.todos
        .filter((todo) => todo.tno !== action.payload) // ✅ `tno`가 일치하는 항목 삭제
        .sort((a, b) => a.tno - b.tno); // ✅ 기존 정렬 유지
      state.totalCount -= 1; // ✅ 총 개수 감소
    },

    //참고
    // action.payload를 사용하여
    // 외부에서 전달된 데이터(error)를 state.error에 저장.
    // 즉, 액션을 디스패치할 때 전달된 값을 받아서
    // 상태를 업데이트하는 역할.
    // 💡 예제: deleteTodoFailure("삭제 실패!")를 실행하면
    // 내부적으로 자동으로 아래와 같은 액션이 생성됨:
    // {
    //   type: "todo/deleteTodoFailure",
    //   payload: "삭제 실패!"  // 🔹 action.payload에 저장됨
    // }
    // 🔹 8️⃣ 할 일 삭제 실패 (에러 저장)
    deleteTodoFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    //참고
    // addTodoRequest()를 실행하면 자동으로 아래 액션이 생성됨:
    // {
    //   type: "todo/addTodoRequest"
    // }
    // 🔹 9️⃣ 할 일 추가 요청 (로딩 상태 true로 변경)
    addTodoRequest(state) {
      state.loading = true;
      state.error = null; // ✅ 기존 오류 초기화
    },

    // 🔹 🔟 할 일 추가 성공
    addTodoSuccess(state, action) {
      state.loading = false;
      state.todos = [action.payload, ...state.todos]; // ✅ 새 할 일을 목록 맨 앞에 추가
      state.totalCount += 1; // ✅ 총 개수 증가
    },

    // 🔹 11️⃣ 할 일 추가 실패 (에러 저장)
    addTodoFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// ✅ 생성된 액션 내보내기 (컴포넌트에서 사용)
export const {
  fetchTodosRequest,
  fetchTodosSuccess,
  fetchTodosFailure,
  setPage,
  setSearchParams,
  deleteTodoRequest,
  deleteTodoSuccess,
  deleteTodoFailure,
  addTodoRequest,
  addTodoSuccess,
  addTodoFailure,
} = todoSlice.actions;

// ✅ 생성된 리듀서 내보내기 (Redux Store에서 사용)
export default todoSlice.reducer;

// createSlice란?
// Redux Toolkit의 createSlice 는
// Redux 상태(state), 액션(actions), 리듀서(reducer)를 한 곳에서 정의하는 방법입니다.

// 기본 개념
// initialState: 초기 상태 값 정의
// reducers: 상태를 변경하는 리듀서 함수 정의
// actions: 자동 생성되는 액션 함수
// reducer: 생성된 리듀서를 Redux Store에서 사용
