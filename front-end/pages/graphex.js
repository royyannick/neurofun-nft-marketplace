import { useQuery, gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
  {
    itemListeds(
      first: 5
    ) {
      id
      buyer
      seller
      nftAddress
      tokenId
      price
    }
  }
`;

export default function GraphEx() {
  const { loading, error, data } = useQuery(GET_ACTIVE_ITEMS);
  console.log(data);
  return <div>Hi!</div>;
}
