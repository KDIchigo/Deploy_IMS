import { Button } from "@mui/material";
import React from "react";
import { BaseButton } from "../Base/BaseButton/BaseButton";

export const Card = ({
  cardHead,
  cardBody,
  classNameCard,
  screen,
  closeBtnLabel,
  closeBtnColor,
  confirmBtnLabel,
  confirmBtnColor,
  isFooter,
}) => {
  return (
    <div className={classNameCard}>
      <div className="card custom-card mb-0 flexGrow_1">
        {cardHead !== undefined ? (
          <div className="card-header">
            <div className="card-title">
              {screen === true ? <h2>{cardHead}</h2> : cardHead}
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="card-body">{cardBody}</div>
        {isFooter === true ? (
          <div className="card-footer py-1">
            <BaseButton
              nameTitle="float-right me-3"
              value={confirmBtnLabel}
              color={confirmBtnColor}
            />
            <BaseButton
              nameTitle="float-right me-3"
              value={closeBtnLabel}
              color={closeBtnColor}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};
