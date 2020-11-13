import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  autoClose: 4000,
  draggable: true,
  position: toast.POSITION.TOP_CENTER,
});

export const errorToast = (text) => toast.error(text);
export const msgSuccess = (text) => toast.success(text);
export const msgWarn = (text) => toast.warn(text);
