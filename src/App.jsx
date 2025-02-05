import axios from "axios";
import Swal from 'sweetalert2';
import { useEffect, useRef, useState } from "react";
import { Modal } from 'bootstrap';
import LoadingSpinner from "./components/LoadingSpinner";
import EditProductModal from "./components/EditProductModal";
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

  const getProduct = async (page) => {
    try {
      const productRes = await axios.get(`${apiUrl}/v2/api/${apiPath}/admin/products?page=${page}`);
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
        icon: "success"
      });
      getProduct();
      setUser({ username: "", password: "" });
      setIsAuth(true);
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: "error"
      });
    };
  };
  const logOut = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(`${apiUrl}/v2/logout`);
      Swal.fire({
        title: "您已成功登出！",
        icon: "success"
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

  // 新增產品/編輯
  const editProductRef = useRef(null);
  const editProductMethodRef = useRef(null);
  useEffect(() => {
    editProductMethodRef.current = new Modal(editProductRef.current)
  }, []);
  const productEditModalOpen = () => {
    editProductMethodRef.current.show();
  };
  const productEditModalClose = () => {
    editProductMethodRef.current.hide();
  };
  const [mode, setMode] = useState("");
  const [productValue, setProductValue] = useState({
    title: "",
    origin_price: "",
    content: "",
    category: "",
    price: "",
    unit: "",
    description: "",
    is_enabled: "",
    imageUrl: "",
    imagesUrl: []
  });


  // 刪除產品
  const productDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "確定要刪除此項產品嗎？",
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "取消"
      })
      if (result.isConfirmed) {
        setIsLoading(true);
        await axios.delete(`${apiUrl}/v2/api/${apiPath}/admin/product/${id}`);
        getProduct();
        Swal.fire({
          title: "刪除成功！",
          icon: "success"
        });
      };
      setIsLoading(false);
    } catch (error) {
      Swal.fire({
        title: error.response.data.message,
        icon: "error"
      });
      setIsLoading(false);
    };
  };

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}
      {isAuth ? <ProductPage logOut={logOut} setMode={setMode} setProductValue={setProductValue} productEditModalOpen={productEditModalOpen} productList={productList} setProductDetail={setProductDetail} setProductImgUrl={setProductImgUrl} detailModalOpen={detailModalOpen} productDelete={productDelete} paginationData={paginationData} getProduct={getProduct} /> : <LoginPage LoadingSpinner={LoadingSpinner} login={login} isLoading={isLoading} user={user} setUser={setUser} />}
      <ProductModal productModalRef={productModalRef} productDetail={productDetail} detailModalClose={detailModalClose} productImgUrl={productImgUrl} setProductImgUrl={setProductImgUrl} />
      <EditProductModal editProductRef={editProductRef} isLoading={isLoading}
        setIsLoading={setIsLoading} productEditModalClose={productEditModalClose} mode={mode} productValue={productValue} setProductValue={setProductValue} getProduct={getProduct} />
    </>
  )
}

export default App
