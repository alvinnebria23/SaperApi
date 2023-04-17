import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { identifyErrorMessage } from "../helpers/ShopeeErrorRequest.js";
const getConversionReport = async (appId, secretKey, parameters) => {
    let response;
    let conversionReportArray = [];
    let query = getConversionReportQuery(parameters);
    do{
      if(response?.data?.conversionReport?.pageInfo?.scrollId){
        query = getConversionReportQuery(`${parameters}, scrollId: "${response.data.conversionReport.pageInfo.scrollId}"`)
      }
      response = await ShopeeRequestCLient(appId, secretKey, query);
      if(response?.errors){
        return response.errors;
      }
      if(response?.data?.conversionReport?.nodes){
        conversionReportArray = [ ...conversionReportArray, ...response.data.conversionReport.nodes];
      }
    }while(response?.data?.conversionReport?.pageInfo?.hasNextPage)
    return conversionReportArray;
};

const getConversionReportQuery = (parameters) => {
  return `{
    conversionReport(${parameters}){ 
      nodes{
        totalCommission
        totalBrandCommission
        shopeeCommissionCapped
        cappedCommission
        sellerCommission
        purchaseTime
        utmContent
        orders{
          items {
            itemPrice
            itemTotalCommission
            displayItemStatus
            itemShopeeCommissionRate
            itemSellerCommissionRate
            qty
          }
        }
      }
      pageInfo {
        hasNextPage
        scrollId
      }
    }
  }`;
};

const processDashboard = async (conversionReportArray) => {
  if(conversionReportArray.errors){
    const errorObject =  identifyErrorMessage(conversionReportArray.errors[0]);
    return errorObject;
  }
  const uniqueSubIds = [...new Set(conversionReportArray.map(conversionNode => conversionNode.utmContent))];
  const {
    totalCommission,
    totalAmountOrder,
    totalShopeeCommission,
    totalSellerCommission,
    totalUnpaid,
    totalCompleted,
    totalPending,
    totalOrder,
  } = conversionReportArray.reduce((totals, conversionNode) => {
    totals.totalShopeeCommission += parseFloat(conversionNode.shopeeCommissionCapped);
    totals.totalSellerCommission += parseFloat(conversionNode.sellerCommission);
  
    if(conversionNode.orders){
      for (const order of conversionNode.orders) {
        totals.totalOrder += order.items.length;
        
        for (const item of order.items) {
          totals.totalCommission += parseFloat(item.itemTotalCommission);
          totals.totalAmountOrder += parseFloat(item.itemPrice) * item.qty;
    
          switch (item.displayItemStatus) {
            case "UNPAID":
              totals.totalUnpaid += parseFloat(item.itemTotalCommission);
              break;
            case "COMPLETED":
              totals.totalCompleted += parseFloat(item.itemTotalCommission);
              break;
            case "PENDING":
              totals.totalPending += parseFloat(item.itemTotalCommission);
              break;
          }
        }
      }
    }
    return totals;
  }, { totalCommission: 0, totalAmountOrder: 0, totalShopeeCommission: 0, totalSellerCommission: 0, totalUnpaid: 0, totalCompleted: 0, totalPending: 0,  totalOrder: 0});
  const totalCommissionOfSubIds = uniqueSubIds.map((subId) => {
    const total = conversionReportArray.reduce((sum, conversionNode) => {
      if (conversionNode.utmContent === subId) {
        sum += parseFloat(conversionNode.totalCommission);
      }
      return sum;
    }, 0);
    
    return { subId, totalCommission: Math.round(total) };
  });
  totalCommissionOfSubIds.sort((a, b) => b.totalCommission - a.totalCommission);
  const topFiveSubIds = totalCommissionOfSubIds.slice(0, 5).map(subId => {
    return {
      ...subId,
      totalCommission: subId.totalCommission.toLocaleString()
    };
  });
  return { overAllTotal: [
          { type: 'amount', id: 1, name: "Total Commission", value: parseInt(totalCommission).toLocaleString()},
          { type: 'number', id: 2, name: "Total Order", value: totalOrder.toLocaleString()},
          { type: 'amount', id: 3, name: "Total Amount Order", value: parseInt(totalAmountOrder).toLocaleString()},
          { type: 'amount', id: 4, name: "Shopee Commission", value: parseInt(totalShopeeCommission).toLocaleString()},
          { type: 'amount', id: 5, name: "Seller Commission", value: parseInt(totalSellerCommission).toLocaleString()},
          { type: 'amount', id: 6, name: "Unpaid", value: parseInt(totalUnpaid).toLocaleString()},
          { type: 'amount', id: 7, name: "Completed", value: parseInt(totalCompleted).toLocaleString()},
          { type: 'amount', id: 8, name: "Pending", value: parseInt(totalPending).toLocaleString()},
      ], topFiveSubIds: topFiveSubIds, 
  };
};

const processConversion = async (conversionReportArray) => {
  const result = [];
  conversionReportArray.forEach(node => {
    const utmContent = node.utmContent.replace(/-{2,}/g, '');
    const path = utmContent.split('-');
    let currentNode = result;
  
    path.forEach(part => {
      let existingNode = currentNode.find(n => n.name === part);
      if (!existingNode) {
        const newNode = {
          name: part,
          id:  part,
          children: []
        };
        currentNode.push(newNode);
        currentNode = newNode.children;
      } else {
        currentNode = existingNode.children;
      }
    });
  });
  return result;
};

export { getConversionReport, getConversionReportQuery, processDashboard, processConversion };
