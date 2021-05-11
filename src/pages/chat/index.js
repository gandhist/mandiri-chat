import React, { useEffect, useState } from 'react'
import '../../assets/chat.css';
import { ContentChatting, ListChat, SearchContact } from '../../components/molecules'
import IO from "socket.io-client";
import { useHistory } from 'react-router';
import { SOCKET_URL } from '../../config/api';


let socket;
const Chat = () => {
    const history = useHistory();
    const local = JSON.parse(localStorage.getItem('userlogin'))
    const [activeChat, setActiveChat] = useState({})
    const [groupList, setGroupList] = useState([])
    const [showModal, setShowModal] = useState(false)
    useEffect(() => {
        const getListGroup = () => {
            fetch(`${SOCKET_URL}/api/v1/groupList`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${local.token}`,
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
    }, [local.token])

    useEffect(() => {
        socket = IO(SOCKET_URL, {
            auth: {
                jwtToken: local.token
            }
        });
    }, [local])


    useEffect(() => {
        socket.on('message', message => {
            console.log('ini di tab sidebar message nya =>', message)
        })
        socket.on('connect_error', message => {
            console.log('error connection =>', message)
        })
        return () => {};
        // return () => getMessage();
    }, [])

    // handle on close modal
    const handleOnModalClose = () => {
        setShowModal(false)
    }

    // handle show search contact
    const handleShowSearchContact = () => {
        console.log('tes')
        setShowModal(true)
    }

    // handle on logout button
    const logout = () => {
        localStorage.removeItem('userlogin')
        history.replace('/login')
    }

    // handle onclick lists chats 
    const handleOnClickList = (chat) => {
        // console.log('you hit this from contacts', chat)
        setActiveChat({
            id: chat.id,
            name: chat.name,
            picture: chat.picture,
            tipe: chat.tipe
        })
        if(showModal) setShowModal(false)
        
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
                                    return <ListChat key={index} onClick={() => handleOnClickList({ id: item.target_id, name: item.name, picture: item.picture, tipe: item.tipe })} isOnline={true} isMe={activeChat.name === item.name ? true : false} picture={item.picture} name={item.name} lastMessage={item.last_message}  />
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
                        <ContentChatting name={activeChat.name} picture={activeChat.picture} id={activeChat.id} tipe={activeChat.tipe} />
                }
            </div>
            <SearchContact isShow={showModal} onClose={handleOnModalClose} onClick={handleOnClickList} />
        </div>
    )
}

export default Chat
