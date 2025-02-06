import axios from "axios";
import Swal from 'sweetalert2';


const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function CartList({
  cartList,
  cartQtyLoading,
  setCartQtyLoading,
  getCart,
  Toast,
  cartTotal,
  payModalOpen,
  setCartPageLoading
}) {
  // 修改商品數量
  const updateCartQty = async (id, qty) => {
    try {
      setCartQtyLoading(true);
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      axios.defaults.headers.common['Authorization'] = token;
      await axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${id}`, {
        "data": {
          "product_id": id,
          "qty": qty
        }
      });
      getCart();
      Toast.fire({
        text: "已成功更新數量",
        icon: "success"
      });
    } catch (error) {
      console.log(error);
    } finally {
      setCartQtyLoading(false);
    }
  };
  // 刪除單一購物車
  const deleteCartItem = async (id) => {
    try {
      const result = await Swal.fire({
        title: "確定要從購物車移除此項商品嗎？",
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "取消"
      })
      if (result.isConfirmed) {
        setCartPageLoading(true);
        await axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${id}`);
        getCart();
        Swal.fire({
          title: "已成功移除此項商品",
          icon: "success",
          showConfirmButton: false,
          timer: 1000
        });
      };
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error"
      });
    } finally {
      setCartPageLoading(false);
    };
  };

  // 刪除購物車
  const deleteCart = async () => {
    try {
      const result = await Swal.fire({
        title: "確定要清空購物車內全部商品嗎？",
        showCancelButton: true,
        confirmButtonText: "確認",
        cancelButtonText: "取消"
      })
      if (result.isConfirmed) {
        setCartPageLoading(true);
        await axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`);
        getCart();
        Swal.fire({
          title: "已成功清空購物車",
          icon: "success",
          showConfirmButton: false,
          timer: 1000
        });
      };
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error"
      });
    } finally {
      setCartPageLoading(false);
    };
  };
  return (
    <>
      <h3 className="my-5 fw-bold text-center">購物車</h3>
      <div className="row d-flex justify-content-center">
        <div className="col-8">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">編號</th>
                <th scope="col">品名</th>
                <th scope="col">售價</th>
                <th scope="col">數量</th>
                <th scope="col">小計</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {
                cartList.map((item, idx) => {
                  return (
                    <tr key={item.id} className="align-middle">
                      <th scope="row">{idx + 1}</th>
                      <td>{item.product.title}</td>
                      <td>{item.product.price.toLocaleString()}</td>
                      <td>
                        <div className="btn-group" role="group" aria-label="Basic outlined example">
                          <button type="button" className="btn btn-outline-dark" onClick={() => updateCartQty(item.id, item.qty - 1)} disabled={cartQtyLoading || item.qty == 1}>-</button>
                          <span className="btn border border-dark" style={{ cursor: "auto" }}>{item.qty}</span>
                          <button type="button" className="btn btn-outline-dark" onClick={() => updateCartQty(item.id, item.qty + 1)} disabled={cartQtyLoading}>+</button>
                        </div>
                      </td>
                      <td>{item.final_total.toLocaleString()}</td>
                      <td><button type="button" className="btn btn-danger" onClick={() => deleteCartItem(item.id)}>刪除</button></td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
          <div className="d-flex justify-content-center align-items-center">
            <h3 className="mb-0">總金額：{cartTotal.toLocaleString()}</h3>
            <button type="button" className="ms-3 btn btn-danger" onClick={deleteCart}>清空購物車</button>
            <button type="button" className="ms-3 btn btn-warning" onClick={payModalOpen} >結帳</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartList;