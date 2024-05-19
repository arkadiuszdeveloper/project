import "./signin.sass";

import React, { useContext, useId } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ApiContext } from "../../../contexts/apiContext";
import { AuthContext } from "../../../contexts/authContext";
import { useRecoilState } from "recoil";
import { emailState, userDataState } from "../../../atoms/auth";
import { navigate } from "gatsby";
import { authComponentModeState } from "../../../atoms/shared";

const SignInComponent: React.FunctionComponent = () => {
    const { signIn } = useContext(ApiContext);
    const [, setAuthComponentMode] = useRecoilState(authComponentModeState);
    const [,setEmail] = useRecoilState(emailState);
    const [,setUserDate] = useRecoilState(userDataState);
    const { setAccessToken } = useContext(AuthContext);

    const id = useId();
    const methods = useForm<Credentials>();

    const { handleSubmit, register } = methods;
    const onSubmit = async (data: Credentials) => {
        try {
            const response: any = await signIn(data);
            console.log(response);

            setUserDate({ id: response.userId});
            setAccessToken(response.accessToken);

            if ((response.status === 403 || response.status === 201) && response.email && !response.emailVerified) {
                setEmail(response.email);
                return;
            }

            navigate('/');

        } catch (error) {
            console.log(error)
        }
    }

    return <React.Fragment>
        <div className="auth-component-header">
            <span className="auth-component-header-title">Sign in</span>
        </div>
        <FormProvider { ...methods }>
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="auth-form-field">
                    <label htmlFor={`username-${id}`}>Username</label>
                    <input type="text" { ...register("username") } id={`username-${id}`} className="input input-auth" />
                </div>

                <div className="auth-form-field">
                    <div className="auth-form-flex">
                        <label htmlFor={`password-${id}`}>Password</label>
                        <span className="auth-recoveryPassword" onClick={() => setAuthComponentMode('recovery')}>Recovery an account</span>
                    </div>
                    <input type="password" { ...register("password") } id={`password-${id}`} className="input input-auth" />
                </div>

                <div className="auth-form-field">
                    <input type="submit" value="Sign in" className="input input-auth" />
                </div>
            </form>
        </FormProvider> 
    </React.Fragment>
}

export default SignInComponent;