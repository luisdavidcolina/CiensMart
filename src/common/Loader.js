/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useState } from "react";

const Loader = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const delay = Number(props?.delay ?? 0);
    if (delay > 0) {
      const timer = setTimeout(function () {
        setIsLoading(false);
      }, delay);
      return () => clearTimeout(timer);
    }
    setIsLoading(false);
  }, []);
  return (
    <Fragment>
      {isLoading ? (
        <div className="loader-wrapper">
          <div>
            <img src="/images/loader.gif" alt="loader"/>
          </div>
        </div>
      ) : (
        props.children
      )}
    </Fragment>
  );
};

export default Loader;
