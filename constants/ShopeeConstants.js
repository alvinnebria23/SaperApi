export const SHOPEE_API_ENDPOINT = "https://open-api.affiliate.shopee.ph/graphql";

export const DASHBOARD_QUERY_VARIABLES = 
`nodes{
  totalCommission
  shopeeCommissionCapped
  sellerCommission
  utmContent
  orders{
    orderStatus
    items {
      itemPrice
      qty
      itemTotalCommission
    }
  }
}`;

export const CLICKTIME_QUERY_VARIABLES = `
nodes{
  clickTime
  totalCommission
}`;

export const SUBID_QUERY_VARIABLES = `
nodes{
  totalCommission
  utmContent
}`;