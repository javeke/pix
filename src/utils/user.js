export const userQuery = userId => `*[_type ==  "user" && _id == '${userId}']`;

export const fetchUser = _ => localStorage.getItem('user') === undefined ? localStorage.clear() : JSON.parse(localStorage.getItem('user'));