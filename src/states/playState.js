let playMsgId;
let playing = false;

const getPlayMsgId = () => {
  return playMsgId;
};

const isPlaying = () => {
  return playing;
};

const setPlaying = (msgId) => {
  playMsgId = msgId;
  playing = true;
};

const resetPlaying = () => {
  playMsgId = null;
  playing = false;
};

module.exports = {
  getPlayMsgId,
  isPlaying,
  setPlaying,
  resetPlaying,
};
