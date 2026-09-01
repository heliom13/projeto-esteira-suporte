import {useSearchParams} from "react-router-dom";
import ForgotPassword from "./edit";
import ResetPassword from "./resetPassword";

const ForgotOrResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    return token ? <ResetPassword token={token}/> : <ForgotPassword/>;
};

export default ForgotOrResetPassword;
