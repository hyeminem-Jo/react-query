import axios from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {useState} from "react";

const getCharacters = async () => {
  // 딜레이용 테스트 Promise (0.5초)
  await new Promise((r) => setTimeout(r, 500))
  const { data } = await axios.get('https://rickandmortyapi.com/api/character/')
  return data
}

const getCharacter = async (selectedChar) => {
  // 딜레이용 테스트 Promise (0.5초)
  await new Promise((r) => setTimeout(r, 500))
  const { data } = await axios.get(
    `https://rickandmortyapi.com/api/character/${selectedChar}`,
  )
  return data
}

export default function PrefetchExample() {
  const queryClient = useQueryClient()
  const rerender = useState(0)[1] // UI 업데이트를 위한 리렌더
  // => const [, rerender] = useState(0); 두번째 요소(함수)만 사용하겠다는 의미
  const [selectedChar, setSelectedChar] = useState(1) // 클릭된 요소 id

  const charactersQuery = useQuery({ // 전체 캐릭터 불러오기
    queryKey: ['characters'],
    queryFn: getCharacters,
  })

  const characterQuery = useQuery({ // 특정 캐릭터 불러오기
    queryKey: ['character', selectedChar], // 버튼 클릭 후 selectedChar 가 변경되면 쿼리 재실행
    queryFn: () => getCharacter(selectedChar),
  })

  return (
    <div className="App" style={{padding: '30px'}}>
      <p>
        캐릭터 hover 시 - 프리패치 되었다는 의미, 노란색으로 표시
        캐릭터 click 시 - 상세정보 표시
      </p>
      <h2 style={{marginTop: '20px', marginBottom: '20px', fontSize: '30px'}}>캐릭터</h2>
      {charactersQuery.isPending ? (
        '로딩중...'
      ) : (
        <div className="wrap" style={{display: 'flex'}}>
          <ul>
            {charactersQuery.data?.results.map((char) => (
              <li
                key={char.id}
                onClick={() => { // 버튼 클릭 후 selectedChar 가 변경되면 쿼리 재실행
                  setSelectedChar(char.id)
                }}
                onMouseEnter={async () => { // 클릭하기 전 hover 시 미리 해당 요소의 데이터 프리패치
                  await queryClient.prefetchQuery({
                    queryKey: ['character', char.id],
                    queryFn: () => getCharacter(char.id),
                    staleTime: 3 * 1000, // 3초 이상 지난 경우에만 Prefetch
                    gcTime: 5 * 1000 // 5초가 지나면 캐시된 데이터 삭제
                  })

                  setTimeout(() => {
                    rerender({}) // 프리패치 후 강제 리렌더링을 통해 UI 업데이트
                  }, 1)
                }}
                style={{listStyle: 'none',}}
              >
                <div
                  style={{
                    display: 'block',
                    padding: '30px',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    marginTop: '25px',
                    marginBottom: '25px',
                    border: '1px solid',
                    cursor: 'pointer',
                    ...(queryClient.getQueryData(['character', char.id])
                      // 프리패칭 후 캐시된 데이터 가져오기
                      ? {
                        fontWeight: 'bold',
                        color: 'gold',
                      }
                      : {}),
                  }}
                >
                  {char.id} - {char.name}
                </div>
              </li>
            ))}
          </ul>

          <div style={{marginLeft: '20px'}}>
            <h3 style={{marginTop: '20px', marginBottom: '20px', fontSize: '30px'}}>클릭된 요소</h3>
            {characterQuery.isPending ? (
              '로딩중'
            ) : (
              <>
                <pre style={{marginLeft: '20px', fontSize: '20px'}}>
                  {characterQuery.data.id} - {characterQuery.data.name}
                </pre>
                {/*<pre>{JSON.stringify(characterQuery.data, null, 2)}</pre>*/}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
