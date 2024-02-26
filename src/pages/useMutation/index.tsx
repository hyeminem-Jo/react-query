import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import axios from "axios";

export default function useMutationExample() {
  const queryClient = useQueryClient()

  const getPostData = async () => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
    return response.data
  };

  // const addPostData = async () => {
  //   const response = await axios.post(`https://jsonplaceholder.typicode.com/posts`, {
  //     userId: 10,
  //     id: 101,
  //     title: "추가된 제목",
  //     body: "추가된 내용"
  //   });
  //   return response.data
  // };

  const { isPending, error, data } = useQuery({
    queryKey: ['postData'], // 쿼리명
    queryFn: getPostData, // 쿼리함수 = 데이터를 가져오는 함수
    // ...options
  })

  // Mutations
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      console.log('mutation!')
      return axios.post(`https://jsonplaceholder.typicode.com/posts`, newTodo)
    },
    onSuccess: () => {
      // Invalidate and refetch
      console.log('success!')
      // post 로 포스트 추가 후 다시 'postData' 쿼리 강제 재로드 (GET)
      queryClient.invalidateQueries({ queryKey: ['postData'] }) // 특정 쿼리나 쿼리 그룹을 강제로 재로드하도록 유도
    },
    onMutate() {
      /* ... */
    },
    onError(err) {
      console.log(err);
    },
    onSettled() {
      /* ... */
    },
  })

  return (
    <div style={{height: '100dvh'}}>
      <ul>
        {data?.map((post) =>
          <li key={post.id}>
            id: {post.id} <br/>
            title: {post.title}
          </li>
        )}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            userId: 10,
            id: 101,
            title: "추가된 제목",
            body: "추가된 내용"
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}