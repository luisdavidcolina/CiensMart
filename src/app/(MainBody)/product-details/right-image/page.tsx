"use client";
import Breadcrumb from "@/views/Containers/Breadcrumb";
import RelatedProducts from "@/views/Products-Detail/related products";
import RightImagePage from "@/views/Products-Detail/rightImageImage";
import TabProduct from "@/views/Products-Detail/tab-product";
import Layout1 from "@/views/layouts/layout1";
import { NextPage } from "next";

const RightImage: NextPage = () => {
  return (
    <div className="b-g-light">
      <Layout1>
        <Breadcrumb title="right image" parent="product" />
        <section className="section-big-pt-space bg-light">
          <RightImagePage />
        </section>
        <div className="custom-container">
          <TabProduct />
        </div>
        <RelatedProducts />
      </Layout1>
    </div>
  );
};

export default RightImage;
