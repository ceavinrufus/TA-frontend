import SearchComponent from "./SearchComponent";

export const Hero = () => {
  return (
    <>
      <div className="absolute left-0 host-hero-background-image w-full h-[75vh]"></div>
      <section className="flex flex-col justify-end w-full h-[75vh] relative mx-auto py-28 text-left gap-10">
        <div className="">
          <h1 className="text-7xl">
            <span className="font-bold">Stay</span>Chain
          </h1>
          <p className="opacity-70 text-left text-xl mt-4">
            Your trusted blockchain-powered hotel booking platform.
            <br /> Start exploring amazing hotels and book with cryptocurrency!
          </p>
        </div>
        <SearchComponent />
      </section>
    </>
  );
};
