import "./signup.sass";

import React, { useContext, useId } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ApiContext } from "../../../contexts/apiContext";
import { emailState, userDataState } from "../../../atoms/auth";
import { useRecoilState } from "recoil";
import { AuthContext } from "../../../contexts/authContext";

const SignUpComponent: React.FunctionComponent = () => {
    const [,setEmail] = useRecoilState(emailState);
    const { setAccessToken } = useContext(AuthContext);
    const [,setUserDate] = useRecoilState(userDataState);
    const { signUp } = useContext(ApiContext);

    const id = useId();
    const methods = useForm<SignUpData>();

    const { handleSubmit, register } = methods;
    const onSubmit = async (formData: SignUpData) => {
        try {
            const response: any = await signUp(formData);
            console.log(response);
            
            setUserDate({ id: response.userId});
            setAccessToken(response.accessToken);
            setEmail(response.email);
            console.log(response)

        } catch (error) {
            console.log(error)
        }
    };

    return <React.Fragment>
        <div className="auth-component-header">
            <span className="auth-component-header-title">Sign up</span>
        </div>
        <FormProvider { ...methods }>
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="auth-form-field">
                    <label htmlFor={`firstName-${id}`}>First name</label>
                    <input type="text" { ...register("firstName") } id={`firstName-${id}`} className="input input-auth" />
                </div>

                <div className="auth-form-field">
                    <label htmlFor={`lastName-${id}`}>Last name</label>
                    <input type="text" { ...register("lastName") } id={`lastName-${id}`} className="input input-auth" />
                </div>

                <div className="auth-form-field">
                    <label htmlFor={`email-${id}`}>Email</label>
                    <input type="email" { ...register("email") } id={`email-${id}`} className="input input-auth" />
                </div>

                <div className="auth-form-field">
                    <label htmlFor={`username-${id}`}>Username</label>
                    <input type="text" { ...register("username") } id={`username-${id}`} className="input input-auth" />
                </div>

                <div className="auth-form-field">
                    <label htmlFor={`password-${id}`}>Password</label>
                    <input type="password" { ...register("password") } id={`password-${id}`} className="input input-auth" />
                </div>

                <div className="auth-form-field">
                    <input type="submit" value="Sign up" className="input input-auth" />
                </div>
            </form>
        </FormProvider>
    </React.Fragment>
}

export default SignUpComponent;