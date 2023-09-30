import data from "../../common/data.json"
export function confirmPassword(password: string){
	if (password === data.credentials.password) {
		return true;
	  } else {
		return false;
	  }
}