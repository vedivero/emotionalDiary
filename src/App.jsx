import './App.css';
import { useReducer, useRef, createContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Diary from './pages/Diary';
import New from './pages/New';
import Notfound from './pages/Notfound';
import Edit from './pages/Edit';

const mockData = [
  {
    id: 1,
    createdDate: new Date('2024-08-06').getTime(),
    emotionId: 1,
    content: '일기 내용1',
  },
  {
    id: 2,
    createdDate: new Date('2024-08-05').getTime(),
    emotionId: 2,
    content: '일기 내용2',
  },
  {
    id: 3,
    createdDate: new Date('2024-07-04').getTime(),
    emotionId: 3,
    content: '일기 내용3',
  },
];

function reducer(state, action) {
  switch (action.type) {
    case 'CREATE':
      //원본 데이터 복사 후, dispatch로 전달한 액션객체를 새로운 state로 설정
      return [action.data, ...state];
    case 'UPDATE':
      //id에 해당하는 요소만 수정
      return state.map((item) => (String(item.id) === String(action.data.id) ? action.data : item));
    case 'DELETE':
      return state.filter((item) => String(item.id) !== String(action.id));
  }
}

//추가, 수정, 삭제 함수를 `Context`를 통해 App컴포넌트 하위 컴포넌트에 전달
export const DiaryStateContext = createContext();
//Data State의 값을 변경하는 함수들을 `Context`를 통해 공급
export const DiaryDispatchContext = createContext();

function App() {
  //일기 데이터를 관리하는 state
  const [data, dispatch] = useReducer(reducer, mockData);
  const idRef = useRef(3); //생성될 일기 아이템의 ID값 저장
  //새로운 일기 추가
  const onCreate = (createdDate, emotionId, content) => {
    dispatch({
      type: 'CREATE',
      data: {
        id: idRef.current++,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  //기존 일기 수정
  const onUpdate = (id, createdDate, emotionId, content) => {
    dispatch({
      type: 'UPDATE',
      data: {
        id,
        createdDate,
        emotionId,
        content,
      },
    });
  };

  //기존 일기 삭제
  const onDelete = (id) => {
    dispatch({
      type: 'DELETE',
      id,
    });
  };

  return (
    <>
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={{ onCreate, onUpdate, onDelete }}>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/new' element={<New />} />
            <Route path='/diary/:id' element={<Diary />} />
            <Route path='/edit/:id' element={<Edit />} />
            <Route path='*' element={<Notfound />} />
          </Routes>
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </>
  );
}

export default App;
