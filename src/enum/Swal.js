import Swal from "sweetalert2";

const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: "btn btn-success",
    cancelButton: "btn btn-danger me-2",
  },
  buttonsStyling: false,
});

export { swalWithBootstrapButtons };