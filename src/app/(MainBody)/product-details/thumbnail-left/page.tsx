"use client";
import Breadcrumb from "@/views/Containers/Breadcrumb";
import RelatedProducts from "@/views/Products-Detail/related products";
import ThumbnailLeftPage from "@/views/Products-Detail/thumbnailLeftPage";
import Layout1 from "@/views/layouts/layout1";
import { NextPage } from "next";

const ThumbnailLeft: NextPage = () => {
  return (
    <div className="b-g-light">
      <Layout1>
        <Breadcrumb title="Thumbnail Left" parent="product" />
        <section className="section-big-pt-space bg-light">
          <ThumbnailLeftPage />
        </section>
        <RelatedProducts />
      </Layout1>
    </div>
  );
};

export default ThumbnailLeft;