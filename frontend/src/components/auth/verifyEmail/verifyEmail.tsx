import "./verifyEmail.sass";

import React, { useContext, useId } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ApiContext } from "../../../contexts/apiContext";
import { useRecoilState } from "recoil";
import { emailState, userDataState } from "../../../atoms/auth";
import { navigate } from "gatsby";
import { AuthContext } from "../../../contexts/authContext";
import { authComponentModeState } from "../../../atoms/shared";

const VerifyEmailComponent: React.FunctionComponent = () => {
    const { verifyEmail } = useContext(ApiContext);

    const [, setAuthComponentMode] = useRecoilState(authComponentModeState);
    const [email, setEmail] = useRecoilState(emailState);
    const [,setUserDate] = useRecoilState(userDataState);
    const { setAccessToken } = useContext(AuthContext);

    const id = useId();
    const methods = useForm<VerifyEmailForm>();

    const { handleSubmit, register, watch, setFocus } = methods;

    setFocus('key');

    const onSubmit = async (formData: VerifyEmailForm) => {
        const response: any = await verifyEmail({ ...formData, email });
        console.log(response)

        if (response.ok) {
            setUserDate({ id: response.userId });
            setAccessToken(response.accessToken);
            setAuthComponentMode('signIn');
            setEmail('');
            navigate('/');
        }
    }

    watch(({ key }) => {
        if (key?.length === 5) {
            handleSubmit(onSubmit)();
        }
    })

    return <React.Fragment>
        <div className="auth-component-header">
            <span className="auth-component-header-title">Verification</span>
        </div>
        <FormProvider { ...methods }>
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                <div className="auth-form-field">
                    <label htmlFor={`key-${id}`}>Verification key</label>
                    <input type="text" { ...register("key") } id={`key-${id}`} className="input input-auth" />
                </div>
            </form>
        </FormProvider>
    </React.Fragment>
}

export default VerifyEmailComponent;