import React, { useEffect, useState } from 'react'
import '../../assets/chat.css';
import { ContentChatting, ListChat } from '../../components/molecules'
import IO from "socket.io-client";
import { useHistory } from 'react-router';
import { SOCKET_URL } from '../../config/api';


let socket;
const Chat = () => {
    const history = useHistory();
    const local = JSON.parse(localStorage.getItem('userlogin'))
    const [activeChat, setActiveChat] = useState({})
    const [groupList, setGroupList] = useState([])
    
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
        return () => {};
        // return () => getMessage();
    }, [])

    const logout = () => {
        localStorage.removeItem('userlogin')
        history.replace('/login')
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
                                    return <ListChat key={index} onClick={() => setActiveChat({ id: item.group_id, name: item.group_name, picture: item.picture })} isOnline={true} isMe={activeChat.name === item.group_name ? true : false} picture={item.picture} name={item.group_name} lastMessage={item.message} />
                                })
                            }
                        </ul>
                    </div>
                    <div id="bottom-bar">
                        <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true" /> <span>Add contact</span></button>
                        <button id="settings" onClick={logout}><i className="fa fa-cog fa-fw" aria-hidden="true" /> <span>Logout</span></button>
                    </div>
                </div>
                {
                    Object.keys(activeChat).length === 0 ?
                        <div className="content">
                            {/* belum ada pesan */}
                        </div>
                        :
                        <ContentChatting name={activeChat.name} picture={activeChat.picture} id={activeChat.id} />
                }
            </div>

        </div>
    )
}

export default Chat
