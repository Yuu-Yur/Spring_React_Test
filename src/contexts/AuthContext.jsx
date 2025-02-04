import { createContext, useContext, useState, useEffect } from 'react';

// Context 생성
const AuthContext = createContext(null);

// Context Provider 생성
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 로그인 정보 저장
  const [logoutTimer, setLogoutTimer] = useState(null); // 로그아웃 타이머 상태
  const [remainingTime, setRemainingTime] = useState(null); // 남은 시간 (초 단위)
  const [intervalId, setIntervalId] = useState(null); // ✅ 인터벌 ID 저장

  // 🔹 1️⃣ 컴포넌트가 처음 로드될 때 localStorage에서 로그인 정보 로드
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const expireTime = localStorage.getItem('expireTime');

    if (savedUser && expireTime) {
      const currentTime = new Date().getTime();
      const timeLeft = parseInt(expireTime, 10) - currentTime;
      if (timeLeft > 0) {
        setUser(JSON.parse(savedUser));
        startAutoLogout(timeLeft);
      } else {
        logout(); // 만료된 경우 자동 로그아웃
      }
    }
  }, []);

  // 🔹 2️⃣ 자동 로그아웃 타이머 및 남은 시간 업데이트
  const startAutoLogout = (time) => {
    if (logoutTimer) clearTimeout(logoutTimer);
    if (intervalId) clearInterval(intervalId); // ✅ 기존 인터벌 제거

    setRemainingTime(Math.floor(time / 1000)); // 남은 시간을 초 단위로 변환

    // ✅ 새롭게 setInterval을 시작할 때 기존 것을 정리
    const newIntervalId = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(newIntervalId);
          logout();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    setIntervalId(newIntervalId); // ✅ 새 인터벌 ID 저장

    setLogoutTimer(
      setTimeout(() => {
        clearInterval(newIntervalId);
        logout();
      }, time),
    );
  };

  // 로그인 함수
  const login = (userData) => {
    setUser(userData);
    // const expireTime = new Date().getTime() + 600000; // 10분 후 만료 시간 설정 (600,000ms)
    localStorage.setItem('user', JSON.stringify(userData));
    // localStorage.setItem('expireTime', expireTime.toString()); // 만료 시간 저장
    // startAutoLogout(600000); // 10분 후 자동 로그아웃 타이머 시작
    extendSession();
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('expireTime');
    setRemainingTime(null);
    if (logoutTimer) clearTimeout(logoutTimer);
  };

  // 🔹 10분 연장 기능 (중복 실행 방지)
  const extendSession = () => {
    if (logoutTimer) clearTimeout(logoutTimer); // ✅ 기존 타이머 제거
    if (intervalId) clearInterval(intervalId); // ✅ 기존 인터벌 제거

    const newExpireTime = new Date().getTime() + 600000; // 10분 연장
    localStorage.setItem('expireTime', newExpireTime.toString());

    startAutoLogout(600000); // ✅ 새로운 10분 타이머 실행
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, extendSession, remainingTime }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Context 사용을 위한 Hook
export const useAuth = () => useContext(AuthContext);
