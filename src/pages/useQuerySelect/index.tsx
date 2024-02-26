import {
  useQuery,
} from '@tanstack/react-query'
import axios from "axios";
import {useState} from "react";

export default function useQuerySelectExample() { // select 예제
  const getQueryData = async () => {
    const response = await axios.get("https://api.github.com/repos/TanStack/query");
    return response.data
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'], // 쿼리명
    queryFn: getQueryData, // 쿼리함수 = 데이터를 가져오는 함수
    select: (data) => {
      const postTitles = data.map((post: Data) => post.title);
      return postTitles;
    },
  })

  if (isPending) return '로딩중...'
  if (error) return '에러 발생: ' + error.message

  return (
    <div style={{height: '100dvh'}}>
      {data.map((postTitle: string, idx: number) => (
        <div key={`${postTitle}-${idx}`}>{idx}: {postTitle}</div>
      ))}
    </div>
  )
}