import { ERROR, OK } from "../constants/HttpCodes.js";
import logger from "../loggers/logger.js";
import { countFreeUsers } from "../service/ShopeeApiService.js";
import { countRowsInMonth } from "../service/SubscriptionHistoryService.js";

const getAnalysis = async (req, res) => {
  try {
    const { targetMonth } = req.body;
    const freeUserCount = await countFreeUsers(targetMonth);
    const regularUserCount = await countRowsInMonth(targetMonth, "regular");
    const premiumUserCount = await countRowsInMonth(targetMonth, "premium");
    logger.info(`MONTH=${targetMonth} FREE=${freeUserCount} REGULAR=${regularUserCount} PREMIUM=${premiumUserCount}`);
    res.status(OK).json({ analysis: [freeUserCount, regularUserCount, premiumUserCount] });
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    res.status(ERROR).json({ success: false });
  }
};

export { getAnalysis };