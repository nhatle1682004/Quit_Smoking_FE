import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
// lay cai the co id la root. day chinh la diem render va quăng giao dien vao ben trong
// chay ham render cai component app: (code html va javaScript ) no se lay het nhung thang html ben trong cai app gan vao ben trong root
createRoot(document.getElementById("root")).render(
<>
    <App /> 
    <ToastContainer />
</>
);
//SPA: single page application
//client side rendering: thay doi nd ben trong trang web 
