import { Badge } from "antd";
import React from "react";

export const ClassStatus = ({ status }) => {
  return (
    <>
      {status === 1 ? (
        <div className="position-relative">
          <span className="position-absolute top-50 start-0 ms-3 translate-middle-y p-1 bg-success border border-light rounded-circle"></span>
          <span className="ms-2 text-success">Started</span>
        </div>
      ) : (
        ""
      )}
      {status === 0 ? (
        <div className="position-relative">
          <span className="position-absolute top-50 start-0 ms-3 translate-middle-y p-1 bg-danger border border-light rounded-circle"></span>
          <span className="ms-2 text-danger">Cancelled</span>
        </div>
      ) : (
        ""
      )}

      {status === 2 ? (
        <div className="position-relative">
          <span className="position-absolute top-50 start-0 ms-3 pending_color translate-middle-y p-1 bg_pending border border-light rounded-circle"></span>
          <span className="ms-3 text_pending">Pending</span>
        </div>
      ) : (
        ""
      )}
    </>
  );
};
