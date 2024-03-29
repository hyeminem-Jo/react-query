import {
  useQuery,
} from '@tanstack/react-query'
import axios from "axios";
import {useState} from "react";

export default function useQueryExample() { // 기본 예제 (axios 사용)
  const getQueryData = async () => {
    const response = await axios.get("https://api.github.com/repos/TanStack/query");
    return response.data
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['postData'], // 쿼리명
    queryFn: getQueryData, // 쿼리함수 = 데이터를 가져오는 함수
    // ...options ex) gcTime, staleTime, select, ...
  })

  if (isPending) return '로딩중...'
  if (error) return '에러 발생: ' + error.message

  return (
    <div style={{height: '100dvh'}}>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}