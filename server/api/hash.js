import MD5 from "crypto-js/md5";
import SHA256 from "crypto-js/sha256";
export default defineEventHandler((event) => {
  let { text = "" } = getQuery(event);
  return {
    staus: 200,
    mss: "success",
    result1: MD5(text).toString(),
    result2: SHA256(text).toString(),
  };
});
