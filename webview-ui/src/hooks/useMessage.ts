import { useEffect, useState } from "react";

const useMessage = () => {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    window.addEventListener("message", (data) => {
      setMessage(data.data);
    });

    return () => window.removeEventListener("message", () => {});
  });

  return message;
};

export default useMessage;
