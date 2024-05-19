import '../index.sass';

import React from 'react';
import ApiProvider from '../contexts/apiContext';
import RoomsProvider from '../contexts/roomContext';
import AuthProvider from '../contexts/authContext';
import { RecoilRoot } from 'recoil';
import Home from '../components/home/home';
import AuthComponent from './auth/auth';

const AppWrapper: React.FunctionComponent<{
    auth?: boolean;
    roomId?: number;
    createRoomMode?: boolean;

}> = ({
    auth = false,
    roomId = 0,
    createRoomMode = false

}) => {
  return <RecoilRoot>
    <div className='App'>
      <ApiProvider>
        <AuthProvider>
          <React.Fragment>
            { auth ? 
                <div className='auth-container'>
                    <AuthComponent />
                </div>
            :
                <RoomsProvider>
                <Home roomId={ roomId } createRoomMode={ createRoomMode } />
                </RoomsProvider>
            }
          </React.Fragment>
        </AuthProvider>
      </ApiProvider>
    </div>
  </RecoilRoot>
}

export default AppWrapper;