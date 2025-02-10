import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  uploadImageRequest,
  uploadImageSuccess,
  uploadImageFailure,
} from './aiSlice';
import axiosInstance from '../../util/axiosInstance';

// API 요청 함수
function uploadImageAPI(formData) {
  return axiosInstance.post('/ai/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// Saga 생성
function* uploadImageSaga(action) {
  try {
    const response = yield call(uploadImageAPI, action.payload);
    yield put(uploadImageSuccess(response.data));
  } catch (error) {
    yield put(
      uploadImageFailure(error.response?.data?.error || '파일 업로드 실패'),
    );
  }
}

// Watcher Saga
export function* watchAi() {
  yield takeLatest(uploadImageRequest.type, uploadImageSaga);
}
