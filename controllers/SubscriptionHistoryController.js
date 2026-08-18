import { ERROR, OK } from "../constants/HttpCodes.js";
import logger from "../loggers/logger.js";
import { countAllUsers, countUsersByType } from "../service/ShopeeApiService.js";
import { countRowsInMonth } from "../service/SubscriptionHistoryService.js";

const getAnalysis = async (req, res) => {
  try {
    const { targetMonth } = req.body;
    const freeUserCount = await countUsersByType("free");
    const trialUserCount = await countUsersByType("trial");
    const regularUserCount = await countRowsInMonth(targetMonth, "regular");
    const premiumUserCount = await countRowsInMonth(targetMonth, "premium");
    const overallUserCount = await countAllUsers();
    logger.info(`MONTH=${targetMonth} TRIAL=${trialUserCount} FREE=${freeUserCount} REGULAR=${regularUserCount} PREMIUM=${premiumUserCount}`);
    res.status(OK).json({ analysis: [trialUserCount, freeUserCount, regularUserCount, premiumUserCount], overAll: overallUserCount });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

export { getAnalysis };