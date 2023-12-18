import {
  CloseOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Carousel, Modal, Tooltip, Tour } from "antd";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useFormik } from "formik";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Input } from "reactstrap";
import { axiosClient } from "src/axios/AxiosClient";
import { BaseButton } from "src/components/Base/BaseButton/BaseButton";
import { BaseInputField } from "src/components/Base/BaseInputField/BaseInputField";
import { BaseSelectInput } from "src/components/Base/BaseSelectInput/BaseSelectInput";
import { ModalCmpt } from "src/components/Modal/ModalCmpt";
import { swalWithBootstrapButtons } from "src/enum/swal";
import { imageDb } from "src/utils/Config";
import * as Yup from "yup";
import ChangePassword from "../ChangePassword/ChangePassword";
import "./FormProfile.scss";
import { v4 } from "uuid";
import { showErrorMessage } from "src/utils/HandleErrorMessage";

export const FormProfile = ({ user, roles, userId }) => {
  const [loadingData, setLoadingData] = useState(false);
  const [imageSrc, setImageSrc] = useState(
    `${user.avatar === null ? "/src/images/user_none_img.jpg" : user.avatar}`
  );
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalChangePass, setModalChangePass] = useState(false);

  const [img, setImg] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const toggle = () => {
    setModal(!modal);
  };
  const toggleChangePass = () => {
    setModalChangePass(!modalChangePass);
  };
  const steps = [
    {
      title: "Take User Gitlab Id",
      description: (
        <span>
          <b>Step 1:</b> Go to Edit Profile
          <br />
          <b>Step 2:</b> Take User ID
        </span>
      ),
      cover: (
        <img
          alt="EditProfile.png"
          src="/src/images/UserGitlabId/EditProfile.png"
        />
      ),
      target: null,
    },
    {
      title: "Take User Gitlab Id",
      description: (
        <span>
          <b>Step 2:</b> Take User ID
        </span>
      ),
      cover: <img alt="UserID.png" src="/src/images/UserGitlabId/UserID.png" />,
      target: null,
    },
    {
      title: "Input",
      description: (
        <span>
          <b>Step 3:</b> Input User ID
        </span>
      ),
      target: () => ref2.current,
    },
  ];

  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    setImg(file);
    const formData = new FormData();
    formData.append("file", file);
    // const { data } = await axiosClient.post("/your-upload-endpoint", formData);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const blob = new Blob([e.target.result], { type: file.type });
        setImageSrc(URL.createObjectURL(blob)); // Set the blob as the source for an <img> element
        setFile(file);
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const handleUploadFirebase = async (value) => {
    let avatarUrl = "";
    const imgRef = ref(imageDb, `files/${v4()}`);
    try {
      // Upload the image
      await uploadBytes(imgRef, value);

      // Get the download URL
      const url = await getDownloadURL(imgRef);

      // Set the image source and log the URL
      setImageSrc(url);
      // console.log("Download URL:", url);

      // Return the URL if needed
      return url;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      // Handle the error as needed
    }
  };
  const handleClick = () => {
    if (img !== null) {
      const imgRef = ref(imageDb, `files/${v4()}`);
      uploadBytes(imgRef, img).then((value) => {
        getDownloadURL(value.ref).then((url) => {
          setImgUrl(url);
          console.log(url);
        });
      });
    }
  };

  const inputRef = useRef(null);
  const formik = useFormik({
    initialValues: {
      ...user,
    },
    validationSchema: Yup.object({
      fullname: Yup.string()
        .required("Fullname is required")
        .min(4, "Must be 4 characters or more"),
      email: Yup.string()
        .required("Email is required")
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Please enter a valid email address"
        ),
      phone_number: Yup.string()
        .nullable()
        .test(
          "is-valid-postal-code",
          "Phone must be a valid phone number and have 10 digits",
          function (value) {
            if (value && value.trim() !== null) {
              const postalCodePattern =
                /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
              if (!postalCodePattern.test(value)) {
                return false; // Validation failed
              }
            }
            return true;
          }
        ),
    }),
    onSubmit: async (values) => {
      swalWithBootstrapButtons
        .fire({
          title: "Are you sure?",
          text: "Are you sure to update user?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, update it!",
          cancelButtonText: "No, cancel!",
          reverseButtons: true,
        })
        .then(async (result) => {
          // console.log(result);
          if (result.isConfirmed) {
            setLoadingData(true);
            handleUploadFirebase(img).then(async (url) => {
              // Do something with the URL if needed
              // console.log("Returned URL:", url);
              const newUser = { ...values, avatar: url };
              const { data, err } = await axiosClient.put(
                `/User/${userId}`,
                newUser
              );
              if (err) {
                // toast.error("Update user profile fail!");
                showErrorMessage(err);
                const imageRef = ref(imageDb, url);
                await deleteObject(imageRef);
                setLoadingData(false);
                return;
              } else {
                toast.success("Update user successfully!");
                setLoadingData(false);
              }
            });
          }
        });
      // const { data, err } = await axiosClient.put(`/User/${userId}`, values);
      // window.alert("Form submitted");
      // if (err) {
      //   window.alert("Update fail!");
      // } else {
      //   window.alert("Update success!");
      // }
      // console.log(values);
    },
  });

  const contentStyle = {
    color: "#fff",
    width: "100%",
    textAlign: "center",
    background: "#364d79",
    margin: "0",
  };

  const customNextArrow = (onClickHandler, hasPrev, hasNext) => (
    <Button
      type="primary"
      shape="circle"
      icon={<RightOutlined style={{ color: "red" }} />}
      onClick={onClickHandler}
      style={{
        position: "absolute",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
      }}
    />
  );
  return (
    <form
      className="d-flex flex-column flexGrow_1"
      onSubmit={formik.handleSubmit}
    >
      <div className="row">
        <div
          className="col-md-5 col-sm-12 px-3"
          style={{ borderRight: "1px solid #f3f3f3" }}
        >
          <h3 className="text-center mb-4">{formik.values.fullname}</h3>
          <Avatar
            className="mx-auto d-block mb-5"
            size={132}
            icon={
              <img
                // src={imgUrl === "" ? imageSrc : imgUrl}
                src={imageSrc}
                alt="Selected Image"
              />
            }
          />
          {/* <UploadFile /> */}
          <Input
            className="w-75 mx-auto d-block"
            id="exampleFile"
            ref={inputRef}
            name="file"
            type="file"
            onChange={handleFileChange}
          />
          {/* <input type="file" onChange={(e) => setImg(e.target.files[0])} /> */}
          {/* <button onClick={handleClick}>Upload</button> */}
          {/* <img src={imgUrl} height="200px" width="200px" /> */}
          <br />
          {/* {imageSrc && (
          <div>
            <img src={imageSrc} alt="Selected Image" />
          </div>
        )}
         */}
          {/* {console.log(imageSrc)} */}
        </div>

        <div
          className="col-md-7 col-sm-12 px-3 d-flex flex-column"
          style={loadingData ? { pointerEvents: "none" } : {}}
        >
          <h3>General Information</h3>
          <div className="row d-flex flex-column">
            <div className="col-md-12 col-sm-12">
              <BaseInputField
                type="text"
                id="fullname"
                name="fullname"
                label="Full name"
                placeholder="Enter Full name"
                onBlur={formik.handleBlur}
                value={formik.values.fullname}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.fullname && formik.touched.fullname
                    ? "is-invalid"
                    : ""
                }
                important="true"
              />
              {formik.errors.fullname && formik.touched.fullname ? (
                <p className="errorMsg"> {formik.errors.fullname} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-12 col-sm-12">
              <BaseInputField
                type="text"
                id="email"
                name="email"
                label="Email"
                placeholder="Enter Email"
                value={formik.values.email}
                onBlur={formik.handleBlur}
                readOnly={true}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.email && formik.touched.email
                    ? "is-invalid"
                    : ""
                }
                important="true"
              />
              {formik.errors.email && formik.touched.email ? (
                <p className="errorMsg"> {formik.errors.email} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-12 col-sm-12">
              <BaseInputField
                type="text"
                id="phone_number"
                label="Phone"
                placeholder="Enter Phone"
                onBlur={formik.handleBlur}
                value={formik.values.phone_number}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.phone_number && formik.touched.phone_number
                    ? "is-invalid"
                    : ""
                }
              />
              {formik.errors.phone_number && formik.touched.phone_number ? (
                <p className="errorMsg"> {formik.errors.phone_number} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <div className="col-md-12 col-sm-12">
              <BaseInputField
                type="text"
                id="user_convert_id"
                label="User Gitlab ID"
                refInput={ref2}
                iconLabel={
                  <>
                    {/* <Tooltip title="How to use?" placement="top" size="large">
                      <QuestionCircleOutlined
                        onClick={() => setOpen(true)}
                        ref={ref1}
                      />
                    </Tooltip> */}
                    <Tooltip
                      title="How to use?"
                      placement="top"
                      size="large"
                      className="ms-2"
                    >
                      <QuestionCircleOutlined onClick={toggle} />
                    </Tooltip>
                    <Modal
                      className="modalCarousel"
                      open={modal}
                      onOk={toggle}
                      onCancel={toggle}
                      style={{ minWidth: 1000 }}
                      closeIcon={
                        <CloseOutlined
                          onClick={toggle}
                          style={{ color: "#ffffff" }}
                        />
                      } // Customize the close icon color
                      footer={false}
                      centered
                    >
                      <Carousel nextArrow={customNextArrow} autoplay>
                        <div>
                          <img
                            alt="EditProfile.png"
                            style={contentStyle}
                            src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2FUserGitlabId%2FAvatar.png?alt=media&token=6a9e4f09-c11a-4ca7-b85d-95a14be2b668"
                          />
                        </div>
                        <div>
                          <img
                            alt="EditProfile.png"
                            style={contentStyle}
                            src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2FUserGitlabId%2FEditProfile.png?alt=media&token=3e723839-618f-4459-b9ca-f784b7a46b86"
                          />
                        </div>
                        <div>
                          <img
                            alt="EditProfile.png"
                            style={contentStyle}
                            src="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2FUserGitlabId%2FUserID.png?alt=media&token=d7a7c91a-c7a3-42a4-b885-54b2702fd7ff"
                          />
                        </div>
                      </Carousel>
                    </Modal>
                  </>
                }
                placeholder="Enter User Gitlab Id"
                onBlur={formik.handleBlur}
                value={formik.values.user_convert_id}
                onChange={formik.handleChange}
                classNameInput={
                  formik.errors.user_convert_id &&
                  formik.touched.user_convert_id
                    ? "is-invalid"
                    : ""
                }
              />
              {formik.errors.user_convert_id &&
              formik.touched.user_convert_id ? (
                <p className="errorMsg"> {formik.errors.user_convert_id} </p>
              ) : (
                <p className="hiddenMsg">acb</p>
              )}
            </div>
            <Tour
              open={open}
              onClose={() => setOpen(false)}
              steps={steps}
              indicatorsRender={(current, total) => (
                <span>
                  {current + 1} / {total}
                </span>
              )}
            />
            <div className="col-md-12 col-sm-12">
              <BaseSelectInput
                label="Role"
                id="setting_id"
                type="setting"
                classNameDiv="col-md-12 col-sm-12"
                defaultValue={formik.values.setting_value}
                options={roles}
                onChange={formik.handleChange}
                user={user}
                important="true"
                formik={formik}
                disabled={true}
              />
            </div>
          </div>
          <div>
            <ModalCmpt
              classNameBtn="btn btn-light btn-wave waves-effect waves-light px-5 mt-5 my-auto"
              btnToggle="Change Password"
              isAnchor={false}
              variant="outline"
              isFooter={false}
              isHeader={false}
              modalBody={<ChangePassword />}
              isImage={true}
              imgSrc="https://firebasestorage.googleapis.com/v0/b/imsavatar-31182.appspot.com/o/files%2FSyncImageIMS%2Flogo2.png?alt=media&token=b4ff3656-1aba-482f-a1cd-ccc61885a5ea"
              size="md"
              type="button"
              toggle={toggleChangePass}
              modal={modalChangePass}
              isBtn={true}
            />
            {loadingData ? (
              <BaseButton
                type="submit"
                nameTitle="float-right mt-5 btnLoadingProfile"
                color="secondary"
                icon={<LoadingOutlined />}
                disabled={true}
              />
            ) : (
              <BaseButton
                type="submit"
                nameTitle="float-right mt-5"
                value="Update"
                color="secondary"
              />
            )}
          </div>
          {/* <BaseButton
          nameTitle="float-right me-3 mt-5"
          value="Cancel"
          color="dark"
        /> */}
        </div>
      </div>
    </form>
  );
};
