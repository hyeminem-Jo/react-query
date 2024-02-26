import {
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import axios from "axios";
import {useState} from "react";

export default function useQueryExample() { // initialData 예제
  const queryClient = useQueryClient();

  const [currentId, setCurrentId] = useState(1) // currentId => currentPage 라 가정
  const getPostData = async (id: string) => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?id=${id}`); // post => page 라 가정
    return response.data
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ['postData', currentId], // 쿼리명
    queryFn: () => getPostData(currentId), // 쿼리함수 = 데이터를 가져오는 함수
    staleTime: 1000,
    initialData: () => {
      const queryData = queryClient.getQueryData(["get-post"]) as any;
      const post = queryData?.data?.find(
        (post: Hero) => post.id === parseInt(currentId)
      );
      if (post) return { data: post };
    },
  })

  if (isLoading) {
    console.log(isLoading)
  }
  if (error) return '에러 발생: ' + error.message

  return (
    <div style={{ height: '100dvh'}}>
      <div>현재 페이지</div>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}