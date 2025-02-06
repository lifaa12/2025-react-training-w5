import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import axios from "axios";

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function PayModal({
  payModalRef,
  payModalClose,
  setCartPageLoading,
  getCart
}) {
  // 結帳表單
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: 'onChange'
  });
  const onSubmit = (data) => {
    const { text, ...payData } = data;
    payRequest(payData, text)
  };

  // 結帳
  const payRequest = async (userData, message) => {
    try {
      setCartPageLoading(true);
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)userToken\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      axios.defaults.headers.common['Authorization'] = token;
      const payRes = await axios.post(`${apiUrl}/v2/api/${apiPath}/order`, {
        "data": {
          "user": userData,
          "message": message
        }
      });
      Swal.fire({
        title: "已成功送出訂單",
        text: `訂單編號：${payRes.data.orderId}`,
        icon: "success"
      });
      getCart();
      payModalClose();
      reset();
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
      <div className="modal fade" ref={payModalRef} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">請輸入配送資訊</h5>
              <button type="button" className="btn-close" onClick={payModalClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="name" name="name"  {...register('name', {
                    required: "必填",
                    pattern: {
                      value: /^[^\d]*$/,
                      message: "姓名格式不符"
                    }
                  })} />
                  <label htmlFor="name">姓名</label>
                  <div className="text-danger mt-1">{errors.name ? errors.name.message : ""}</div>
                </div>
                <div className="form-floating mb-3">
                  <input type="email" className="form-control" id="email" name="email"  {...register('email', {
                    required: "必填",
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "Email格式不符"
                    }
                  })} />
                  <label htmlFor="email">Email</label>
                  <div className="text-danger mt-1">{errors.email ? errors.email.message : ""}</div>
                </div>
                <div className="form-floating mb-3">
                  <input type="tel" className="form-control" id="tel" name="tel"  {...register('tel', {
                    required: "必填",
                    pattern: {
                      value: /^\d{9,}$/,
                      message: "電話格式不符"
                    }
                  })} />
                  <label htmlFor="name">電話</label>
                  <div className="text-danger mt-1">{errors.tel ? errors.tel.message : ""}</div>
                </div>
                <div className="form-floating mb-3">
                  <input type="text" className="form-control" id="address" name="address"  {...register('address', {
                    required: "必填",
                    pattern: {
                      value: /^(?=.*[市縣])(?=.*號).*$/,
                      message: "地址格式不符"
                    }
                  })} />
                  <label htmlFor="name">地址</label>
                  <div className="text-danger mt-1">{errors.address ? errors.address.message : ""}</div>
                </div>
                <div className="form-floating mb-3">
                  <textarea style={{ height: "200px", resize: "none" }} type="text" className="form-control" id="text" name="text"  {...register('text')} />
                  <label htmlFor="name">備註</label>
                </div>
                <div className="d-flex justify-content-end mt-5">
                  <button type="submit" className="btn btn-danger">送出</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayModal;