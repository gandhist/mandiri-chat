import React, { useEffect, useState } from 'react'
import '../../assets/chat.css';
import { ContentChatting, ListChat, SearchContact } from '../../components/molecules'
import IO from "socket.io-client";
import { useHistory } from 'react-router';
import { SOCKET_URL } from '../../config/api';
import { useToken } from '../../utils';



let socket;
const Chat = () => {
    const history = useHistory();
    const local = JSON.parse(localStorage.getItem('userlogin'))
    const { token } = useToken()
    const [activeChat, setActiveChat] = useState({})
    const [groupList, setGroupList] = useState([])
    const [newListChats, setNewListChats] = useState({})
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        const getListGroup = () => {
            fetch(`${SOCKET_URL}/api/v1/groupList`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then((res) => {
                    setGroupList(res.data)
                })
                .catch((err) => {
                    console.log('err', err)
                })
        }
        getListGroup()
    }, [token])

    useEffect(() => {
        socket = IO(SOCKET_URL, {
            auth: {
                jwtToken: token
            }
        });
        socket.on('message', message => {
            // console.log('ini di tab sidebar message nya =>', message)
            setNewListChats(message)
        })
        socket.on('connect_error', message => {
            console.log('error connection =>', message)
        })

    }, [token])

    useEffect(() => {
        // setActiveChat({
        //     ...activeChat, newChat: newListChats
        // })
        setActiveChat(achat => ({ ...achat, newChat: newListChats }))
        // setListChats(msgs => [...msgs, newChat])

    }, [newListChats])


    // handle on close modal
    const handleOnModalClose = () => {
        setShowModal(false)
    }

    // handle show search contact
    const handleShowSearchContact = () => {
        setShowModal(true)
    }

    // handle on logout button
    const logout = () => {
        localStorage.removeItem('userlogin')
        history.replace('/login')
    }

    // handle onclick lists chats 
    const handleOnClickList = (chat) => {
        setActiveChat({
            id: chat.id,
            room_id: chat.room_id,
            name: chat.name,
            picture: chat.picture,
            tipe: chat.tipe
        })
        socket.emit('joinRoom', { username: local.name, room: chat.room_id, tipe: chat.tipe, targetId: chat.id })
        if (showModal) setShowModal(false)

    }


    return (
        <div className="center" >
            <div id="frame">
                <div id="sidepanel">
                    <div id="profile">
                        <div className="wrap">
                            <img id="profile-img" src={local.picture} className="online" alt="" />
                            <p>{local.name.toUpperCase()}</p>
                        </div>
                    </div>
                    <div id="search">
                        <label ><i className="fa fa-search" aria-hidden="true" /></label>
                        <input type="text" placeholder="Search contacts..." />
                    </div>
                    <div id="contacts">
                        <ul>
                            {
                                groupList.map((item, index) => {
                                    let dataSetChat = {
                                        id: item.target_id,
                                        room_id: item.room_id,
                                        name: item.name,
                                        picture: item.picture,
                                        tipe: item.tipe
                                    }
                                    return <ListChat key={index} onClick={() => handleOnClickList(dataSetChat)} isOnline={true} isMe={activeChat.name === item.name ? true : false} picture={item.picture} name={item.name} lastMessage={item.last_message} />
                                })
                            }
                        </ul>
                    </div>
                    <div id="bottom-bar">
                        <button id="addcontact" onClick={handleShowSearchContact} ><i className="fa fa-user-plus fa-fw" aria-hidden="true" /> <span>Search Contact</span></button>
                        <button id="settings" onClick={logout}><i className="fa fa-sign-out fa-fw" aria-hidden="true" /> <span>Logout</span></button>
                    </div>
                </div>
                {
                    Object.keys(activeChat).length === 0 ?
                        <div className="content">
                            {/* belum ada pesan */}
                        </div>
                        :
                        <ContentChatting name={activeChat.name} picture={activeChat.picture} id={activeChat.id} tipe={activeChat.tipe} room_id={activeChat.room_id} socket={socket} newChat={activeChat.newChat} />
                }
            </div>
            <SearchContact isShow={showModal} onClose={handleOnModalClose} onClick={handleOnClickList} />
        </div>
    )
}

export default Chat
