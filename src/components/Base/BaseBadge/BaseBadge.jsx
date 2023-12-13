import React from "react";

export const BaseBadge = ({ bageName, variant, color, roundedPill, icon, style }) => {
  const className = `${roundedPill} badge bg-${
    variant === "outline" ? variant + "-" : ""
  }${color}${variant === undefined ? "" : "-" + variant}`;
  return (
    <span className={className} style={style}>
      <span>{icon}</span>
      {bageName}
    </span>
  );
};
