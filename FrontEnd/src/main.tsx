import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { callFetchAccount1 } from './config/api';
// import App from './app';
// import { Provider } from 'react-redux'
// import { store } from '@/redux/store';

const App1 = () => {
  const [status, setStatus] = useState("nothing")
  const getAccount = async () => {
    const res = await callFetchAccount1();
    if (res) {
      setStatus(res)
      // dispatch(doGetAccountAction(res.data))
    }
  }

  useEffect(() => {
    getAccount();
  }, [])

  return (
    <div style={{ padding: "50px" }}>
      <h1>Hello CORS with HoiDanIT</h1>
      <h2>Data api = {status}</h2>
    </div>
  )
}
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <Provider store={store}> */}
    {/* <App /> */}
    {/* </Provider> */}
    <App1 />
  </React.StrictMode>,
)
