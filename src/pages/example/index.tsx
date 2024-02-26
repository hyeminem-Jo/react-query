import {
  useQuery,
} from '@tanstack/react-query'

export default function Example() { // 공식문서 예제
  // 기존 데이터 패칭
  // const [isLoaging, setIsLoaging] = useState(false)
  // const [isError, setIsError] = useState(false)
  // const [data, setData] = useState({})

  // react-query 데이터 패칭
  const { isPending, error, data, isLoading } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://api.github.com/repos/TanStack/query').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return '로딩중...'
  if (error) return 'An error has occurred: ' + error.message

  return (
    <div>
      <h1>{data.name}</h1>
      <p>날짜: {data.created_at}</p>
      <p>{data.description}</p>
      <strong>👀 {data.subscribers_count}</strong>{' '}
      <strong>✨ {data.stargazers_count}</strong>{' '}
      <strong>🍴 {data.forks_count}</strong>
    </div>
  )
}