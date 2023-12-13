import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { ConfigProvider, Switch } from "antd";
import React, { useState } from "react";

export const BaseInputField = ({
  type,
  label,
  iconLabel,
  value,
  placeholder,
  classNameInput,
  important,
  icon,
  onClick,
  random,
  setRandom,
  isRandom,
  onChange,
  id,
  readOnly,
  onBlur,
  refInput,
}) => {
  const classNameInputTemp = `form-control ${classNameInput} ${
    readOnly ? "disable" : ""
  }`;
  const [inputType, setInputType] = useState(type);
  return (
    <>
      <div className="input-group">
        <label htmlFor="input-placeholder" className="form-label ">
          {label} {iconLabel}
          {important === "true" ? (
            <span className="ms-1" style={{ color: "red" }}>
              *
            </span>
          ) : (
            ""
          )}
        </label>
        {type === "password" && isRandom === true ? (
          <>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#ec8550f0",
                },
              }}
            >
              <Switch
                checkedChildren="Random"
                unCheckedChildren="Input"
                defaultChecked={random}
                onChange={() => setRandom(!random)}
                style={{
                  borderRadius: "50px",
                }}
              />
            </ConfigProvider>

            {/* <BaseButton color="warning" variant="outline" value="Random"/> */}
          </>
        ) : (
          ""
        )}
        <div className="input-group">
          {icon === undefined ? (
            ""
          ) : (
            <span className="input-group-text" id="basic-addon1">
              {icon}
            </span>
          )}
          <input
            type={inputType}
            id={id}
            ref={refInput}
            className={classNameInputTemp}
            placeholder={placeholder}
            value={value}
            onClick={onClick}
            style={{ borderRadius: "4px" }}
            onChange={onChange}
            readOnly={readOnly}
            onBlur={onBlur}
          />
          {type === "password" ? (
            <span className="input-group-text">
              {inputType === "password" ? (
                <EyeInvisibleOutlined
                  id="togglePassword"
                  onClick={() => {
                    {
                      setInputType("text");
                    }
                  }}
                />
              ) : (
                <EyeOutlined
                  id="togglePassword"
                  onClick={() => {
                    {
                      setInputType("password");
                    }
                  }}
                />
              )}
            </span>
          ) : (
            ""
          )}
        </div>

        {/* <div className={tooltip}>{tooltipName}</div> */}
      </div>
    </>
  );
};
