export const getArtistUri = totalUri => {
  const exp = 'spotify:artist:';
  const startIndex = totalUri.indexOf(exp); //album id 값 parse , 실패하면 -1반환
  const artistUri = totalUri.substring(startIndex + exp.length);
  return artistUri;
};
