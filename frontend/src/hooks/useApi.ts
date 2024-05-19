import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { io, Socket } from 'socket.io-client';
import { accessTokenState, userDataState } from '../atoms/auth';
import { navigate } from 'gatsby';
import { homeRoomListModalState, homeSettingsModalState, homeUserListState, messageListState } from '../atoms/home';
import { messageReplyState } from '../atoms/chat';

const useSocket = (namespace: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { accessToken, getAccessToken } = useAccessToken();
  const { resetData } = useUserData();

  useEffect(() => {
    const newSocket = io(`https://6zv5yffnhzwa.bieda.it/api/${namespace}`, { extraHeaders: { Authorization: getAccessToken()} });

    newSocket.on("disconnect", () => {
      console.log(`Reconnected to the ${namespace} namespace`);
      // newSocket.connect();
    });

    newSocket.on('connect', () => {
      console.log(`Connected to the ${namespace} namespace`);
    });

    newSocket.on('authFailed', (data) => {
      resetData();
    });

    setSocket(newSocket);

    return () => {
        newSocket.close();
    };
  }, [namespace, accessToken]);

  return socket;
};

export const useUserData = () => {
  const [,setHomeSettingsState] = useRecoilState(homeSettingsModalState);
  const [,setHomeRoomListState] = useRecoilState(homeRoomListModalState);
  const [,setUserListState] = useRecoilState(homeUserListState);

  const { removeAccessToken } = useAccessToken();

  const resetData = () => {
    removeAccessToken();
    setHomeSettingsState(false);
    setHomeRoomListState([]);
    setUserListState([]);

    navigate('/login');
  }

  return {
    resetData,
  }
}

