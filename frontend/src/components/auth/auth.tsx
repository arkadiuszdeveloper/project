import "./auth.sass";

import React, { useEffect } from "react";
import SignUpComponent from "./signup/signup";
import SignInComponent from "./signin/signin";
import VerifyEmailComponent from "./verifyEmail/verifyEmail";
import { useRecoilState, useRecoilValue } from "recoil";
import { accessTokenState, emailState } from "../../atoms/auth";
import { authComponentModeState } from "../../atoms/shared";
import RecoveryComponent from "./recovery/recovery";
import { navigate } from "gatsby";
import { useUserData } from "../../hooks/useApi";

const AuthComponent: React.FunctionComponent = () => {
  const accessToken = useRecoilValue(accessTokenState);
  const email = useRecoilValue(emailState);
  const [mode, setMode] = useRecoilState(authComponentModeState);
  const { resetData } = useUserData();

  const setModeSignIn = () => setMode('signIn');
  const setModeSignUp = () => setMode('signUp');

  useEffect(() => {
    if (email)
      setMode('email');
  }, [email])

  useEffect(() => {
    if (accessToken) {
      navigate('/')
    }
  }, [accessToken])

  const getModeComponent = () => {
    switch (mode) {
      case 'signUp':
        return <React.Fragment>
          <SignUpComponent />
          <span onClick={setModeSignIn} className="input auth-form-switchMode">Sign in</span>
        </React.Fragment>;

      case 'email':
        return <React.Fragment>
          <VerifyEmailComponent />
          <span onClick={() => { resetData(); setModeSignIn(); }} className="input auth-form-switchMode">Exit</span>
        </React.Fragment>;

      case 'recovery':
        return <React.Fragment>
          <RecoveryComponent />
          <span onClick={setModeSignIn} className="input auth-form-switchMode">Sign in</span>
        </React.Fragment>;

      default:
        return <React.Fragment>
          <SignInComponent />
          <span onClick={setModeSignUp} className="input auth-form-switchMode">Create an account</span>
        </React.Fragment>;
    }
  }

  return <div className="auth-component">
    { getModeComponent() }
  </div>
}

export default AuthComponent;