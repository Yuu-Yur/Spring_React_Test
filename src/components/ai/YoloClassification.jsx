import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import useYoloClassification from '../../store/ai/useYoloClassification'; // ✅ 커스텀 훅 가져오기
import './css/ai.css';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImageSuccess } from '../../store/ai/aiSlice';

const YoloClassification = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ai);

  const { preview, downloadUrl, handleFileChange, handleUpload } =
    useYoloClassification();

  const [processing, setProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('📂 파일을 업로드하세요.');

  const handleUploadWithProcessing = async () => {
    setProcessing(true);
    setStatusMessage('⏳ 데이터 처리 중...');

    try {
      const uploadResult = await handleUpload();

      if (uploadResult) {
        setProcessing(false);
        setTimeout(() => setStatusMessage('✅ YOLO 분석 완료!'), 100);
      }
    } catch (error) {
      setProcessing(false);
      setStatusMessage('❌ 파일 업로드 실패');
    }
  };

  useEffect(() => {
    if (!processing) {
      setStatusMessage('✅ YOLO 분석 완료!');
    }
  }, [processing]);

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

      {/* ✅ 업로드 버튼 */}
      <button
        onClick={handleUploadWithProcessing}
        disabled={loading || processing}
      >
        {loading || processing ? '⏳ 업로드 중...' : '📤 파일 업로드'}
      </button>

      {/* ✅ 상태 메시지 표시 */}
      <p className="status-message">{statusMessage}</p>

      {/* ✅ 다운로드 링크 (완료 후 표시) */}
      {downloadUrl && (
        <div className="download-section">
          <h4>📥 다운로드</h4>
          <a href={downloadUrl} download className="download-link">
            🔽 파일 다운로드
          </a>
        </div>
      )}
    </div>
  );
};

export default YoloClassification;
