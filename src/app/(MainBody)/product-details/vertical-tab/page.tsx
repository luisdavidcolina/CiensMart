"use client";
import Breadcrumb from "@/views/Containers/Breadcrumb";
import LeftImagePage from "@/views/Products-Detail/leftImagePage";
import RelatedProducts from "@/views/Products-Detail/related products";
import VerticalTabProduct from "@/views/Products-Detail/vertical-tab-product";
import Layout1 from "@/views/layouts/layout1";
import { NextPage } from "next";

const VerticalTab: NextPage = () => {
  return (
    <div className="b-g-light">
      <Layout1>
        <Breadcrumb title="vertical tab" parent="product" />
        <section className="section-big-pt-space bg-light">
          <LeftImagePage />
        </section>
        <VerticalTabProduct />
        <RelatedProducts />
      </Layout1>
    </div>
  );
};

export default VerticalTab;
