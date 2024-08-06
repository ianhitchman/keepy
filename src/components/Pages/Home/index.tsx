import CreateNew from "./CreateNew";
import MasonryCards from "./MasonryCards";
import data from "../../../json/cardData.json";

const Home = () => {
  return (
    <>
      <MasonryCards data={data} />
      <CreateNew />
    </>
  );
};

export default Home;
