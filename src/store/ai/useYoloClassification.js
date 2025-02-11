import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImageRequest } from '../../store/ai/aiSlice';

const useYoloClassification = () => {
  const dispatch = useDispatch();
  const { loading, result, error } = useSelector((state) => state.ai);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // ✅ 미리보기 상태 추가
  const [downloadUrl, setDownloadUrl] = useState(null); // ✅ 다운로드 URL 상태 추가

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl); // ✅ 미리보기 URL 설정
    }
  };

  // 업로드 핸들러
  const handleUpload = async () => {
    if (!file) {
      alert('파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file); // ✅ Spring Boot 서버에서 "image" 키로 받도록 설정
    dispatch(uploadImageRequest({ formData, type: 4 }));

    try {
      const response = await fetch('http://localhost:8080/api/ai/predict/4', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('서버 응답 오류');
      }

      const data = await response.json();
      console.log('📌 서버 응답:', data);

      setPreview(data.file_url); // ✅ 서버에서 받은 file_url을 미리보기로 사용
      setDownloadUrl(data.download_url); // ✅ 다운로드 URL 설정
    } catch (error) {
      console.error('업로드 실패:', error);
    }
  };

  return {
    file,
    preview,
    downloadUrl,
    result,
    error,
    loading,
    handleFileChange,
    handleUpload,
  };
};

export default useYoloClassification;
