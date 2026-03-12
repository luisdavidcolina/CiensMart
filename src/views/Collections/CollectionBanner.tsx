import { NextPage } from "next";
import { Media } from "reactstrap";

const CollectionBanner: NextPage = () => (
  <div className="top-banner-wrapper">
    <a href="#">
      <Media src="/images/layout-5/collection-banner/1.jpg" className="img-fluid " alt="banner de coleccion" />
    </a>
    <div className="top-banner-content small-section">
      <h4>electronica</h4>
      <h5>Explora equipos destacados para tu hogar y oficina.</h5>
      <p>
        En esta coleccion encontraras laptops, tablets, refrigeradores y otros productos con buena relacion calidad-precio.
        Usa los filtros para depurar por categoria, marca y rango de precio y encuentra rapido lo que necesitas.
      </p>
    </div>
  </div>
);

export default CollectionBanner;
