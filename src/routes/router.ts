import { Router } from "express";
const router = Router();

import userinfo from "./user/userinfo";
router.use("/userinfo", userinfo);

export default router;