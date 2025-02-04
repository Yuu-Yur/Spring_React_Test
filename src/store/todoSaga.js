import { call, put, takeLatest, select } from 'redux-saga/effects';
import axiosInstance from '../util/axiosInstance';
import {
  fetchTodosRequest,
  fetchTodosSuccess,
  fetchTodosFailure,
  deleteTodoRequest,
  deleteTodoSuccess,
  deleteTodoFailure,
  addTodoRequest,
  addTodoSuccess,
  addTodoFailure,
  setPage,
} from './todoSlice';

// 🔹 1️⃣ 할 일 목록 조회 (API 요청)
function* fetchTodosSaga(action) {
  try {
    // ✅ 현재 Redux 상태 가져오기
    const { page, size, searchParams } = yield select((state) => state.todo);

    // ✅ API 요청 (GET 요청으로 할 일 목록 조회)
    const response = yield call(axiosInstance.get, '/todo/list', {
      params: {
        page,
        size,
        type: searchParams.type,
        keyword: searchParams.keyword,
        from: searchParams.from,
        to: searchParams.to,
        completed: searchParams.completed,
      },
    });

    // ✅ Redux 상태 업데이트 (성공)
    yield put(
      fetchTodosSuccess({
        todos: response.data?.dtoList || [],
        total: response.data?.total || 0,
        reset: action.payload?.reset,
      }),
    );

    //참고1,
    // fetchTodosSuccess({}) 호출시 -> fetchTodosSuccess(state, action) {
    // 아래의 형태로 action은 자동생성 , 변경되고
    // {
    //   type: "todo/fetchTodosSuccess",
    //   payload: {
    //     todos: response.data?.dtoList || [],
    //     total: response.data?.total || 0,
    //     reset: action.payload?.reset,
    //   }
    // }
    //참고2,
    // state 는 그대로 전달.
    // {
    //   todos: response.data?.dtoList || [],
    //   total: response.data?.total || 0,
    //   reset: action.payload?.reset,
    // }
  } catch (error) {
    // ✅ Redux 상태 업데이트 (실패)
    yield put(fetchTodosFailure('데이터를 불러오는 중 오류가 발생했습니다.'));
  }
}

// 🔹 2️⃣ 할 일 삭제 (API 요청)
function* deleteTodoSaga(action) {
  try {
    // ✅ API 요청으로 삭제
    yield call(axiosInstance.delete, `/todo/${action.payload}`);
    // ✅ Redux 상태에서 삭제
    yield put(deleteTodoSuccess(action.payload));
    // ✅ 무한 스크롤이 초기화되도록 `setPage(1)` 적용
    yield put(setPage(1));
    // ✅ 최신 데이터 다시 불러오기
    yield put(fetchTodosRequest({ reset: true })); // 삭제 후 목록 갱신
  } catch (error) {
    yield put(deleteTodoFailure('삭제 중 오류가 발생했습니다.'));
  }
}
// 🔹 3️⃣ 할 일 추가 (API 요청)
// 참고,
// action 객체 구조 형태
// {
//   type: "todo/addTodoRequest",
//   payload: {
//     title: "새로운 할 일",
//     completed: false
//   }
// }
function* addTodoSaga(action) {
  try {
    const response = yield call(axiosInstance.post, '/todo/', action.payload);
    yield put(addTodoSuccess(response.data)); // ✅ Redux 상태에 추가
    yield put(fetchTodosRequest({ reset: true })); // ✅ 최신 데이터 다시 불러오기
  } catch (error) {
    yield put(addTodoFailure('할 일 추가 중 오류가 발생했습니다.'));
  }
}
// 🔹 4️⃣ 모든 Saga 감시
export function* watchTodoSaga() {
  yield takeLatest('todo/fetchTodosRequest', fetchTodosSaga);
  yield takeLatest('todo/deleteTodoRequest', deleteTodoSaga);
  yield takeLatest('todo/addTodoRequest', addTodoSaga);
}
// ✔ call(axiosInstance.get, ...) → API 요청 실행
// ✔ put(fetchTodosSuccess(...)) → Redux 상태 업데이트
// ✔ takeLatest('todo/fetchTodosRequest', fetchTodosSaga) → 가장 마지막 요청만 처리
// ✔ select((state) => state.todo) → 현재 Redux 상태를 가져와서 사용

// 제네레이터 함수 (function*) 는 일반 함수와 달리
// 실행을 중간에 멈추고(yield), 다시 재개할 수 있는 함수입니다.

// ✅ 제네레이터 함수의 주요 특징
// 1️⃣ function* 문법 사용
// 2️⃣ yield 키워드로 실행을 일시 중지 & 특정 값을 반환
// 3️⃣ next() 메서드를 호출하여 함수 실행을 재개할 수 있음
// 4️⃣ return을 만나면 실행 종료
