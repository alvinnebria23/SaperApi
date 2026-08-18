import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { identifyErrorMessage } from "../helpers/ShopeeErrorRequest.js";
import logger from "../loggers/logger.js";
import { getConversionReportQuery } from "../util/QueryStringUtil.js";
const getConversionReport = async (appId, secretKey, parameters, queryVariables) => {
    let response;
    let conversionReportArray = [];
    let query = getConversionReportQuery(parameters, queryVariables);
    let scrollId = "";
    do{
      if(response?.data?.conversionReport?.pageInfo?.scrollId){
        query = getConversionReportQuery(`${parameters}, scrollId: "${response.data.conversionReport.pageInfo.scrollId}"`, queryVariables)
        scrollId = response.data.conversionReport.pageInfo.scrollId;
      }
      response = await ShopeeRequestCLient(appId, secretKey, query);
      if(response?.errors){
        const { code, message, path } = response.errors[0].extensions;
        if(code === 10020){
          return { fail: true, message: 'App Id and Secret key is invalid or does not match.' };
        }else if(code === 10030 || message.includes("scrollId")){
          response = {
            data: {
              conversionReport: {
                pageInfo:{
                  hasNextPage: true,
                  scrollId: scrollId
                }
              }
            }
          }
          await new Promise(resolve => setTimeout(resolve, 500));
        } else if(code === 11000){
          return { fail: true, message: 'Please reset your secret key and input your new secret key to the Account tab.'}
        } else {
          logger.error(`
          CODE=${code} APPID=${appId} SECRETKEY=${secretKey} 
          path=${path}
          message=${message}`);
          return { fail: true, message: 'There was an error. Please try again later.'};
        }
      }
      if(response?.data?.conversionReport?.nodes?.length){
        conversionReportArray = conversionReportArray.concat(response.data.conversionReport.nodes);
      }
    }while(response?.data?.conversionReport?.pageInfo?.hasNextPage)
    return conversionReportArray;
};


const 
processDashboard = async (conversionReportArray) => {
  if(!conversionReportArray.length){
    return { totals: [] };
  }
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
    totalCancelled,
    totalUnpaid,
    totalCompleted,
    totalPending,
    totalOrder,
    totalCompletedSoldItems
  } = conversionReportArray.reduce((totals, conversionNode) => {
    totals.totalCommission += parseFloat(conversionNode.totalCommission);
    totals.totalShopeeCommission += parseFloat(conversionNode.shopeeCommissionCapped);
    totals.totalSellerCommission += parseFloat(conversionNode.sellerCommission);
    totals.totalOrder += conversionNode.orders.length;
    if(conversionNode.orders){
      for (const order of conversionNode.orders) {
        for (const item of order.items) {
          totals.totalAmountOrder += parseFloat(item.actualAmount);
          item.itemTotalCommission = parseFloat(item.itemTotalCommission);
          switch (order.orderStatus) {
            case "UNPAID":
              totals.totalUnpaid += item.itemTotalCommission;
              break;
            case "COMPLETED":
              totals.totalCompleted += item.itemTotalCommission;
              break;
            case "PENDING":
              totals.totalPending += item.itemTotalCommission;
              break;
            case "CANCELLED":
              item.actualAmount = parseFloat(item.actualAmount);
              const sellerCommission = (parseInt(item.itemSellerCommissionRate)/100) * item.actualAmount;
              const shopeeCommission = (parseInt(item.itemShopeeCommissionRate)/100) * item.actualAmount;
              const cancelledCommission = sellerCommission + shopeeCommission;
              totals.totalCancelled += cancelledCommission;
              break;
          }
          if(item.displayItemStatus === "COMPLETED"){
            totals.totalCompletedSoldItems++;
          }
        }
      }
    }
    return totals;
  }, { 
    totalCommission: 0, 
    totalAmountOrder: 0, 
    totalSellerCommission: 0, 
    totalShopeeCommission: 0, 
    totalCancelled: 0, 
    totalUnpaid: 0, 
    totalCompleted: 0, 
    totalPending: 0,  
    totalOrder: 0,
    totalCompletedSoldItems: 0
  });
  const totalNumberOfOrdersOfSubIds = uniqueSubIds.map((subId) => {
    const total = conversionReportArray.reduce((sum, conversionNode) => {
      if (conversionNode.utmContent === subId) {
        sum++;
      }
      return sum;
    }, 0);
    
    return { subId, totalNumberOfOrders: total };
  });
  totalNumberOfOrdersOfSubIds.sort((a, b) => b.totalNumberOfOrders - a.totalNumberOfOrders);
  const topFiveSubIds = totalNumberOfOrdersOfSubIds.slice(0, 5).map(subId => {
    return {
      ...subId,
      totalNumberOfOrders: subId.totalNumberOfOrders
    };
  });

  let notYetPaidPercentage = totalUnpaid ? (totalUnpaid / totalCommission) * 100 : 0;
  let inProcessPercentage = totalPending ? (totalPending / totalCommission) * 100 : 0;
  let completedPercentage = totalCompleted ? (totalCompleted / totalCommission) * 100 : 0;

  notYetPaidPercentage = parseFloat(notYetPaidPercentage.toFixed(2));
  inProcessPercentage = parseFloat(inProcessPercentage.toFixed(2));
  completedPercentage = parseFloat(completedPercentage.toFixed(2));
  
  return { totals: [
          { type: 'amount', id: 1, name: "Total Amount Order", value: roundUpIfDecimal(totalAmountOrder)},
          { type: 'number', id: 2, name: "Total Order", value: totalOrder},
          { type: 'number', id: 3, name: "Completed Sold Items", value: totalCompletedSoldItems},
          { type: 'amount', id: 4, name: "Cancelled", value: totalCancelled},
          { type: 'amount', id: 5, name: "Seller Commission", value: totalSellerCommission},
          { type: 'amount', id: 6, name: "Shopee Commission", value: totalShopeeCommission},
          { type: 'amount', id: 7, name: "Total Commission", value: totalCommission},
          { type: 'amount', id: 8, name: "In Process", value: totalPending, percentage: inProcessPercentage},
          { type: 'amount', id: 9, name: "Completed", value: totalCompleted, percentage: completedPercentage},
          { type: 'amount', id: 10, name: "Not Yet Paid", value: totalUnpaid, percentage: notYetPaidPercentage},
      ], topFiveSubIds: topFiveSubIds, 
  };
};

