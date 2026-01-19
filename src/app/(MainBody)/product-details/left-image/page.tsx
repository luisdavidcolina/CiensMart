"use client";
import Breadcrumb from "@/views/Containers/Breadcrumb";
import LeftImagePage from "@/views/Products-Detail/leftImagePage";
import RelatedProducts from "@/views/Products-Detail/related products";
import TabProduct from "@/views/Products-Detail/tab-product";
import Layout1 from "@/views/layouts/layout1";
import { NextPage } from "next";

const LeftImage: NextPage = () => {
  return (
    <div className="b-g-light">
      <Layout1>
        <Breadcrumb title="left image" parent="product" />
        <section className="section-big-pt-space bg-light">
          <LeftImagePage />
        </section>
        <div className="custom-container">
          <TabProduct />
        </div>
        <RelatedProducts />
      </Layout1>
    </div>
  );
};

export default LeftImage;
