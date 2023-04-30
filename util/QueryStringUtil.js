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

export const getGenerateShortLinkQuery = (originalUrl, subIds) => {
  return `mutation{
    generateShortLink(input:{
      originUrl: "${originalUrl}",
      subIds:${JSON.stringify(subIds)}
    }){
      shortLink
    }
  }`;
}