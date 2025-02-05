function LoginPage({
  LoadingSpinner,
  login,
  isLoading,
  user,
  setUser
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value
    });
  };
  const handleKeyDown = (e) => {
    if (e.key == "Enter") {
      login();
    };
  };

  return (
    <>
      {isLoading ? <LoadingSpinner /> : null}
      <div className="container">
        <div className="row">
          <div className="col-6 mx-auto my-5">
            <h1 className="text-center">登入</h1>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">電子信箱</label>
              <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="username" value={user.username} onChange={handleInputChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">密碼</label>
              <input type="password" className="form-control" id="exampleInputPassword1" name="password" value={user.password} onChange={handleInputChange} onKeyDown={handleKeyDown} />
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-primary" onClick={login}>登入</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage