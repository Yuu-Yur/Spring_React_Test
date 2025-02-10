import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImageRequest } from '../../store/ai/aiSlice';
import './css/ai.css';
const ToolClassification = () => {
  const dispatch = useDispatch();
  const { loading, result, error } = useSelector((state) => state.ai);
  const [file, setFile] = useState(null);

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  // 업로드 핸들러
  const handleUpload = () => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    dispatch(uploadImageRequest(formData));
  };

  return (
    <div className="tool-classification">
      <h3>🔧 공구 툴 이미지 분류</h3>
      <p>AI 모델이 공구 이미지를 분석하고 분류합니다.</p>

      {/* 파일 업로드 */}
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? '업로드 중...' : '이미지 업로드'}
      </button>

      {/* 결과 표시 */}
      {result && (
        <div className="result">
          <h4>📌 결과</h4>
          <p>
            <strong>파일명:</strong> {result.filename}
          </p>
          <p>
            <strong>예측된 클래스:</strong> {result.predictedClass}
          </p>
          <p>
            <strong>클래스 인덱스:</strong> {result.classIndex}
          </p>
          <p>
            <strong>신뢰도:</strong> {result.confidence}
          </p>
        </div>
      )}

      {/* 에러 표시 */}
      {error && <p className="error">❌ 오류: {error}</p>}
    </div>
  );
};

export default ToolClassification;
