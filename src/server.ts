import app from "./app";
import { dbInit } from "./db";
import config from "./config/dotenv";

const main = () => {
  dbInit();

  const PORT = process.env.PORT || config.port || 5000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

main();
