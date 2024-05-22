const express = require("express");
const app = express();
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const bodyParser = require("body-parser");
const router = require("./router/index");
app.use(express.static("public"));
app.use(
  cors({
    credentials: true,
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    optionsSuccessStatus: 200,
  }),
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const swaggerDocument = YAML.load("./swagger.yaml");

app.use("/", router);

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
