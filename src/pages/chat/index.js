import React, { useEffect, useState } from 'react'
import '../../assets/chat.css';
import { ContentChatting, ListChat, SearchContact } from '../../components/molecules'
import IO from "socket.io-client";
import { useHistory } from 'react-router';
import { SOCKET_URL } from '../../config/api';
import { useToken } from '../../utils';
import background from "../../assets/photography.png";


let socket;
const Chat = () => {
    const history = useHistory();
    const local = JSON.parse(localStorage.getItem('userlogin'))
    const { token } = useToken()
    const [activeChat, setActiveChat] = useState({})
    const [groupList, setGroupList] = useState([])
    const [newListChats, setNewListChats] = useState({})
    const [toast, setToast] = useState({
        show: false,
        title: "",
        text: "",
    })
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

    const tryReconnect = () => {
        setTimeout(() => {
            socket.io.open((err) => {
                if (err) {
                    console.log('err', err)
                    tryReconnect();
                }
                setToast(toast => ({ ...toast, show: false, title: err.name, text: err.message }))
            });
        }, 10000);
    }

    useEffect(() => {
        socket = IO(SOCKET_URL, {
            auth: {
                jwtToken: token
            }
        });
        socket.on('message', message => {
            if (message.send_by !== null) {
                setNewListChats(message)
            }
        })
        socket.on('connect_error', err => {
            setToast(toast => ({ ...toast, show: true, title: err.name, text: err.message }))
            tryReconnect();
        })

    }, [token])

    useEffect(() => {
        // check is active chat?
        setActiveChat(achat => ({ ...achat, newChat: newListChats }))
        // if (groupList.length > 0) {
        // replace array list chat
        const idx = groupList.findIndex(el => el.room_id === newListChats.room_id)
        // jika ada indexnya
        if (idx !== -1) {
            groupList[idx] = { ...groupList[idx], last_message: newListChats.message }
            // setGroupList(groupList)
        }
        else {
            // jika belum ada data
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
        // }

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
        if (chat.tipe === 'pc') {
            socket.emit('joinRoom', { username: local.name, room: chat.id, tipe: chat.tipe, targetId: chat.id })
        }
        if (showModal) setShowModal(false)

    }

    const Toast = ({ showToast, title, text }) => {
        return (
            <div className="position-fixed position-absolute p-3 top-50 start-50 translate-middle" style={{ zIndex: 5 }}>
                <div id="liveToast" className={`toast ${showToast ? 'show' : 'hide'}`} role="alert" aria-live="assertive" aria-atomic="true">
                    <div className="toast-header">
                        <strong className="me-auto">{title}</strong>
                        <small>Just Now</small>
                        <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close" />
                    </div>
                    <div className="toast-body">
                        {text}
                    </div>
                </div>
            </div>
        )
    }


    return (
        <div className="center" >
            <div id="frame">
                <div id="sidepanel">
                    <div id="profile">
                        <div className="wrap">
                            <img id="profile-img" src={local.picture} className="online" alt="" />
                            <p>{local.name}</p>
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
                    Object.keys(activeChat).length === 0 || activeChat.hasOwnProperty('id') === false ?
                        <div className="content" style={{ backgroundImage: `url(${background})` }}>
                            {/* belum ada pesan */}
                        </div>
                        :
                        <ContentChatting name={activeChat.name} picture={activeChat.picture} id={activeChat.id} tipe={activeChat.tipe} room_id={activeChat.room_id} socket={socket} newChat={activeChat.newChat} />
                }
            </div>
            <SearchContact isShow={showModal} onClose={handleOnModalClose} onClick={handleOnClickList} />
            <Toast showToast={toast.show} text={toast.text} title={toast.title} />

        </div>
    )
}

export default Chat
