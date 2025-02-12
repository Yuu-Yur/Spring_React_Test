import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import useYoloClassification from '../../store/ai/useYoloClassification'; // ✅ 커스텀 훅 가져오기
import './css/ai.css';

const YoloClassification = () => {
  const {
    preview,
    downloadUrl,
    setDownloadUrl, // ✅ 다운로드 URL을 저장하는 상태 추가
    result,
    setResult, // ✅ YOLO 분석 결과 상태 추가
    error,
    loading,
    handleFileChange,
    handleUpload,
  } = useYoloClassification();

  useEffect(() => {
    // ✅ 컴포넌트가 마운트될 때만 Socket.IO 연결
    const socket = io('http://localhost:5000', {
      transports: ['websocket'], // 웹소켓만 사용하도록 설정 (불필요한 HTTP 폴백 방지)
      reconnectionAttempts: 5, // 5번까지 자동 재연결 시도
      reconnectionDelay: 1000, // 재연결 시 1초 대기
    });

    // ✅ YOLO 처리 완료 시 결과 수신
    socket.on('file_processed', (data) => {
      console.log('✅ YOLO 처리 완료!', data);

      // ✅ 상태 업데이트 (UI 갱신)
      // setResult({
      //   filename: data.file_url.split('/').pop(), // 파일명 추출
      //   predicted_class: data.predicted_class || 'N/A', // YOLO 결과가 있다면 적용
      //   confidence: data.confidence ? `${data.confidence}%` : 'N/A', // YOLO 결과가 있다면 적용
      // });
      setDownloadUrl(data.download_url);
    });

    // ✅ Cleanup: 컴포넌트 언마운트 시 이벤트 리스너 및 소켓 해제
    return () => {
      socket.off('file_processed');
      socket.disconnect();
    };
  }, [setResult, setDownloadUrl]); // ⚠️ setResult, setDownloadUrl이 변경될 때만 실행

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
