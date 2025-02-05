function ProductModal({
  productModalRef,
  productDetail,
  detailModalClose,
  productImgUrl,
  setProductImgUrl
}) {
  return (
    <>
      <div className="modal fade" ref={productModalRef} tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">{productDetail.title}</h1>
              <button type="button" className="btn-close" onClick={detailModalClose} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="card">
                <img src={productImgUrl} className="card-img-top img-wrap" alt="product-img" />
                <div className="d-flex mt-3">
                  <img src={productDetail.imageUrl} className="product-sm-img mx-1 rounded-3" alt="product-img" onClick={() => setProductImgUrl(productDetail.imageUrl)} />
                  {productDetail.imagesUrl ?
                    productDetail.imagesUrl.map((item, idx) => {
                      return (
                        <img src={item} className="product-sm-img mx-1 rounded-3" alt="product-img" key={idx} onClick={() => setProductImgUrl(item)} />
                      )
                    }) : null
                  }
                </div>
                <div className="card-body">
                  <h5 className="card-title">售價：${productDetail.price}</h5>
                  <p className="card-text">{productDetail.description}</p>
                  <p className="card-text">{productDetail.content}</p>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={detailModalClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductModal