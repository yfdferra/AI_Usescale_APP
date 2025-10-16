// const HOST = "http://localhost:5000";
const IS_PROD = process.env.NODE_ENV === "production";

const HOST = IS_PROD ? "" : "http://localhost:5000";

export default HOST;