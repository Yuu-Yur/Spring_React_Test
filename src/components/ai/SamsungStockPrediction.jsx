import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStockDataRequest, predictRequest } from '../../store/ai/aiSlice';

const SamsungStockPrediction = () => {
  const dispatch = useDispatch();
  const { stockData, predictions, loading } = useSelector((state) => state.ai);
  const [selectedPeriod, setSelectedPeriod] = useState('');

  // ✅ 기간 선택 핸들러
  const handlePeriodChange = (event) => {
    setSelectedPeriod(event.target.value);
  };

  // ✅ 주가 데이터 가져오기
  const fetchStockData = () => {
    if (!selectedPeriod) {
      alert('기간을 선택하세요.');
      return;
    }
    dispatch(fetchStockDataRequest(selectedPeriod));
  };

  // ✅ 예측 요청
  const makePrediction = (modelType) => {
    if (!selectedPeriod || stockData.length === 0) {
      alert('기간을 선택하고 데이터를 가져온 후 예측하세요.');
      return;
    }

    // 🔹 JSON 형식으로 데이터 변환
    const periodDaysMap = {
      '1d': 1,
      '5d': 4,
      '1mo': 21,
      '3mo': 59,
      '6mo': 123,
      '1y': 243,
    };
    const days = periodDaysMap[selectedPeriod] || 1;

    const inputData = stockData
      .slice(0, days)
      .map((item) => [
        parseFloat(item.Open) || 0,
        parseFloat(item.Low) || 0,
        parseFloat(item.High) || 0,
        parseFloat(item.Close) || 0,
      ]);

    dispatch(
      predictRequest({
        model: modelType,
        data: inputData,
        period: selectedPeriod,
      }),
    );
  };

  return (
    <div>
      <h3>📈 삼성 주가 예측</h3>
      <p>AI를 활용한 삼성 주가 예측 모델을 테스트할 수 있습니다.</p>

      {/* ✅ 기간 선택 */}
      <form>
        {['1d', '5d', '1mo', '3mo', '6mo', '1y'].map((period) => (
          <label key={period} style={{ marginRight: '10px' }}>
            <input
              type="radio"
              name="period"
              value={period}
              checked={selectedPeriod === period}
              onChange={handlePeriodChange}
            />
            {period === '1d'
              ? '1일'
              : period === '5d'
              ? '5일 (4일)'
              : period === '1mo'
              ? '1개월 (21일)'
              : period === '3mo'
              ? '3개월 (60일)'
              : period === '6mo'
              ? '6개월 (123일)'
              : '1년 (243일)'}
          </label>
        ))}
      </form>

      {/* ✅ 데이터 가져오기 버튼 */}
      <button onClick={fetchStockData} disabled={loading}>
        {loading ? '로딩 중...' : '데이터 가져오기'}
      </button>

      {/* ✅ 데이터 입력 */}
      <div>
        {stockData.length > 0 ? (
          stockData.map((item, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: '10px',
                marginTop: '10px',
              }}
            >
              <h4>
                {index + 1}번째 날 ({item.Date})
              </h4>
              <p>시작가: {item.Open}</p>
              <p>최소가: {item.Low}</p>
              <p>최대가: {item.High}</p>
              <p>종가: {item.Close}</p>
            </div>
          ))
        ) : (
          <p>데이터가 없습니다.</p>
        )}
      </div>

      {/* ✅ 예측 버튼 */}
      {['RNN', 'LSTM', 'GRU'].map((model) => (
        <button
          key={model}
          onClick={() => makePrediction(model)}
          disabled={loading}
        >
          {model} 예측하기
        </button>
      ))}

      {/* ✅ 예측 결과 출력 */}
      <h2>📊 예측 결과</h2>
      {['RNN', 'LSTM', 'GRU'].map((model) => (
        <h3 key={model}>
          {model}: {predictions[model]}
        </h3>
      ))}
    </div>
  );
};

export default SamsungStockPrediction;
