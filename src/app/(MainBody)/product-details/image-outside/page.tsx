"use client";
import Breadcrumb from "@/views/Containers/Breadcrumb";
import ImageOutsidePage from "@/views/Products-Detail/ImageOutsidePage";
import RelatedProducts from "@/views/Products-Detail/related products";
import TabProduct from "@/views/Products-Detail/tab-product";
import Layout1 from "@/views/layouts/layout1";
import { NextPage } from "next";

const ImageOutside: NextPage = () => {
  return (
    <div className="b-g-light">
      <Layout1>
        <Breadcrumb parent="product" title="Image outside" />
        <section className="section-big-pt-space bg-light">
          <ImageOutsidePage />
        </section>
        <div className="custom-container">
          <TabProduct />
        </div>
        <RelatedProducts />
      </Layout1>
    </div>
  );
};

export default ImageOutside;
