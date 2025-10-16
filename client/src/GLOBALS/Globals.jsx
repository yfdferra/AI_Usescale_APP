// const HOST = "http://localhost:5000";
const HOST =
  import.meta.env.PROD
    ? ""                // in Heroku, use same domain
    : "http://localhost:5000";  // in local dev, use Flask

export default HOST;