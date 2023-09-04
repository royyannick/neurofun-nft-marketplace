import { gql } from '@apollo/client'

// Patch with itemListed but needs to bec activeItems. (otherwise you get ALL the listed, but coul be bought...)
const GET_ACTIVE_ITEMS = gql`
    {
      itemListeds(first: 20, orderBy: blockNumber, orderDirection: desc) {
        id
        nftAddress
        price
        seller
        tokenId
      }
    }
`

export default GET_ACTIVE_ITEMS
