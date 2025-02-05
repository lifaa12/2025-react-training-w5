import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";
import Swal from 'sweetalert2';

const apiUrl = import.meta.env.VITE_BASE_URL;
const apiPath = import.meta.env.VITE_API_PATH;

function EditProductModal({
  editProductRef,
  isLoading,
  setIsLoading,
  productEditModalClose,
  mode,
  productValue,
  setProductValue,
  getProduct
}) {

  const handleProductInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setProductValue({
      ...productValue,
      [name]: type === "checkbox" ? checked : value
    });
  };
  const handleProductImgInputChange = (e, idx) => {
    const imgArr = [...productValue.imagesUrl];
    imgArr[idx] = e.target.value;
    setProductValue({ ...productValue, imagesUrl: imgArr });
  };
  const productEdit_Add = async (id) => {
    try {
      setIsLoading(true);
      const url = mode === "edit" ? `${apiUrl}/v2/api/${apiPath}/admin/product/${id}` : `${apiUrl}/v2/api/${apiPath}/admin/product`;
      let res;
      if (mode === "edit") {
        res = await axios.put(url, {
          data: {
            ...productValue,
            origin_price: Number(productValue.origin_price),
            price: Number(productValue.price)
          }
        });
      } else {
        res = await axios.post(url, {
          data: {
            ...productValue,
            origin_price: Number(productValue.origin_price),
            price: Number(productValue.price),
          }
        });
      }
      getProduct();
      Swal.fire({
        title: mode === "edit" ? "修改完成！" : "新增成功！",
        icon: "success"
      });
      setIsLoading(false);
      productEditModalClose();
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error"
      });
      setIsLoading(false);
    };
  };
  return (
    <>
      <div className="modal fade" ref={editProductRef} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        {isLoading ? <LoadingSpinner /> : null}
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{mode === "edit" ? "編輯產品" : "新增產品"}</h5>
              <button type="button" className="btn-close" onClick={productEditModalClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {
                <form>
                  <div className="d-flex justify-content-between">
                    <div className="w-50 pe-1">
                      <div className="mb-3">
                        <label htmlFor="productTitle" className="form-label">品名</label>
                        <input type="text" className="form-control" id="productTitle" value={productValue.title} name="title" onChange={handleProductInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="productOriginPrice" className="form-label">原價</label>
                        <input type="number" className="form-control" min="0" id="productOriginPrice" value={productValue.origin_price} name="origin_price" onChange={handleProductInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="productContent" className="form-label">尺寸</label>
                        <input type="text" className="form-control" id="productContent" value={productValue.content} name="content" onChange={handleProductInputChange} />
                      </div>
                    </div>
                    <div className="w-50 ps-1">
                      <div className="mb-3">
                        <label htmlFor="productCategory" className="form-label">類別</label>
                        <input type="text" className="form-control" id="productCategory" value={productValue.category} name="category" onChange={handleProductInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="productPrice" className="form-label">售價</label>
                        <input type="number" className="form-control" min="0" id="productPrice" value={productValue.price} name="price" onChange={handleProductInputChange} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="productUnit" className="form-label">單位</label>
                        <input type="text" className="form-control" id="productUnit" value={productValue.unit} name="unit" onChange={handleProductInputChange} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productDescription" className="form-label">產品描述</label>
                    <textarea type="text" className="form-control" id="productDescription" value={productValue.description} name="description" onChange={handleProductInputChange} />
                  </div>
                  <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" checked={productValue.is_enabled ? true : false} name="is_enabled" onChange={handleProductInputChange} />
                    <label className="form-check-label" htmlFor="exampleCheck1">{productValue.is_enabled ? "啟用" : "未啟用"}</label>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productImageUrl" className="form-label">主圖網址</label>
                    <input type="text" className="form-control" id="productImageUrl" value={productValue.imageUrl} name="imageUrl" onChange={handleProductInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productImagesUrl1" className="form-label">副圖網址-1</label>
                    <input type="text" className="form-control" id="productImagesUrl1" value={productValue.imagesUrl[0] || ""} onChange={(e) => handleProductImgInputChange(e, 0)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productImagesUrl2" className="form-label">副圖網址-2</label>
                    <input type="text" className="form-control" id="productImagesUrl2" value={productValue.imagesUrl[1] || ""} onChange={(e) => handleProductImgInputChange(e, 1)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productImagesUrl3" className="form-label">副圖網址-3</label>
                    <input type="text" className="form-control" id="productImagesUrl3" value={productValue.imagesUrl[2] || ""} onChange={(e) => handleProductImgInputChange(e, 2)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productImagesUrl4" className="form-label">副圖網址-4</label>
                    <input type="text" className="form-control" id="productImagesUrl4" value={productValue.imagesUrl[3] || ""} onChange={(e) => handleProductImgInputChange(e, 3)} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="productImagesUrl5" className="form-label">副圖網址-5</label>
                    <input type="text" className="form-control" id="productImagesUrl5" value={productValue.imagesUrl[4] || ""} onChange={(e) => handleProductImgInputChange(e, 4)} />
                  </div>
                </form>
              }
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => productEdit_Add(productValue.id)}>{mode === "edit" ? "儲存" : "新增"}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditProductModal