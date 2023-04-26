export const getConversionReportQuery = (parameters, queryVariables) => {
  return `{
    conversionReport(${parameters}){ 
      ${queryVariables}
      pageInfo {
        hasNextPage
        scrollId
      }
    }
  }`;
};