const getPostTime = date => {
  const seconds = 10;
  const minute = seconds * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const postTime = new Date(date);
  let postedTime = Math.floor(
    (new Date().getTime() - postTime.getTime()) / 1000,
  );

  let postTimeText = '';
  if (postedTime < seconds) {
    postTimeText = '방금 전';
  } else if (postedTime < minute) {
    postTimeText = postedTime + '초 전';
  } else if (postedTime < hour) {
    postTimeText = Math.floor(postedTime / minute) + '분 전';
  } else if (postedTime < day) {
    postTimeText = Math.floor(postedTime / hour) + '시간 전';
  } else {
    postTimeText = Math.floor(postedTime / day) + '일 전';
  }

  return postTimeText;
};

export default getPostTime;
