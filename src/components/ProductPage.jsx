import Pagination from "./Pagination";

function ProductPage({
  logOut,
  setMode,
  setProductValue,
  productEditModalOpen,
  productList,
  setProductDetail,
  setProductImgUrl,
  detailModalOpen,
  productDelete,
  paginationData,
  getProduct
}) {
  return (
    <>
      <div className="container py-5">
        <button type="button" className="btn btn-primary me-3" onClick={logOut}>登出</button>
        <button type="button" className="btn btn-success" onClick={() => {
          setMode("add");
          setProductValue({
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
          })
          productEditModalOpen();
        }} >新增產品</button>
        <div className="container">
          <table className="table table-hover">
            <thead>
              <tr>
                <th scope="col">編號</th>
                <th scope="col">品名</th>
                <th scope="col">類別</th>
                <th scope="col">原價</th>
                <th scope="col">售價</th>
                <th scope="col">狀態</th>
                <th scope="col">操作</th>
              </tr>
            </thead>
            {
              productList.map((item, idx) => {
                return (
                  <tbody key={item.id}>
                    <tr>
                      <th scope="row">{idx + 1}</th>
                      <td>{item.title}</td>
                      <td>{item.category}</td>
                      <td>{item.origin_price}</td>
                      <td>{item.price}</td>
                      <td>{item.is_enabled ? <span className="text-success">啟用</span> : <span className="text-danger">未啟用</span>}</td>
                      <td>
                        <button type="button" className="btn btn-info me-3" onClick={() => { setProductDetail(item), setProductImgUrl(item.imageUrl), detailModalOpen() }}>詳細資訊</button>
                        <button type="button" className="btn btn-primary me-3" onClick={() => {
                          setMode("edit");
                          setProductValue({
                            ...item,
                            imagesUrl: item.imagesUrl || []
                          });
                          productEditModalOpen();
                        }}>編輯</button>
                        <button type="button" className="btn btn-danger" onClick={() => productDelete(item.id)} >刪除</button>
                      </td>
                    </tr>
                  </tbody>
                )
              })
            }
          </table>
        </div>
      </div>
      <Pagination paginationData={paginationData} getProduct={getProduct} />
    </>
  )
}

export default ProductPage