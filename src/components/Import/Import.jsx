import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ToastContainer } from "react-toastify";
import { axiosClient } from "src/axios/AxiosClient";
import { NavbarDashboard } from "src/components/NavbarDashboard/NavbarDashboard";

export const Import = ({ importBody }) => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [classObj, setClassObj] = useState(false);

  const fetchData = async () => {
    const { data } = await axiosClient.get(`Class/${classId}`);
    setClassObj(data);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <ToastContainer autoClose="2000" theme="colored" />
      <NavbarDashboard
        position="project"
        spin={true}
        dashboardBody={
          <Box className="box w-100 d-flex flex-column flexGrow_1">
            <div className="card custom-card mb-0 flexGrow_1">
              <div className="card-body d-flex flex-column">
                <div className="row">{importBody}</div>
              </div>
            </div>
          </Box>
        }
      />
    </>
  );
};
