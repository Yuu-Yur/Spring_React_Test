import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImageSuccess } from '../../store/ai/aiSlice';
import axios from 'axios';

const useYoloClassification = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.ai);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [result, setResult] = useState({});

  // ✅ 파일 선택 핸들러
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  // ✅ API 에러 메시지 처리 함수
  const getErrorMessage = (error) => {
    return error.response?.data || error.message || '알 수 없는 오류 발생';
  };

  // ✅ 파일 업로드 핸들러
  const handleUpload = async () => {
    if (!file) return false; // ✅ false 반환하여 `handleUploadWithProcessing`에서 감지

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/ai/predict/4',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        },
      );

      console.log('📌 서버 응답:', response.data);

      dispatch(uploadImageSuccess(response.data));
      setResult(response.data);
      setPreview(response.data.file_url);
      setDownloadUrl(response.data.download_url);

      return true; // ✅ 명확하게 성공 시 `true` 반환
    } catch (error) {
      console.error('❌ 파일 업로드 오류:', getErrorMessage(error));
      alert(`❌ 파일 업로드 실패: ${getErrorMessage(error)}`);
      return false; // ✅ 실패 시 `false` 반환
    }
  };

  return {
    file,
    preview,
    downloadUrl,
    setDownloadUrl,
    result,
    setResult,
    error,
    loading,
    handleFileChange,
    handleUpload,
  };
};

export default useYoloClassification;
