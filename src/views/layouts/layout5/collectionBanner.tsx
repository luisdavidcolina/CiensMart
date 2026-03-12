import React from "react";
import { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";

const Collectionbanner = [
  { img: "/images/layout-5/collection-banner/1.jpg", title: "Portatil", subtitle: "Tendencia", btn: "Comprar ahora", category: "ELECTRONICS" },
  { img: "/images/layout-5/collection-banner/2.jpg", title: "Refrigerador", subtitle: "Especial", btn: "Comprar ahora", category: "ELECTRONICS" },
  { img: "/images/layout-5/collection-banner/3.jpg", title: "Tablet", subtitle: "Nueva generacion", btn: "Comprar ahora", category: "ELECTRONICS" },
];

const CollectionBanner: NextPage = () => {
  return (
    <>
      <section className="collection-banner section-py-space bg-white">
        <div className="container-fluid">
          <div className="row collection2">
            {Collectionbanner.map((data, i) => (
              <div className="col-md-4" key={i}>
                <div className="collection-banner-main p-right banner-9">
                  <div className="collection-img">
                    <Image
                      src={data.img}
                      className="img-fluid bg-img"
                      alt="banner"
                      width={900}
                      height={650}
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="collection-banner-contain">
                    <div>
                      <h3>{data.title}</h3>
                      <h4>{data.subtitle}</h4>
                      <div className="shop">
                        <Link
                          href={{
                            pathname: "/collections/leftsidebar/",
                            query: {
                              category: data.category,
                            },
                          }}>
                          {data.btn}
                          <i className="fa fa-arrow-circle-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CollectionBanner;
