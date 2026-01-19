"use client";
import NewsLatter from "@/views/Containers/news-letter";
import Layout6Section from "@/views/layouts/layout6";
import Blog from "@/views/layouts/layout6/blog";
import CollectionBanner from "@/views/layouts/layout6/collectionBanner";
import Masonary from "@/views/layouts/layout6/masonaryBanner";
import ParallaxBanner from "@/views/layouts/layout6/parallaxBanner";
import PaymentOffer from "@/views/layouts/layout6/paymentOffer";
import Category from "@/views/layouts/layout6/roundedCategory";
import SliderBanner from "@/views/layouts/layout6/slider";
import TabProduct from "@/views/layouts/widgets/Tab-Product/Tab-Product2";
import Contact from "@/views/layouts/widgets/contact-us";
import Services from "@/views/layouts/widgets/services";
import TrendingOffer from "@/views/layouts/widgets/slider-product/slider-product2";
import { useEffect } from "react";

const Layout6 = () => {
  useEffect(() => {
    document.documentElement.classList.remove(localStorage.getItem("color")|| "''");
    localStorage.setItem("color", "color-6");
    document.documentElement.classList.add(localStorage.getItem("color")|| "''");
  }, []);
  return (
    <>
      <NewsLatter />
      <Layout6Section>
        <SliderBanner />
        <CollectionBanner />
        <Category />
        <section className="services services-inverse">
          <Services />
        </section>
        <PaymentOffer />
        <div className="ratio_square">
          <TrendingOffer type="vegetables" />
        </div>
        <Masonary />
        <TabProduct type={["vegetables"]} />
        <ParallaxBanner />
        <Blog />
        <Contact />
      </Layout6Section>
    </>
  );
};

export default Layout6;
