import { IPC } from "../../common/constants";

export async function confirmPassword(password: string) {
  try {
    const oldPassResponse = await window.ipcRenderer.invoke(IPC.getPass);

    if (oldPassResponse.code === 1 && oldPassResponse.password === password) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error confirming password:', error);
    return false;
  }
}
