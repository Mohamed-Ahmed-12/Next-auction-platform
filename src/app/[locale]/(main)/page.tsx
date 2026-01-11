import Auctions from "@/components/auction/Auctions";
import Categories from "@/components/auction/Categories"
import NavBar from "@/components/common/Header";
import Hero from "@/components/home/Hero";
import TrustedBy from "@/components/home/TrustedBy";
import WhyChooseUs from "@/components/home/WhyChooseUs";
export default function Home() {
  return (
      <div className="container mx-auto px-4 sm:max-w-screen-sm md:max-w-3xl lg:max-w-5xl xl:max-w-7xl">
        <Hero />
        <Categories />
        <Auctions status={'live'} />
        <Auctions status={'upcoming'} />
        <Auctions status={'ended'} />
        <TrustedBy />
        <WhyChooseUs />
      </div>
  );
}
