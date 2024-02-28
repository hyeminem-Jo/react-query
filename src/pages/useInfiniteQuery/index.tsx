import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

export default function InfiniteQueries() {
  // useInfiniteQuery의 queryFn의 매개변수는 `pageParam`이라는 프로퍼티를 가질 수 있음
  const fetchPostData = async ({ pageParam }) => {
    console.log('pageParam: ', pageParam)
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts?id=${pageParam}`
    );
    console.log(333)
    return response.data
  };

  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["postData"],
      queryFn: fetchPostData,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        console.log(2222)
        return allPages.length < 99 && allPages.length + 1;
      },

    });

  return (
    <div>
      {data?.pages[0].map((group, idx) => (
        <div key={idx}>
        <h1>{group.title}</h1>
      </div>
      ))}
      {/*{data?.map((post) => (*/}
      {/*  <>*/}
      {/*    <h1>제목: {post.title}</h1>*/}
      {/*    <p>날짜: {post.body}</p>*/}
      {/*    <span>👀 userId: {post.userId}</span>{' '}*/}
      {/*  </>*/}
      {/*))}*/}
      <div>
        <button disabled={!hasNextPage} onClick={() => fetchNextPage()}>
          LoadMore
        </button>
      </div>
      <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
    </div>
  );
};