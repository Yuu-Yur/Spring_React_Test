import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImageRequest } from '../../store/ai/aiSlice';
import './css/ai.css';

const WasteApplianceClassification = () => {
  const dispatch = useDispatch();
  const { loading, result, error } = useSelector((state) => state.ai);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // ✅ 미리보기 상태 추가

  // ✅ 파일 선택 핸들러
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl); // ✅ 미리보기 URL 설정
    }
  };

  // ✅ 업로드 핸들러
  const handleUpload = () => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    dispatch(uploadImageRequest({ formData, type: 2 }));
  };

  return (
    <div className="tool-classification">
      <h3>🛠️ 폐가전 이미지 분류</h3>
      <p>폐가전 제품을 업로드하여 AI가 분류할 수 있도록 합니다.</p>

      {/* ✅ 파일 업로드 */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* ✅ 이미지 미리보기 */}
      {preview && (
        <div className="preview-container">
          <h4>📷 미리보기</h4>
          <img src={preview} alt="미리보기" className="image-preview" />
        </div>
      )}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? '업로드 중...' : '이미지 업로드'}
      </button>

      {/* ✅ 결과 표시 */}
      {result && (
        <div className="result">
          <h4>📌 결과</h4>
          <p>
            <strong>파일명:</strong> {result.filename}
          </p>
          <p>
            <strong>예측된 클래스:</strong> {result.predicted_class}
          </p>
          <p>
            <strong>클래스 인덱스:</strong> {result.class_index}
          </p>
          <p>
            <strong>신뢰도:</strong> {result.confidence}
          </p>
        </div>
      )}

      {/* ✅ 에러 표시 */}
      {error && <p className="error">❌ 오류: {error}</p>}
    </div>
  );
};

export default WasteApplianceClassification;
