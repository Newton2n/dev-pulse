import app from "./app";

const main = () => {
  app.listen(5000, () => {
    console.log(`Server running at http://localhost:${5000}`);
  });
};

main();
