const SET_USER = "SET_USER";
const LOGOUT = "LOGOUT";

export function setUser(user) {
  return {
    type: SET_USER,
    user,
  };
}

export function logout() {
  return {
    type: LOGOUT,
  };
}

const initialState = {
  id: "",
  token: "",
  email: "",
  name:""
};

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        ...action.user,
      };
    case LOGOUT:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

export function tokenSelector(state: any) {
  let token = localStorage.getItem("token")
  return {
    ...state,
    isLoggedIn: token !== null ? true : false,
  };
}