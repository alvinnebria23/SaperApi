export const SHOPEE_API_ENDPOINT = "https://open-api.affiliate.shopee.ph/graphql";

export const DASHBOARD_QUERY_VARIABLES = 
`nodes{
  totalCommission
  shopeeCommissionCapped
  sellerCommission
  utmContent
  purchaseTime
  orders{
    orderStatus
    items {
      itemPrice
      qty
      itemTotalCommission
      actualAmount
      itemSellerCommissionRate
      itemShopeeCommissionRate
      displayItemStatus
    }
  }
}`;

export const CLICKTIME_QUERY_VARIABLES = `
nodes{
  clickTime
  totalCommission
  conversionId
  purchaseTime
}`;

export const SUBID_QUERY_VARIABLES = `
nodes{
  totalCommission
  utmContent
  purchaseTime
}`;