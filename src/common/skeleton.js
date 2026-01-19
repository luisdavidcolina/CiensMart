import { Col, Row } from "reactstrap";
import PostLoader from "./postLoader";
export const Skeleton = (props) => {
  return (
    <Row>
      <Col>
        <div className="product-box">
          <div className="img-wrapper"></div>
          <PostLoader />
        </div>
      </Col>
      <Col>
        <div className="product-box">
          <div className="img-wrapper"></div>
          <PostLoader />
        </div>
      </Col>
      <Col>
        <div className="product-box">
          <div className="img-wrapper"></div>
          <PostLoader />
        </div>
      </Col>
      <Col>
        <div className="product-box">
          <div className="img-wrapper"></div>
          <PostLoader />
        </div>
      </Col>
      <Col>
        <div className="product-box">
          <div className="img-wrapper"></div>
          <PostLoader />
        </div>
      </Col>
      <Col>
        <div className="product-box">
          <div className="img-wrapper"></div>
          <PostLoader />
        </div>
      </Col>
    </Row>
  );
};
