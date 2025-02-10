import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import todoReducer from './todo/todoSlice';
import { watchTodoSaga } from './todo/todoSaga';
import aiReducer from './ai/aiSlice';
import { watchAi } from './ai/aiSaga';

// ✅ Redux-Saga 미들웨어 생성
const sagaMiddleware = createSagaMiddleware();

// ✅ Redux Store 생성
const store = configureStore({
  reducer: {
    // ✅ todo 관련 상태를 `todoSlice.js`에서 관리,
    // todoSlice.js에서 가져온 리듀서를 Redux Store에 연결
    todo: todoReducer,
    //추가
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware), // ✅ 기본 미들웨어 + Saga 추가
});

// ✅ Redux-Saga 실행, takeLatest를 통해 비동기 작업 감지
sagaMiddleware.run(watchTodoSaga);
sagaMiddleware.run(watchAi); // ✅ AI Saga 추가 실행

export default store;
