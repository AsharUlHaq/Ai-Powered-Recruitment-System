import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { z } from "zod";
import { ENV } from "./utils/env.util";
import { protect } from "./middleware/protect.middleware";
import { applicantRoutes } from "./modules/applicant/applicant.route";
import { positionRoutes } from "./modules/admin/positions/position.route";
import { authRoutes } from "./modules/auth/auth.route";
import { adminPortalApplicantRoutes } from "./modules/admin/applicants/applicants.route";
import { adminDashboardRoutes } from "./modules/admin/dashboard/dashboard.route";
import { userRoutes } from "./modules/user/user.route";

const app = express();
app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.get("/", protect, (req, res) => {
  console.log("HTTP METHOD - " + req.method + " URL - " + req.url);
  //@ts-ignore
  console.log(req.userId);

  return res.json({ message: "Authorization Completed" });
});

app.use(cors());
app.use(bodyParser.json());
app.use("/", applicantRoutes);
app.use("/", positionRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use("/", adminPortalApplicantRoutes);
app.use("/", adminDashboardRoutes);

app.listen(ENV.PORT, () => {
  console.log(`Application running at http://localhost:${ENV.PORT}`);
});
