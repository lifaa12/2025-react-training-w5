import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect, useRef, useState } from "react";
import { Modal } from 'bootstrap';
import LoadingSpinner from "./components/LoadingSpinner";
import ProductModal from "./components/ProductModal";
import LoginPage from "./components/LoginPage";
import ProductPage from "./components/ProductPage";

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function App() {
  const [user, setUser] = useState({ username: "", password: "" });
  const [isAuth, setIsAuth] = useState(false);
  const [productList, setProductList] = useState([]);
  const [productDetail, setProductDetail] = useState({ imagesUrl: [] });
  const [productImgUrl, setProductImgUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({});
  const [loginMode, setLoginMode] = useState(false);

  const getProduct = async (page) => {
    try {
      const productRes = await axios.get(`${apiUrl}/v2/api/${apiPath}/products?page=${page}`);
      setPaginationData(productRes.data.pagination)
      setProductList(productRes.data.products);
    } catch (error) {
      console.log(error);
    };
  };
  const login = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${apiUrl}/v2/admin/signin`, user);
      const { expired, token } = res.data;
      document.cookie = `userToken = ${token}; expires = ${new Date(expired)}`;
      axios.defaults.headers.common['Authorization'] = token;
      loginCheck();
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        text: error.response.data.error.message,
        icon: "error"
      });
      setIsLoading(false);
    };
  };
  const loginCheck = async () => {
    try {
      const res = await axios.post(`${apiUrl}/v2/api/user/check`);
      Swal.fire({
        title: "歡迎回來！",
        icon: "success",
        showConfirmButton: false,
        timer: 1000
      });
      getProduct();
      setUser({ username: "", password: "" });
      setIsAuth(true);
      setIsLoading(false);
    } catch (error) {
      if (loginMode) {
        Swal.fire({
          title: error.response.data.message,
          icon: "error"
        });
      };
    };
  };

  const logOut = async () => {
    try {
      setIsLoading(true);
      setLoginMode(false);
      const res = await axios.post(`${apiUrl}/v2/logout`);
      Swal.fire({
        title: "您已成功登出！",
        icon: "success",
        showConfirmButton: false,
        timer: 1000
      });
      document.cookie = "userToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      delete axios.defaults.headers.common['Authorization'];
      setIsAuth(false);
      setProductDetail({});
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: "error"
      });
    };
  };

  // 詳細資訊
  const productModalRef = useRef(null);
  const productModalMethodRef = useRef(null);
  useEffect(() => {
    productModalMethodRef.current = new Modal(productModalRef.current)
  }, []);
  const detailModalOpen = () => {
    productModalMethodRef.current.show();
  };
  const detailModalClose = () => {
    productModalMethodRef.current.hide();
  };
  return (
    <>
      {isLoading && <LoadingSpinner />}
      {isAuth ? <ProductPage logOut={logOut} productList={productList} setProductDetail={setProductDetail} setProductImgUrl={setProductImgUrl} detailModalOpen={detailModalOpen} paginationData={paginationData} getProduct={getProduct} /> : <LoginPage LoadingSpinner={LoadingSpinner} login={login} isLoading={isLoading} user={user} setUser={setUser} loginCheck={loginCheck} setLoginMode={setLoginMode} />}
      <ProductModal productModalRef={productModalRef} productDetail={productDetail} detailModalClose={detailModalClose} productImgUrl={productImgUrl} setProductImgUrl={setProductImgUrl} />
    </>
  )
}

export default App
