import axios from "axios";
import Pagination from "./Pagination";
import Swal from 'sweetalert2';
import { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import LoadingSpinner from "./LoadingSpinner";
import PayModal from "./payModal";
import CartList from "./CartList";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function ProductPage({
  logOut,
  productList,
  setProductDetail,
  setProductImgUrl,
  detailModalOpen,
  paginationData,
  getProduct
}) {
  const [cartPageLoading, setCartPageLoading] = useState(false);
  const [cartList, setCartList] = useState([]);
  const [addCartList, setAddCartList] = useState([]);
  const [cartTotal, setCartTotal] = useState("");
  const [cartQtyLoading, setCartQtyLoading] = useState(false);

  // 取得購物車
  const getCart = async () => {
    try {
      const cartRes = await axios.get(`${apiUrl}/v2/api/${apiPath}/cart`);
      setCartTotal(cartRes.data.data.final_total)
      setCartList(cartRes.data.data.carts);
    } catch (error) {
      console.log(error);
    };
  };
  useEffect(() => {
    getCart();
  }, []);

  // 加入購物車讀取圖示
  const addCartLoading = (cart) => {
    setAddCartList([
      ...addCartList, cart
    ]);
  };

  // 加入購物車
  const addCart = async (id) => {
    try {
      addCartLoading(id);
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      axios.defaults.headers.common['Authorization'] = token;
      await axios.post(`${apiUrl}/v2/api/${apiPath}/cart`, {
        "data": {
          "product_id": id,
          "qty": 1
        }
      });
      Toast.fire({
        text: "已成功加入購物車",
        icon: "success"
      });
      getCart();
    } catch (error) {
      console.log(error);

      Swal.fire({
        text: error.response.data.message,
        icon: "error"
      });
    } finally {
      setAddCartList(addCartList.filter((item) => item !== cart));
    };
  };


  // 結帳modal
  const payModalRef = useRef(null);
  const payModalMethodRef = useRef(null);
  useEffect(() => {
    payModalMethodRef.current = new Modal(payModalRef.current, {
      backdrop: 'static'
    });
  }, []);
  const payModalOpen = () => {
    payModalMethodRef.current.show();
  };
  const payModalClose = () => {
    payModalMethodRef.current.hide();
  };

  return (
    <>
      {cartPageLoading && <LoadingSpinner />}
      <PayModal payModalRef={payModalRef} payModalClose={payModalClose} setCartPageLoading={setCartPageLoading} getCart={getCart} />
      <div className="container py-5">
        <button type="button" className="btn btn-primary me-3" onClick={logOut}>登出</button>
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">編號</th>
              <th scope="col">照片</th>
              <th scope="col">品名</th>
              <th scope="col">類別</th>
              <th scope="col">售價</th>
              <th scope="col">操作</th>
            </tr>
          </thead>
          <tbody >
            {
              productList.map((item, idx) => {
                return (
                  <tr key={item.id}>
                    <th scope="row">{idx + 1}</th>
                    <td><img className="product-sm-img" src={item.imageUrl} alt="product" onClick={() => { setProductDetail(item), setProductImgUrl(item.imageUrl), detailModalOpen() }} /></td>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td><span className="text-decoration-line-through">{item.origin_price.toLocaleString()}</span><br />{item.price.toLocaleString()}</td>
                    <td>
                      <button type="button" className="btn btn-info me-3" onClick={() => { setProductDetail(item), setProductImgUrl(item.imageUrl), detailModalOpen() }}>詳細資訊</button>
                      <button disabled={addCartList.includes(item.id)} type="button" className="btn btn-success" onClick={() => addCart(item.id)} >{addCartList.includes(item.id) && <span className="me-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}加入購物車</button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
        {cartList.length === 0 ? <h3 className="text-center fw-bold">購物車目前是空的，趕緊去選購！</h3> : <CartList cartList={cartList} cartQtyLoading={cartQtyLoading} setCartQtyLoading={setCartQtyLoading} getCart={getCart} Toast={Toast} cartTotal={cartTotal} payModalOpen={payModalOpen} setCartPageLoading={setCartPageLoading} />}
      </div>
      <Pagination paginationData={paginationData} getProduct={getProduct} />
    </>
  )
}
export default ProductPage