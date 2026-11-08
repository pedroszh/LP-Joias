import { MotionConfig } from "motion/react";
import { CartDrawer } from "./components/CartDrawer";
import { Header } from "./components/Header";
import { SearchOverlay } from "./components/SearchOverlay";
import { Toast } from "./components/Toast";
import { StoreProvider } from "./context/StoreContext";
import { About } from "./sections/About";
import { Campaign } from "./sections/Campaign";
import { Collections } from "./sections/Collections";
import { Film } from "./sections/Film";
import { Footer } from "./sections/Footer";
import { GemStories } from "./sections/GemStories";
import { Hero } from "./sections/Hero";
import { Intro } from "./sections/Intro";
import { NewArrivals } from "./sections/NewArrivals";
import { Shop } from "./sections/Shop";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <StoreProvider>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-3 focus:text-ivory"
        >
          Pular para o conteúdo
        </a>
        <Header />
        <main id="conteudo">
          <Hero />
          <Intro />
          <GemStories />
          <Collections />
          <Shop />
          <Film />
          <Campaign />
          <NewArrivals />
          <About />
        </main>
        <Footer />
        <CartDrawer />
        <SearchOverlay />
        <Toast />
      </StoreProvider>
    </MotionConfig>
  );
}
