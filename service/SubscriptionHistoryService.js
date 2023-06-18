import { Op } from "sequelize";
import logger from "../loggers/logger.js";
import db from "../models/index.js";
const SubscriptionHistory = db.subscriptionHistory;

const insertSubscriptionHistory = async (userId, type) => {
  try {
    await SubscriptionHistory.create({
      userId,
      type
    });
    return;
  } catch (error) {
    logger.error("ERROR MESSAGE: " + error?.message);
    throw error;
  }
};

const countRowsInMonth = async (targetMonth, type) => {
  const count = await SubscriptionHistory.count({
    where: {
      [Op.and]: [
        db.sequelize.where(db.sequelize.fn('MONTH', db.sequelize.col('createdAt')), targetMonth),
        { type: type },
      ],
    },
  });
  return count;
};

export { insertSubscriptionHistory, countRowsInMonth };
