function LoadingSpinner() {
  return (
    <>
      <div className="spinner position-fixed top-50 start-50 zx-99">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  )
}

export default LoadingSpinner