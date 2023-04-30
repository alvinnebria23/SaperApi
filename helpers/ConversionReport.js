import { ShopeeRequestCLient } from "../client/ShopeeRequestClient.js";
import { identifyErrorMessage } from "../helpers/ShopeeErrorRequest.js";
import { getConversionReportQuery } from "../util/QueryStringUtil.js";
const getConversionReport = async (appId, secretKey, parameters, queryVariables) => {
    let response;
    let conversionReportArray = [];
    let query = getConversionReportQuery(parameters, queryVariables);
    do{
      if(response?.data?.conversionReport?.pageInfo?.scrollId){
        query = getConversionReportQuery(`${parameters}, scrollId: "${response.data.conversionReport.pageInfo.scrollId}"`, queryVariables)
      }
      response = await ShopeeRequestCLient(appId, secretKey, query);
      if(response?.errors){
        return response;
      }
      if(response?.data?.conversionReport?.nodes){
        conversionReportArray = [ ...conversionReportArray, ...response.data.conversionReport.nodes];
      }
    }while(response?.data?.conversionReport?.pageInfo?.hasNextPage)
    return conversionReportArray;
};


const processDashboard = async (conversionReportArray) => {
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
    totalUnpaid,
    totalCompleted,
    totalPending,
    totalOrder,
  } = conversionReportArray.reduce((totals, conversionNode) => {
    totals.totalCommission += parseFloat(conversionNode.totalCommission);
    totals.totalShopeeCommission += parseFloat(conversionNode.shopeeCommissionCapped);
    totals.totalSellerCommission += parseFloat(conversionNode.sellerCommission);
    if(conversionNode.orders){
      for (const order of conversionNode.orders) {
        totals.totalOrder += order.items.length;
        for (const item of order.items) {
          item.itemTotalCommission = parseFloat(item.itemTotalCommission)
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
          }
          totals.totalAmountOrder += parseFloat(item.itemPrice) * item.qty;
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
    
    return { subId, totalCommission: total };
  });
  totalCommissionOfSubIds.sort((a, b) => b.totalCommission - a.totalCommission);
  const topFiveSubIds = totalCommissionOfSubIds.slice(0, 5).map(subId => {
    return {
      ...subId,
      totalCommission: subId.totalCommission
    };
  });
  return { totals: [
          { type: 'amount', id: 1, name: "Total Commission", value: totalCommission},
          { type: 'number', id: 2, name: "Total Order", value: totalOrder},
          { type: 'amount', id: 3, name: "Total Amount Order", value: totalAmountOrder},
          { type: 'amount', id: 4, name: "Shopee Commission", value: totalShopeeCommission},
          { type: 'amount', id: 5, name: "Seller Commission", value: totalSellerCommission},
          { type: 'amount', id: 6, name: "Unpaid", value: totalUnpaid},
          { type: 'amount', id: 7, name: "Completed", value: totalCompleted},
          { type: 'amount', id: 8, name: "Pending", value: totalPending},
      ], topFiveSubIds: topFiveSubIds, 
  };
};

const processSubid = async (conversionReportArray) => {
  if(conversionReportArray.errors){
    const errorObject =  identifyErrorMessage(conversionReportArray.errors[0]);
    return errorObject;
  }
  const result = [];
  let grandTotal = 0;
  let totalCommission = 0;
  let blankTotalCommission = 0;
  for(const outerNode of conversionReportArray){
    if(outerNode.utmContent === "----"){
      totalCommission += parseFloat(outerNode.totalCommission);
    }
  }
  for(const outerNode of conversionReportArray){
    grandTotal += parseFloat(outerNode.totalCommission);
    const { utmContent } = outerNode;
    if (utmContent !== "----"){
      const formattedUtmContent = utmContent.replace(/-{2,}/g, '');
      const subIds = formattedUtmContent.split('-');
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
    }else{
      blankTotalCommission += parseFloat(outerNode.totalCommission);
    }
  }
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
    const date = new Date(conversionNode.clickTime * 1000);
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
export { getConversionReport, processDashboard, processSubid, processClickTime };
