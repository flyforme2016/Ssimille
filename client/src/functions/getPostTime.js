const getPostTime = (date) => { //where : 1 = community 0 = chatList
  console.log('date: ', date, 'type: ', typeof date) //2022-06-18T14:30:08.000Z / string
  const minute = 60;
  const hour = minute * 60; //3600
  const day = hour * 24;  //86400
  const postTime = new Date(date);
  console.log('postTime: ', postTime); //Sat Jun 18 2022 23:30:08 GMT+0900 (대한민국 표준시)
  let postedTime = Math.floor(
    (new Date().getTime() - postTime.getTime()) / 1000,
  );
  console.log('typeof postedTime: ', typeof postedTime)
  console.log('postedTime: ', postedTime) //게시글 등록시간과 현재 시간의 차이를 초단위로 반환
  
  let postTimeText = '';
  if (postedTime < minute) { //1분이내 : 방금전
    postTimeText = '방금 전';
  } else if (postedTime < hour) { //1시간 이내 :  ""분전 1h = 60m = 3600s
    postTimeText = Math.floor(postedTime / minute) + '분 전';
  } else if (postedTime < day) {  //오늘내 : ""시간 전 1d = 24h = 1440m = 86400s
    postTimeText = Math.floor(postedTime / hour) + '시간 전';
  } else if (day < postedTime && postedTime < 2*day){
    postTimeText = '어제'
  } else {
    postTimeText = Math.floor(postedTime / day) + '일 전';
  }

  return postTimeText;
};

export default getPostTime;
