// import { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { uploadImageRequest, uploadImageSuccess } from './aiSlice';
// import { io } from 'socket.io-client';
// import axios from 'axios';

// // ✅ CORS 정책을 고려한 Socket.IO 클라이언트 설정
// const socket = io('http://localhost:5000', {
//   transports: ['websocket'], // ✅ 웹소켓만 사용 (불필요한 HTTP 폴백 방지)
//   // reconnectionAttempts: 5, // ✅ 재연결 시도 횟수 제한
//   // reconnectionDelay: 1000, // ✅ 재연결 간격 1초
// });

// const useYoloClassification = () => {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.ai);
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [downloadUrl, setDownloadUrl] = useState(null);
//   const [result, setResult] = useState({}); // ✅ 추가됨

//   // ✅ 로컬 스토리지에서 액세스 토큰 가져오기 (최적화)
//   const getAccessToken = () => localStorage.getItem('accessToken');

//   // ✅ 파일 선택 핸들러 (미리보기 추가)
//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);

//     if (selectedFile) {
//       const objectUrl = URL.createObjectURL(selectedFile);
//       setPreview(objectUrl);
//     }
//   };

//   // ✅ 파일 업로드 핸들러 (비동기 요청)
//   const handleUpload = async () => {
//     if (!file) {
//       alert('파일을 선택해주세요.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('image', file); // ✅ Spring Boot 서버에서 "image" 키로 받도록 설정

//     const accessToken = getAccessToken();

//     try {
//       // 🔥 YOLO 예측 요청 전송 (Spring Boot API)
//       const response = await axios.post(
//         'http://localhost:8080/api/ai/predict/4',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             Authorization: `Bearer ${accessToken}`,
//           },
//         },
//       );

//       console.log('📌 서버 응답:', response.data);

//       // ✅ Redux로 업로드 상태 관리
//       dispatch(uploadImageRequest(undefined, formData, 4)); // ✅ 수정된 Redux 액션
//       // ✅ 업로드 성공 후 상태 업데이트
//       setPreview(response.data.file_url);
//       setDownloadUrl(response.data.download_url);
//     } catch (error) {
//       console.error(
//         '❌ 파일 업로드 오류:',
//         error.response ? error.response.data : error.message,
//       );
//       alert(
//         `파일 업로드 실패: ${
//           error.response ? error.response.data : error.message
//         }`,
//       );
//     }
//   };

//   // ✅ YOLO 처리 완료 후 결과 수신 (Socket.IO)
//   useEffect(() => {
//     let isMounted = true;

//     socket.on('file_processed', (data) => {
//       console.log('✅ YOLO 처리 완료!', data);
//       // ✅ Redux 상태 업데이트 (loading: false)
//       dispatch(uploadImageSuccess(data));
//       if (isMounted) {
//         setResult({
//           // filename: data.file_url.split('/').pop(),
//           predicted_class: data.predicted_class || 'N/A',
//           confidence: data.confidence ? `${data.confidence}%` : 'N/A',
//         });

//         setDownloadUrl(data.download_url); // ✅ 수정됨

//         // ✅ file_url이 존재할 경우만 match() 실행
//         if (data.file_url && data.file_url.match(/\.(jpeg|jpg|png|gif)$/i)) {
//           setPreview(data.file_url);
//         }
//       }
//     });

//     return () => {
//       isMounted = false;
//       socket.off('file_processed');
//     };
//   }, []);

//   return {
//     file,
//     preview,
//     downloadUrl,
//     setDownloadUrl, // ✅ 추가됨
//     result,
//     setResult,
//     error,
//     loading,
//     handleFileChange,
//     handleUpload,
//   };
// };

// export default useYoloClassification;
