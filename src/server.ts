import app from "./app";
import dbInit from "./db";
const main = () => {
  dbInit();
  app.listen(5000, () => {
    console.log(`Server running at http://localhost:${5000}`);
  });
};

main();
