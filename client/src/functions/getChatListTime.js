const getChatListTime = date => {
  //where : 1 = community 0 = chatList
  const minute = 60;
  const hour = minute * 60; //3600
  const day = hour * 24; //86400
  const messageTime = new Date(date); //Sat Jun 18 2022 23:30:08 GMT+0900 (대한민국 표준시)
  let resultTime = '';

  let timeLapse = Math.floor(
    (new Date().getTime() - messageTime.getTime()) / 1000,
  );
  if (timeLapse < day) {
    //오늘 이내 : 오전/오후 hh:mm
    let hh = messageTime.getHours();
    let mm = messageTime.getMinutes();
    if (mm < 10) {
      mm = '0' + mm;
    }

    if (0 <= hh && hh < 12) {
      if (hh === 0) {
        hh = 12;
      }
      resultTime = '오전 ' + hh + ':' + mm;
    } else {
      // 12 <= hh < 24
      if (12 < hh) {
        hh -= 12;
      }
      resultTime = '오후 ' + hh + ':' + mm;
    }
  } else if (day < timeLapse && timeLapse < 2 * day) {
    resultTime = '어제';
  } else {
    resultTime = Math.floor(timeLapse / day) + '일 전';
  }

  return resultTime;
};

export default getChatListTime;
