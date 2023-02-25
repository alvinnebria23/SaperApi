const ConvertionReportController = require("../controllers/ConvertionReportController");

const router = require("express").Router();

router.get(
  "/getConversionReport",
  ConvertionReportController.getConverstionReport
);

module.exports = router;
