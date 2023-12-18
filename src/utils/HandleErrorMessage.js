import { toast } from "react-toastify";

const showErrorMessage = (err) => {
  const error = err.response.data.Error;
  Object.entries(error).forEach(([key, values]) => {
    // console.log(`${key}: ${values.join(", ")}`);
    toast.error(`${values.join(", ")}`);
  });
};

const isErrorMessageEmpty = (err) => {
  return Object.keys(err.response.data.Error).length === 0;
};

export { showErrorMessage, isErrorMessageEmpty};
