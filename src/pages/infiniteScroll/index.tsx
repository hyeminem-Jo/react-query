import {
  useQuery,
} from '@tanstack/react-query'
import axios from "axios";

export default function infiniteScrollExample() {
  const getPostData = async () => {
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
    return response.data
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['postData'], // 쿼리명
    queryFn: getPostData, // 쿼리함수 = 데이터를 가져오는 함수
    // ...options ex) gcTime, staleTime, select, ...
  })

  if (isPending) return '로딩중...'
  if (error) return '에러 발생: ' + error.message
  console.log(getPostData)

  return (
    <div style={{height: '100dvh'}}>
      {data.map((post) => (
        <>
          <h1>제목: {post.title}</h1>
          <p>날짜: {post.body}</p>
          <span>👀 userId: {post.userId}</span>{' '}
        </>
      ))}
    </div>
  )
}