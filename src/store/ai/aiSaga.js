import { call, put, takeLatest } from 'redux-saga/effects';
import {
  uploadImageRequest,
  uploadImageSuccess,
  uploadImageFailure,
  fetchStockDataRequest,
  fetchStockDataSuccess,
  fetchStockDataFailure,
  predictRequest,
  predictSuccess,
  predictFailure,
} from './aiSlice';
import axiosInstance from '../../util/axiosInstance';

// API 요청 함수
function uploadImageAPI(formData, type = 1) {
  let endpoint = `/ai/predict/${type || 1}`;
  return axiosInstance.post(endpoint, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// Saga 생성
function* uploadImageSaga(action) {
  try {
    const { formData, type } = action.payload; // type 값 추가
    const response = yield call(uploadImageAPI, formData, type);
    yield put(uploadImageSuccess(response.data));
  } catch (error) {
    yield put(
      uploadImageFailure(error.response?.data?.error || '파일 업로드 실패'),
    );
  }
}

// ✅ 주가 데이터 가져오기 요청
function* fetchStockDataSaga(action) {
  try {
    const response = yield call(
      axiosInstance.get,
      `/ai2/stock-data?period=${action.payload}`, // ✅ Base URL 적용됨
    );
    yield put(fetchStockDataSuccess(response.data || []));
  } catch (error) {
    yield put(fetchStockDataFailure(error.message));
  }
}

// ✅ AI 예측 요청
function* predictSaga(action) {
  const { model, data, period } = action.payload;
  const apiUrl = `/ai/predict/${model.toLowerCase()}`; // ✅ Base URL 적용됨

  try {
    const response = yield call(axiosInstance.post, apiUrl, { data, period });
    yield put(
      predictSuccess({ model, prediction: response.data.prediction || '' }),
    );
  } catch (error) {
    yield put(predictFailure(error.message));
  }
}

// Watcher Saga
export function* watchAi() {
  yield takeLatest(uploadImageRequest.type, uploadImageSaga);
  yield takeLatest(fetchStockDataRequest.type, fetchStockDataSaga);
  yield takeLatest(predictRequest.type, predictSaga);
}
