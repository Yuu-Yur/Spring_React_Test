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
    todo: todoReducer,
    ai: aiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ 특정 액션을 직렬화 검사에서 제외 (FormData 사용되는 액션)
        ignoredActions: ['ai/uploadImageRequest'],
        // ✅ 모든 액션에서 특정 필드를 검사하지 않음
        ignoredActionPaths: ['meta.formData'],
        // ✅ Redux 상태에서 특정 필드 무시 (필요 시 적용)
        ignoredPaths: ['ai.upload.formData'],
      },
    }).concat(sagaMiddleware), // ✅ 기본 미들웨어 + Saga 추가
});

// ✅ Redux-Saga 실행, takeLatest를 통해 비동기 작업 감지
sagaMiddleware.run(watchTodoSaga);
sagaMiddleware.run(watchAi); // ✅ AI Saga 추가 실행

export default store;
