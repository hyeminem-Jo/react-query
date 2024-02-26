import {
  useQuery,
} from '@tanstack/react-query'
import axios from "axios";

export default function useQueryExample() { // gcTime, staleTime 예제
  const getQueryData = async () => {
    const response = await axios.get("https://api.github.com/repos/TanStack/query");
    return response.data
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['postData'], // 쿼리명
    queryFn: getQueryData, // 쿼리함수 = 데이터를 가져오는 함수
    gcTime: 5 * 60 * 1000, // 5분 (기본값: 5분)
    staleTime: 1 * 60 * 1000, // 1분 (기본값: 0초)
  })

  if (isPending) return '로딩중...'
  if (error) return '에러 발생: ' + error.message

  return (
    <div style={{height: '100dvh'}}>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}