const processSubid = async (conversionReportArray) => {
  if(conversionReportArray.errors){
    const errorObject =  identifyErrorMessage(conversionReportArray.errors[0]);
    return errorObject;
  }
  const result = [];
  const utmContentArray = [];
  let grandTotal = 0;
  let totalCommission = 0;
  let blankTotalCommission = 0;

  for(const node of conversionReportArray){
    grandTotal += parseFloat(node.totalCommission);
    let { utmContent } = node;
    if(utmContent !== "----"){
      utmContent = utmContent.replace(/-{2,}/g, '');
      utmContentArray.push(utmContent);
    }else{
      blankTotalCommission += parseFloat(node.totalCommission);
    }
  }

  utmContentArray.forEach((utmContent) => {
    let subIds = utmContent.split("-");
    let currentNode = result;
    let outerIndex = 0;
    for(let subId of subIds){

      totalCommission = 0;
      for(const innerNode of conversionReportArray){
        if(innerNode.utmContent.includes(subId)){
          const subIdArray = innerNode.utmContent.split("-");
          subIdArray.map((subIdItem, innerIndex) => {
            if(subIdItem === subId && outerIndex === innerIndex){
              totalCommission += parseFloat(innerNode.totalCommission);
            }
          })
        }
      }
      let existingNode = currentNode.find(n => n.name === subId);
      if (!existingNode) {
        const newNode = {
          name: subId,
          id:  subId,
          totalCommission: totalCommission,
          level: outerIndex + 1,
          children: []
        };
        currentNode.push(newNode);
        currentNode = newNode.children;
      } else {
        currentNode.totalCommission += totalCommission;
        currentNode = existingNode.children;
      }
      outerIndex++;
    }
  });
  const blank = { 
    name: "(blank)",
    id: "(blank)",
    level: 0, 
    totalCommission: blankTotalCommission
  };
  result.push(blank);
  return  { conversionReport: { conversionReport: result, grandTotal: grandTotal }};
};

const processClickTime = async (conversionReportArray) => {
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if(conversionReportArray.errors){
    const errorObject =  identifyErrorMessage(conversionReportArray.errors[0]);
    return errorObject;
  }
  conversionReportArray.sort((a, b) => a.clickTime - b.clickTime);
  const result = [];
  let grandTotal = 0;
  for(const conversionNode of conversionReportArray){
    let currentNode = result;
    conversionNode.totalCommission = parseFloat(conversionNode.totalCommission);
    const date = new Date((conversionNode.clickTime + 8 * 60 * 60)  * 1000);
    const monthName = MONTHS[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const amOrPm = hours >= 12 ? 'PM' : 'AM';

    const clickTimeBySection = [
      MONTHS[date.getMonth()],
      `${day}-${monthName}`,
      `${hours % 12 || 12}${amOrPm}`,
      date.getMinutes().toString(),
    ];

    for(const [index, section] of clickTimeBySection.entries()){
      const existingNode = currentNode.find(n => n.name === section); 
      if(!existingNode){
        const newNode = {
          name:section,
          id: section,
          totalCommission: conversionNode.totalCommission,
          children: []
        };
        currentNode.push(newNode);
        currentNode = newNode.children;
      } else {
        if(index === 3){
          existingNode.totalCommission += conversionNode.totalCommission;
        }
        currentNode = existingNode.children;
      }
    }
  }
  for (let monthNode of result) {
    for (let dateNode of monthNode.children) {
      for (let timeNode of dateNode.children) {
        timeNode.totalCommission = calculateTotalCommission(timeNode);
      }
      dateNode.totalCommission = calculateTotalCommission(dateNode);
    }
    monthNode.totalCommission = calculateTotalCommission(monthNode);
    grandTotal += monthNode.totalCommission;
  }
  return  { conversionReport: { conversionReport: result, grandTotal: grandTotal }};
}
const calculateTotalCommission = (node) => {
  let totalCommission = 0;
  for (let child of node.children) {
    totalCommission += child.totalCommission;
  }
  return totalCommission;
}

const roundUpIfDecimal = (value) => {
  const decimalPart = value - Math.floor(value);
  return decimalPart >= 0.5 ? Math.ceil(value) : value;
}
export { getConversionReport, processDashboard, processSubid, processClickTime };
