const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");

dayjs.extend(utc);
const defaultType = "YYYY-MM-DD";
const formatDate = (time, type = defaultType) => {
  return dayjs.utc(time).format(type);
};

module.exports = {
  formatDate,
};
