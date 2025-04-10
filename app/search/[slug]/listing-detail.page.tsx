import ListingDetails from "../components/ListingDetails";

const ListingDetailPage = ({ slug }: { slug: string }) => {
  return (
    <div>
      <ListingDetails slug={slug} />
    </div>
  );
};

export default ListingDetailPage;