export const useSharedApi = () => {
  const sharedSocket = useSocket('');

  const getLinkPreview = (url: string): Promise<TPreview> => {
    return new Promise((resolve, reject) => {
      sharedSocket?.emit('getLinkPreview', url, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  return {
    getLinkPreview,
  }
}

export const useUserApi = () => {
  const userData = useRecoilValue(userDataState);
  const [userList, setUserList] = useRecoilState(homeUserListState)

  const userSocket = useSocket('users');
  const { resetData } = useUserData();

  const handleUserActivity = (user: TUser) => {
    appendUser(user);
    console.log({ type: 'updated', user, userList});
  }

  useEffect(() => {
    if (userSocket) {
      userSocket.on(`user:${userData.id}`, handleUserActivity);
    }
  }, [userSocket, userData]);

  const getUserList = () => userList;

  const getUserById = async (userId: number): Promise<TUser | undefined> =>
    userList.find(u => u.id === userId) || await loadUserById(userId);
  
  const getUserByName = async (name: string): Promise<TUser | undefined> =>
    userList.find(u => u.firstName === name || u.lastName === name) || await findOneUserByName(name);
  
  const getUsersByName = async (searchTerm: string): Promise<TUser[]> => {
    const newUsers = await findUsersByName(searchTerm);
    appendUsers(newUsers);

    return userList.filter(u => u.firstName.includes(searchTerm) || u.lastName.includes(searchTerm));
  }

  const loadUserById = async (userId: number): Promise<TUser | undefined> => {
    try {
      const user = await findOneUser(userId);

      if (user) {
          appendUser(user);
          return user;
      } else {
          return undefined;
      }

    } catch (error) {
      console.error("Error fetching user:", error);
      return undefined;
    }
  }


  const appendUser = (user: TUser) => setUserList(prev => [...prev.filter(u => u.id !== user.id), user]);

  const appendUsers = (users: TUser[]) => {
    setUserList(prev => {
      const ids = prev.map(u => u.id);
      return [...prev, ...users.filter(u => !ids.includes(u.id))]
    })
  };

  const updateUserInfo = (userId: number, user: Omit<Partial<TUser>, 'id'>) => {
    return new Promise((resolve, reject) => {
        userSocket?.emit('updateUser', { id: userId, ...user }, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const resetUserPassword = (data: {
    newPassword: string,
    oldPassword: string
  }) => {
    return new Promise((resolve, reject) => {
        userSocket?.emit('resetUserPassword', data, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const findOneUser = (userId: number): Promise<TUser> => {
    return new Promise((resolve, reject) => {
      userSocket?.emit('findOneUser', userId, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const findOneUserByName = (searchTerm: string): Promise<TUser> => {
    return new Promise((resolve, reject) => {
      userSocket?.emit('findUserByName', searchTerm, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const findMoreUser = (userIds: number[]): Promise<TUser[]> => {
    return new Promise((resolve, reject) => {
      userSocket?.emit('findMoreUser', userIds, (data: TUser[]) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const findUsersByName = (searchTerm: string): Promise<TUser[]> => {
    return new Promise((resolve, reject) => {
      userSocket?.emit('findUsersByName', searchTerm, (data: TUser[]) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const signIn = (credentials: Credentials): Promise<TUser> => {
    return new Promise((resolve, reject) => {
      userSocket?.emit('loginUser', credentials, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const signUp = (signUpData: SignUpData) => {
    return new Promise((resolve, reject) => {
        userSocket?.emit('createUser', signUpData, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const recovery = (username: string): Promise<TUser> => {
    return new Promise((resolve, reject) => {
      userSocket?.emit('recoveryUser', username, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const verifyEmail = (data: VerifyEmail) => {
    return new Promise((resolve, reject) => {
        userSocket?.emit('verifyUserEmail', data, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const verify = (): Promise<TUser> => {
    return new Promise((resolve, reject) => {
        userSocket?.emit('verifyUser', {}, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const logout = () => {
    resetData();

    return new Promise((resolve, reject) => {
        userSocket?.emit('logout', {}, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  return {
    findOneUser,
    findMoreUser,
    signIn,
    signUp,
    verify,
    recovery,
    verifyEmail,
    logout,
    findUsersByName,
    appendUser,
    appendUsers,

    getUsersByName,
    getUserList,
    userList,
    userData,

    getUserById,
    loadUserById,

    resetUserPassword,
    updateUserInfo,
  };
};

export const useMessageApi = () => {
  const messageReply = useRecoilValue(messageReplyState);
  const [, setRoomList] = useRecoilState(homeRoomListModalState);
  const [getMessageList, setMessageList] = useRecoilState(messageListState);
  const userData = useRecoilValue(userDataState);
  const messageSocket = useSocket('messages');

  const refreshRoomList = (message: TMessage) => {
    setRoomList(rooms => {
      var room: TRoom | undefined = rooms.find(room => room.id === message.roomId);
      if (room) {
        const oldRooms = rooms.filter(r => r !== room)
        return [{ ...room, lastMessage: message }, ...oldRooms];
      }
      return rooms;
    })
  }

  const handleNewMessages = (message: TMessage) => {
    refreshRoomList(message);
    setMessageList(prev => [ ...prev, message ]);
  }

  useEffect(() => {
    if (messageSocket) {
      messageSocket.on(`user:${userData.id}`, handleNewMessages);
    }
  }, [messageSocket]);

  const sendTextMessage = (roomId: number, message: string, crypted: boolean = false): Promise<TMessage> => {
    const payload = {
      roomId,
      message,
      crypted,
      replied_to_message_id: messageReply
    }

    return new Promise((resolve, reject) => {
      return messageSocket?.emit('sendTextMessage', payload, (data: TMessage) => {
        resolve(data);
        reject(data);
      });
    });
  };

  const getMessages = (roomId: number, offset: number): Promise<TMessage[]> => {
    return new Promise((resolve, reject) => {
        messageSocket?.emit('getMessages', { roomId, offset }, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const getMessage = (messageId: number): Promise<TMessage> => {
    return new Promise((resolve, reject) => {
        messageSocket?.emit('getMessage', { messageId }, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const seenMessage = (messageId: number): Promise<TMessage[]> => {
    return new Promise((resolve, reject) => {
        messageSocket?.emit('seenMessage', { messageId }, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  return {
    getMessage,
    getMessageList,
    setMessageList,
    sendTextMessage,
    getMessages,
    seenMessage,
    handleNewMessages,
  };
}

export const useRoomsApi = () => {
  const userData = useRecoilValue(userDataState);
  const [roomList, setRoomList] = useRecoilState(homeRoomListModalState);
  const roomSocket = useSocket('rooms');

  const getRoomList = () => roomList;

  const fetchRooms = async () => {
      const response: TRoom[] = await findRooms();
      setRoomList(response);
  }

  useEffect(() => {
    fetchRooms();
  }, [roomSocket]);

  useEffect(() => {
    if (roomSocket) {
      roomSocket.on(`user:${userData.id}`, handleNewRoom);
    }
  }, [roomSocket]);

  const handleNewRoom = (room: TRoom) => {
    if (!roomList.includes(room)) {
      setRoomList(prev => [room, ...prev]);
    }
  }

  const createRoom = (roomData: CreateRoom): Promise<TRoom> => {
    return new Promise((resolve, reject) => {
        roomSocket?.emit('createFriendRoom', roomData, (data: any) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const findRooms = (): Promise<TRoom[]> => {
    return new Promise((resolve, reject) => {
        roomSocket?.emit('findAll', {}, (data: TRoom[]) => {
          resolve(data);
          reject(data);
      });
    });
  };

  const findRoom = (roomId: number): Promise<TRoom> => {
    return new Promise((resolve, reject) => {
        roomSocket?.emit('findOne', roomId, (data: TRoom) => {
          resolve(data);
          reject(data);
      });
    });
  };

  return {
    room: {
      get: getRoomList,
      set: setRoomList,
      append: handleNewRoom,
      reload: fetchRooms,
    },
    createRoom,
    findRooms,
    findRoom,
  };
};

export const useAccessToken = () => {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  
  const removeAccessToken = () => setAccessToken('');
  const getAccessToken = () => accessToken ? `Bearer ${accessToken}` : "";

  return {
    accessToken,
    setAccessToken,
    getAccessToken,
    removeAccessToken,
  }
}
