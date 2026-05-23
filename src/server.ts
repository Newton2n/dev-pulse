import app from "./app";
import { dbInit } from "./db";

const main = () => {
  //data base init
  dbInit();

  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

main();
