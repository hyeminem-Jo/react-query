import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import axios from "axios";
import {useState, useEffect} from "react";

export default function PrefetchExample() { // queryKey 예제
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(2)

  const fetchPosts = async (id: string) => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts?id=${id}`); // post => page 라 가정
    return response.data
  };


  useEffect(() => {
    // 10페이지에 있다면 미리 데이터를 가져온 필요가 없다.
    const nextPage = currentPage + 1;

    queryClient.prefetchQuery(["posts", nextPage], () =>
      fetchPosts(nextPage)
    );
  }, [currentPage, queryClient]);

  const { isPending, error, data } = useQuery({
    queryKey: ['postData'], // 쿼리명
    queryFn: () => fetchPosts(currentPage), // 쿼리함수 = 데이터를 가져오는 함수
    // ...options
    staleTime: 5000,
    // 쿼리키가 바껴도 지난 데이터를 유지해서 이전 페이지로 돌아갔을 때 캐시에 해당 데이터가 있도록 해준다.
    keepPreviousData: true,
  })

  return (
    <div style={{ height: '100dvh'}}>
      <div>현재 페이지</div>
      <div>{currentPage}</div>
      <div>{JSON.stringify(data)}</div>
    </div>
  )
}