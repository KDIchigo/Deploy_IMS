import { ColorPicker, theme } from "antd";
import React, { useMemo, useState } from "react";
import "./BaseColorPicker.scss";

export const BaseColorPicker = ({ formik, value }) => {
  // kiểm tra nếu value có dấu nháy kép đầu cuối thì loại bỏ
  if (value.startsWith('"') && value.endsWith('"')) {
    value = value.slice(1, -1);
  }
  // Loại bỏ các escape không cần thiết, bao gồm \\\\, \\r\\n, \\r, \\n, \\
  value = value
    .replace(/\\\\/g, '')
    .replace(/\\r\\n/g, '')
    .replace(/\\r/g, '')
    .replace(/\\n/g, '')
    .replace(/\\/g, '');

  const [colorHex, setColorHex] = useState(JSON.parse(value).color);
  const [formatHex, setFormatHex] = useState("hex");
  // const hexString = useMemo(
  //   () => (typeof colorHex === "string" ? colorHex : colorHex.toHexString()),
  //   [colorHex]
  // );

  const hsvToRgb = (h, s, v) => {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r, g, b;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
  };

  const rgbToHex = (r, g, b) => {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  };
  const color = { color: "" };
  const handleColor = (value) => {
    setColorHex(value);
    const { r, g, b } = hsvToRgb(
      value.metaColor.originalInput.h,
      value.metaColor.originalInput.s,
      value.metaColor.originalInput.v
    );
    const hexColor = rgbToHex(r, g, b);
    const newHexColor = { ...color, color: hexColor };
    console.log(newHexColor);
    formik.setFieldValue("style", JSON.stringify(newHexColor));
  };
  const [colorList, setColorList] = useState("#dfc872");
  const handleColorChange = (color, event) => {
    console.log("Selected color:", color);
  };

  return (
    <>
      <ColorPicker
        showText
        format={formatHex}
        value={colorHex}
        onChange={(e) => {
          handleColor(e);
        }}
        onFormatChange={setFormatHex}
      />
      <br />
      {/* <ColorPicker value={colorList} open={false} 
      onChange={handleColorChange}
      getPopupContainer={(triggerNode) => triggerNode.parentNod8e}/> */}
    </>
  );
};
