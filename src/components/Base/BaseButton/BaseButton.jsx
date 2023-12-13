import React from "react";

export const BaseButton = ({
  color,
  disabled,
  variant,
  onClick,
  value,
  nameTitle,
  icon,
  loading,
  type,
  style,
  isIconLeft,
}) => {
  const className = `${nameTitle} btn btn-wave waves-effect waves-light btn-${
    variant === "outline" ? variant + "-" : ""
  }${color}${variant === "light" ? "-" + variant : ""}`;
  return (
    <>
      <button type={type} onClick={onClick} className={className} loading={loading} disabled={disabled} style={style}>
        {isIconLeft ? <span>{icon}</span> : ""} {value} {isIconLeft ? "" : <span>{icon}</span>}
      </button>
    </>
  );
};
