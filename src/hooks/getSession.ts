import { useEffect, useState } from "react";
import { IPC } from "../../common/constants";

export function useSession(id: number) {
  const [sessionData, setSessionData] = useState<{ totalAmount: number | null; formattedDuration: string | null }>({
    totalAmount: null,
    formattedDuration: null,
  });

  useEffect(() => {
    window.ipcRenderer.invoke(IPC.getSession, { PlayStationID: id }).then((res) => {
      if (res.code === 1) {
        const { totalAmount, formattedDuration } = res.msg;
        setSessionData({ totalAmount, formattedDuration });
      }
    });
  }, [id]);

  return sessionData;
}
