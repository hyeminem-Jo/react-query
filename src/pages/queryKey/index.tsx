import {
  useQuery,
} from '@tanstack/react-query'
import axios from "axios";
import {useState} from "react";

export default function queryKeyExample() { // queryKey 예제
  const [currentId, setCurrentId] = useState(1) // currentId => currentPage 라 가정

  const currentIdHandler = () => {
    setCurrentId((prev) => prev + 1)
  }

  const getPostData = async (id: string) => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?id=${id}`); // post => page 라 가정
    return response.data
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['postData', currentId], // 쿼리명
    queryFn: () => getPostData(currentId), // 쿼리함수 = 데이터를 가져오는 함수
    staleTime: 2000
    // ...options
  })

  if (isPending) return '로딩중...'
  if (error) return '에러 발생: ' + error.message

  return (
    <div style={{ height: '100dvh'}}>
      <div>현재 페이지</div>
      <div>{JSON.stringify(data)}</div>
      <br />
      <button
        type="button"
        onClick={currentIdHandler}
      >
        currentId 더하기 1
      </button>
      <br /><br />
      <div style={{color: 'gold'}}>
        currentId: {currentId}
      </div>
    </div>
  )
}