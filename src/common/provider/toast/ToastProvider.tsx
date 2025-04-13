import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from './ToastProvider.module.css'

export default function ToastProvider() {
   return (
      <ToastContainer
         className={`${classes[`box-1`]}`}
         position="bottom-right"
         autoClose={5000}
         hideProgressBar
         newestOnTop={false}
         closeOnClick
         rtl={false}
         pauseOnFocusLoss
         draggable={false}
         pauseOnHover
         theme={`dark`}
      />
   );
}
