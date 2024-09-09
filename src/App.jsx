import { getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import reactLogo from "./assets/react.svg";
import Message from "./components/Notification";
import { messaging } from "./firebase/firebaseConfig";
import viteLogo from "/vite.svg";
const { VITE_APP_VAPID_KEY } = import.meta.env;
function App() {
  const [count, setCount] = useState(0);
  const [usrToken, setUsrToken] = useState("");

  onMessage(messaging, (payload) => {
    toast(<Message notification={payload.notification} />);
  });

  async function requestPermission() {
    //requesting permission using Notification API

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: VITE_APP_VAPID_KEY,
      });

      //We can send token to server
      console.log("Token generated : ", token);
      setUsrToken(token);
    } else if (permission === "denied") {
      //notifications are blocked
      alert("You denied for the notification");
    }
  }

  const onCopy = () => {
    navigator.clipboard.writeText(usrToken);
    toast.success("Copied");
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
        <button onClick={onCopy}>Copy token to clipboard</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <ToastContainer />
    </>
  );
}

export default App;
