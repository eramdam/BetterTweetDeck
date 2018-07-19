
function parseSnowFlake(SnowFlake){
  //Old SnowFlake:under 10 digits is not contain any data of date.
  if(SnowFlake < 10000000000) return;
  //(val >> 22) + Standard Time
  var unixTime = Math.floor(parseInt(SnowFlake) / 4194304) + 1288834974657;
  return new Date(unixTime);
}

export default parseSnowFlake;
