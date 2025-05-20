import SearchComponent from "./SearchComponent";

export const Hero = () => {
  return (
    <>
      <div className="absolute left-0 host-hero-background-image w-full h-[75vh]"></div>
      <section className="flex flex-col justify-end w-full h-[75vh] relative mx-auto py-10 md:py-28 text-left gap-5 md:gap-10 px-4 md:px-6">
        <div className="">
          <h1 className="text-5xl md:text-6xl lg:text-7xl">
            <span className="font-bold">Trip</span>Anon
          </h1>
          <p className="opacity-70 text-left text-base md:text-xl mt-2 md:mt-4">
            Your trusted blockchain-powered hotel booking platform.
            <br className="hidden md:block" /> Start exploring amazing hotels
            and book with cryptocurrency!
          </p>
        </div>
        <SearchComponent />
      </section>
    </>
  );
};
