let searchMsgId;
let searchResult = [];
let searching = false;

// Getters an setters
const getSearchMsgId = () => {
  return searchMsgId;
};

const getSearchResult = () => {
  return searchResult;
};

const isSearching = () => {
  return searching;
};

const setSearching = (msgId, result) => {
  searchMsgId = msgId;
  searchResult = result;
  searching = true;
};

const resetSearching = () => {
  searchMsgId = null;
  searchResult = [];
  searching = false;
};

const getTrackFromNumber = (number) => {
  return searchResult[number - 1];
};

module.exports = {
  getSearchMsgId,
  getSearchResult,
  isSearching,
  setSearching,
  resetSearching,
  getTrackFromNumber,
};
