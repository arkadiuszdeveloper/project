import "./recovery.sass";

import React, { useContext, useId } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ApiContext } from "../../../contexts/apiContext";
import { useRecoilState } from "recoil";
import { emailState } from "../../../atoms/auth";
import { navigate } from "gatsby";

const RecoveryComponent: React.FunctionComponent = () => {
    const [,setEmail] = useRecoilState(emailState);
    const { recovery } = useContext(ApiContext);

    const id = useId();
    const methods = useForm<{ username: string }>();

    const { handleSubmit, register } = methods;
    const onSubmit = async ({username}: { username: string}) => {
        try {
            const response: any = await recovery(username);

            if (response.status === 200) {
                setEmail(response.email);
            }
            else {
                navigate('/');
            }

        } catch (error) {
            console.log(error)
        }
    }

    return <React.Fragment>
        <div className="auth-component-header">
            <span className="auth-component-header-title">Recovery an account</span>
        </div>
        <FormProvider { ...methods }>
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="auth-form-field">
                    <label htmlFor={`username-${id}`}>Username</label>
                    <input type="text" { ...register("username") } id={`username-${id}`} className="input input-auth" />
                </div>

                <div className="auth-form-field">
                    <input type="submit" value="Recovery" className="input input-auth" />
                </div>
            </form>
        </FormProvider> 
    </React.Fragment>
}

export default RecoveryComponent;