import express from "express";
import pdfRoutes from "./routes/pdf.route.js";
import helmet from "helmet";
import cors from "cors";
import { PORT } from "./utils/constants.js";
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", pdfRoutes);

app.get("/", (req, res) => {
  req.session.isAuth = true;
  console.log("req.sess ", req.session);
  res.json("Hellow set the session");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
