"use client";
import dynamic from "next/dynamic";
import NewsLatter from "@/views/Containers/news-letter";
import Layout5Section from "@/views/layouts/layout5";
import CollectionBanner from "@/views/layouts/layout5/collectionBanner";
import SliderBanner from "@/views/layouts/layout5/slider";
import SpecialProduct from "@/views/layouts/widgets/slider-product/slider-product2";
import { useEffect } from "react";

const HotDeal = dynamic(() => import("@/views/layouts/layout1/hot-deal"));
const Blogs = dynamic(() => import("@/views/layouts/layout5/blog"));
const TabProduct = dynamic(() => import("@/views/layouts/widgets/Tab-Product/Tab-Product2"));
const Brand = dynamic(() => import("@/views/layouts/widgets/TopBrand"));
const Contact = dynamic(() => import("@/views/layouts/widgets/contact-us"));
const DealBanner = dynamic(() => import("@/views/layouts/widgets/dealBanner"));
const InstagramSection = dynamic(() => import("@/views/layouts/widgets/instagram/Instagram2"));
const RatioSquare = dynamic(() => import("@/views/layouts/widgets/ratio-square"));
const Category = dynamic(() => import("@/views/layouts/widgets/roundedCategory"));
const Services = dynamic(() => import("@/views/layouts/widgets/services"));
const Testimonial = dynamic(() => import("@/views/layouts/widgets/testimonial"));

const Layout5 = () => {
  useEffect(() => {
    document.documentElement.classList.remove(localStorage.getItem("color") || "''");
    localStorage.setItem("color", "color-5");
    document.documentElement.classList.add(localStorage.getItem("color") || "''");
  }, []);
  return (
    <>
      <NewsLatter />
      <Layout5Section>
        <SliderBanner />
        <div className="ratio_asos">
          <SpecialProduct type="electronics" />
        </div>
        <CollectionBanner />
        <section className="brand-panel">
          <div className="brand-panel-box bg-silver">
            <Brand />
          </div>
        </section>
        <section className="services services-inverse section-big-mb-space">
          <Services />
        </section>
        <div className="pt-3">
          <RatioSquare />
        </div>
        <section className="deal-banner deal-banner-inverse section-big-mt-space">
          <DealBanner />
        </section>
        <section className="rounded-category rounded-category-inverse">
          <Category />
        </section>
        <div className="section-pb-space">
          <TabProduct type={["electronics"]} />
        </div>
        <section className="testimonial testimonial-inverse section-mb-space">
          <Testimonial />
        </section>
        <HotDeal />
        <div className="tab-slider-sec">
          <Blogs />
        </div>
        <section className="instagram section-big-mt-space  section-big-py-space b-g-white">
          <InstagramSection />
        </section>
        <Contact />
      </Layout5Section>
    </>
  );
};

export default Layout5;
