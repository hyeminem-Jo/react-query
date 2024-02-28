import axios from 'axios'
import { useInView } from 'react-intersection-observer'
import {
  useInfiniteQuery,
} from '@tanstack/react-query'
import {useEffect} from "react";

export default function useInfiniteQueryExample222() {
  const { ref, inView } = useInView()
  // useInView 훅은 리액트 컴포넌트의 "inView" 상태를 모니터링해주는 훅
  // viewport 에 보여질 때를 체크할 요소에 ref 속성을 걸어주고,
  // 요소가 뷰포트 안에 보였을 때 inView 가 true 값이 되는 걸 조건으로 사용하여 특정 컴포넌트나 엘리먼트를 렌더

  const {
    status, // 상태
    data, // 데이터
    error, // 에러
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ['posts'], // (필수값)
    queryFn: async ({ pageParam }) => { // (필수값)
      const res = await axios.get(`/api/posts?cursor=${pageParam}`)
      return res.data
    },

    // (필수값)
    initialPageParam: 0, // 첫 렌더링 시 pageParam 값으로 들어감

    // (필수값)
    getNextPageParam: (lastPage, allPage) => { // (필수값)
      console.log('lastPage: ', lastPage)
      console.log('allPage: ',allPage)
      return lastPage.nextId ?? undefined // 다음 페이지를 호출할 때 사용 될 pageParam
      // ex) page 데이터의 nextId (마지막 페이지 id + 1) 가 다음 요청의 pageParam 값으로 들어감
      // 사용 가능한 다음 페이지가 없음을 표시하고자 할 땐 nextId 를 null 로 떨어지게 해 undefined 로 반환
    },
    // lastPage: fetch 해온 가장 최근에 가져온 페이지 목록
    // allPages: 현재까지 가져온 모든 페이지 데이터
    // lastPageParam: 마지막 페이지의 매개변수
    // allPageParams: 모든 페이지의 매개변수

    maxPages: 3, // infinite 쿼리에 저장할 최대 페이지 수

    // (선택값)
    getPreviousPageParam: (firstPage) => {
      console.log('firstPage: ', firstPage)
      return firstPage.previousId ?? undefined // 이전 페이지를 호출할 때 사용 될 pageParam
    },
  })

  useEffect(() => {
    if (inView) { // 뷰포트에 버튼이 들어오면 inView 가 true 로 변환, fetchNextPage 실행
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

  return (
    <div>
      <h1>Infinite Scroll</h1>
      {status === 'pending' ? (
        <p>로딩중...</p>
      ) : status === 'error' ? (
        <span>에러 발생: {error.message}</span>
      ) : (
        <>
          <div>
            <button
              onClick={() => fetchPreviousPage()} // 이전 페이지를 fetch
              disabled={!hasPreviousPage || isFetchingPreviousPage}
            >
              {isFetchingPreviousPage // fetchPreviousPage 메서드가 이전 페이지를 가져오는 동안 true 반환
                ? '추가 post 로드중...'
                : hasPreviousPage // 가져올 수 있는 이전 페이지가 있을 경우 true 반환
                  ? '이전 post 로드하기'
                  : '더이상 로드할 게시물이 없습니다'}
            </button>
          </div>
          {data.pages.map((page) => ( // data.pages: 모든 페이지 데이터를 포함하는 배열
            // data.pageParams: 모든 페이지 매개변수를 포함하는 배열이다.
            <div key={page.nextId}>
              {page.data.map((project) => (
                <p
                  style={{
                    border: '1px solid gray',
                    borderRadius: '5px',
                    padding: '10rem 1rem',
                    background: `hsla(${project.id * 30}, 60%, 80%, 1)`,
                  }}
                  key={project.id}
                >
                  {project.name}
                </p>
              ))}
            </div>
          ))}
          <div>
            <button
              ref={ref} // 뷰포트에 체크될 element
              onClick={() => fetchNextPage()} // 다음 페이지를 fetch
              disabled={!hasNextPage || isFetchingNextPage}
              // 더이상 가져올 페이지가 없거나 페칭중일 때 버튼 disable 처리
              // hasNextPage: 가져올 수 있는 다음 페이지가 있을 경우 true 반환
              // isFetchingNextPage: fetchNextPage 메서드가 다음 페이지를 가져오는 동안 true
              style={{
                margin: '20px',
                padding: '20px',
              }}
            >
              {isFetchingNextPage
                ? '추가 게시물 로딩중...'
                : hasNextPage
                  ? '새 post 로드하기'
                  : '더이상 로드할 게시물이 없습니다'}
            </button>
          </div>
          <div>
            {isFetching && !isFetchingNextPage
              ? 'Background 업데이트중...'
              : null}
          </div>
        </>
      )}
      <hr />
    </div>
  )
}
