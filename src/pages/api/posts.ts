// API 엔드포인트 정의
export default (req, res) => {
  // 클라이언트에서 전달된 cursor 값을 가져오고, 숫자로 변환할 수 없다면 0으로 기본값을 설정
  const cursor = parseInt(req.query.cursor) || 0

  // 한 페이지당 표시될 프로젝트 수
  const pageSize = 5

  // 프로젝트 데이터 생성
  const data = Array(pageSize)
    .fill(0)
    .map((_, i) => {
      return {
        // 프로젝트 이름은 'Project'와 현재 cursor 값을 기반으로 생성되며, 서버 시간도 함께 표시됨
        name: 'CONTENT ' + (i + cursor) + ` (server time: ${Date.now()})`,
        id: i + cursor, // 프로젝트 ID 설정
      }
    })

  // 다음 페이지와 이전 페이지의 ID 생성
  const nextId = cursor < 10 ? data[data.length - 1].id + 1 : null
  const previousId = cursor > -10 ? data[0].id - pageSize : null

  // 1초의 딜레이를 추가한 후에 응답을 전송
  setTimeout(() => res.json({ data, nextId, previousId }), 1000)
}