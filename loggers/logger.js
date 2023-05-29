import { format, transports, createLogger, config } from "winston";
import "winston-daily-rotate-file";
import fs from "fs";

// Create logs directory if not exist
let dir = "./logs";

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const transport = new transports.DailyRotateFile({
  filename: "logs/%DATE%.log",
  datePattern: "YYYY-MM-DD",
  prepend: true,
  format: format.combine(
    format.colorize(),
    format.simple()
  )
});

const logger = createLogger({
  format: format.combine(format.timestamp(), format.json()),
  levels: config.npm.levels,
  transports: [transport],
  exitOnError: false,
});

export default logger;
