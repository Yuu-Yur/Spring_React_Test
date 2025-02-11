import React from 'react';
import useYoloClassification from '../../store/ai/useYoloClassification'; // ✅ 경로 확인
import './css/ai.css';

const YoloClassification = () => {
  const {
    preview,
    downloadUrl,
    result,
    error,
    loading,
    handleFileChange,
    handleUpload,
  } = useYoloClassification();

  return (
    <div className="tool-classification">
      <h3>🎯 YOLO 이미지/동영상 분석</h3>
      <p>AI 모델이 업로드된 파일을 분석하고 결과를 제공합니다.</p>

      {/* ✅ 파일 업로드 */}
      <input type="file" accept="image/*,video/*" onChange={handleFileChange} />

      {/* ✅ 미리보기 (이미지 또는 동영상) */}
      {preview && (
        <div className="preview-container">
          <h4>📷 미리보기</h4>
          {preview.match(/\.(mp4|avi|mov|mkv)$/i) ? (
            <video controls className="video-preview">
              <source src={preview} type="video/mp4" />
              브라우저가 동영상을 지원하지 않습니다.
            </video>
          ) : (
            <img src={preview} alt="미리보기" className="image-preview" />
          )}
        </div>
      )}

      <button onClick={handleUpload} disabled={loading}>
        {loading ? '업로드 중...' : '파일 업로드'}
      </button>

      {/* ✅ 결과 표시 */}
      {result && (
        <div className="result">
          <h4>📌 분석 결과</h4>
          <p>
            <strong>파일명:</strong> {result.filename}
          </p>
          <p>
            <strong>예측된 클래스:</strong> {result.predicted_class}
          </p>
          <p>
            <strong>신뢰도:</strong> {result.confidence}
          </p>
        </div>
      )}

      {/* ✅ 다운로드 링크 */}
      {downloadUrl && (
        <div className="download-section">
          <h4>📥 다운로드</h4>
          <a href={downloadUrl} download className="download-link">
            🔽 파일 다운로드
          </a>
        </div>
      )}

      {/* 에러 표시 */}
      {error && <p className="error">❌ 오류: {error}</p>}
    </div>
  );
};

export default YoloClassification;
