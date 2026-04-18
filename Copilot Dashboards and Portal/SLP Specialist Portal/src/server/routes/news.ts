import express from "express";
import { dbService } from "../db/database";
import { logger } from "../../utils/logger";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const news = dbService.getNewsItems();
    
    // If database is empty, return a helpful message or trigger a sync
    if (news.length === 0) {
      logger.info("[News API] No news in database, returning empty array.");
      return res.json([]);
    }

    res.json(news);
  } catch (error: any) {
    next(error);
  }
});

export default router;
