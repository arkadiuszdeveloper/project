import { useForm } from 'react-hook-form';
import { ApiContext } from '../../contexts/apiContext';
import Avatar from '../ui/avatar/avatar';
import './myAccount.sass';

import React, { useContext, useEffect, useId, useState } from 'react';


const MyAccount: React.FunctionComponent<{ userId: number }> = ({ userId }): JSX.Element => {
    const componentId = useId();

    const { getUserById, updateUserInfo } = useContext(ApiContext);
    const [user, setUser] = useState<TUser>();

    const { register, reset } = useForm();

    const updateAvatar = (userId: number, file: FileList | null ) => {
        if (!file?.length) return;

        const reader = new FileReader();

        reader.onload = function(readerEvent) {
            console.log(readerEvent.target?.result)
            updateUserInfo(userId, { avatarBase64: readerEvent.target?.result as string || '' });
            reset();
        };

        reader.readAsDataURL(file[0]);
    }

    useEffect(() => {
        const fetch = async () => {
            const response = await getUserById(userId);
            setUser(response);
        }
        fetch();
    }, []);

    return <div className='myAccount'>
        
        <div className='myAccount-container'>
            <div className='myAccount-header'>
                <span className='myAccount-header-title'>Details</span>
            </div>

            <div className='myAccount-avatar'>
                <label htmlFor={`avatar-${componentId}`}><Avatar title='A' userId={ userId } /></label>
                <input type="file" { ...register('avatar') } id={`avatar-${componentId}`} onChange={(e) => updateAvatar(userId, e.target.files)} />
            </div>

            <div className='myAccount-details'>
                <div className='myAccount-details-field'>
                    <span className='myAccount-details-field-item-header'>
                        <span className='myAccount-details-field-item-header-title'>First name</span>
                        <span className='myAccount-details-field-item-header-edit'>edit</span>
                    </span>
                    <span className='myAccount-details-field-item-value'>{ user?.firstName }</span>
                </div>
                <div className='myAccount-details-field'>
                    <span className='myAccount-details-field-item-header'>
                        <span className='myAccount-details-field-item-header-title'>Username</span>
                        <span className='myAccount-details-field-item-header-edit'>edit</span>
                    </span>
                    <span className='myAccount-details-field-item-value'>{ user?.username }</span>
                </div>
                <div className='myAccount-details-field'>
                    <span className='myAccount-details-field-item-header'>
                        <span className='myAccount-details-field-item-header-title'>Last name</span>
                        <span className='myAccount-details-field-item-header-edit'>edit</span>
                    </span>
                    <span className='myAccount-details-field-item-value'>{ user?.lastName }</span>
                </div>
                <div className='myAccount-details-field'>
                    <span className='myAccount-details-field-item-header'>
                        <span className='myAccount-details-field-item-header-title'>Email</span>
                        <span className='myAccount-details-field-item-header-edit'>edit</span>
                    </span>
                    <span className='myAccount-details-field-item-value'>{ user?.email }</span>
                </div>
                <div className='myAccount-details-field'>
                    <span className='myAccount-details-field-item-header'>
                        <span className='myAccount-details-field-item-header-title'>Phone number</span>
                        <span className='myAccount-details-field-item-header-edit'>edit</span>
                    </span>
                    <span className='myAccount-details-field-item-value'>{ user?.phone || '---------' }</span>
                </div>
            </div>

            <div className='myAccount-header'>
                <span className='myAccount-header-title'>Password and Authentication</span>
            </div>

            <div className='myAccount-authentication'>
                <div className='myAccount-authentication-item'>
                    {/* <span className='myAccount-authentication-item-description'></span> */}
                    <input type="button" value={ user?.emailVerification ? 'Disable Email Authentication' : 'Enable Email Authentication' } className="input input-auth" />
                </div>
                <div className='myAccount-authentication-item'>
                    {/* <span className='myAccount-authentication-item-description'></span> */}
                    <input type="button" value='Change password' className="input input-auth" style={{ backgroundColor: 'rgb(137, 46, 255)' }} />
                </div>
            </div>

            <div className='myAccount-header'>
                <span className='myAccount-header-title'>Delete account</span>
            </div>

            <div className='myAccount-authentication'>
                <div className='myAccount-authentication-item'>
                    <input type="button" value="Delete account" className="input input-auth" style={{ backgroundColor: 'rgba(255, 0, 0, 1)' }} />
                </div> 
            </div>
        </div>

    </div>
}

export default MyAccount;