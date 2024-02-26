import {
  useQuery,
} from '@tanstack/react-query'
import axios from "axios";

export default function Example() {
  const getQueryData = async () => {
    const response = await axios.get("https://api.github.com/repos/TanStack/query");
    return response.data
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'], // 쿼리명
    queryFn: getQueryData, // 쿼리함수 = 데이터를 가져오는 함수
    // ...options ex) gcTime, staleTime, select, ...
  })

  if (isPending) return '로딩중...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div style={{backgroundColor: '#fff', height: '100dvh'}}>
      <h1>{data.name}</h1>
      <p>날짜: {data.created_at}</p>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}