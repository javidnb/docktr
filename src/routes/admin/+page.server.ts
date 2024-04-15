const users = await fetch('https://tekoplast.az/docktr/api.php/records/doctors');
const result = users.json();

export const load = async () => {
	return result;
};