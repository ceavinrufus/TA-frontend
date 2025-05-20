import SearchComponent from "./SearchComponent";

export const Hero = () => {
  return (
    <>
      <div className="absolute left-0 host-hero-background-image w-full h-[75vh]"></div>
      <section className="flex flex-col justify-end w-full h-[75vh] relative mx-auto py-10 md:py-28 text-left gap-5 md:gap-10 px-4 md:px-6">
        <div className="">
          <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl text-white">
            Trip, Anonymously.
          </h1>
          <p className="opacity-70 text-left text-base md:text-xl mt-2 md:mt-4 text-white">
            Your trusted ZKProof-powered hotel booking platform.
            <br className="hidden md:block" /> Start exploring amazing hotels
            and book with cryptocurrency!
          </p>
        </div>
        <SearchComponent />
      </section>
    </>
  );
};
