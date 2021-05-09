import React, { useEffect, useState } from 'react'
import '../../assets/chat.css';
import { ContentChatting, ListChat } from '../../components/molecules'
import IO from "socket.io-client";
import { useHistory } from 'react-router';
const dotenv = require('dotenv');


// get config vars
dotenv.config();
const ENDPOINT = "http://localhost:5000";
let socket;


const Chat = () => {
    const history = useHistory();
    const local = JSON.parse(localStorage.getItem('userlogin'))
    const [activeChat, setActiveChat] = useState({})
    const [groupList, setGroupList] = useState([])


    useEffect(() => {
        const getListGroup = () => {
            fetch(`http://localhost:5000/api/v1/groupList`, {
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
        socket = IO(ENDPOINT, {
            auth: {
                jwtToken: local.token
            }
        });
    }, [local])


    useEffect(() => {
        const getMessage = socket.on('message', message => {
            console.log('ini di tab sidebar message nya =>', message)
        })
        return () => getMessage();
    }, [])

    const logout = () => {
        //
        localStorage.removeItem('userlogin')
        history.replace('/login')
    }


    return (
        <div className="bodychat" >
            <div id="frame">
                <div id="sidepanel">
                    <div id="profile">
                        <div className="wrap">
                            <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                            <p>{local.name.toUpperCase()}</p>
                            <i className="fa fa-chevron-down expand-button" aria-hidden="true" />
                            <div id="status-options">
                                <ul>
                                    <li id="status-online" className="active"><span className="status-circle" /> <p>Online</p></li>
                                    <li id="status-away"><span className="status-circle" /> <p>Away</p></li>
                                    <li id="status-busy"><span className="status-circle" /> <p>Busy</p></li>
                                    <li id="status-offline"><span className="status-circle" /> <p>Offline</p></li>
                                </ul>
                            </div>
                            <div id="expanded">
                                <label htmlFor="twitter"><i className="fa fa-facebook fa-fw" aria-hidden="true" /></label>
                                <input name="twitter" type="text" defaultValue="mikeross" />
                                <label htmlFor="twitter"><i className="fa fa-twitter fa-fw" aria-hidden="true" /></label>
                                <input name="twitter" type="text" defaultValue="ross81" />
                                <label htmlFor="twitter"><i className="fa fa-instagram fa-fw" aria-hidden="true" /></label>
                                <input name="twitter" type="text" defaultValue="mike.ross" />
                            </div>
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
                                    return <ListChat key={index} onClick={() => setActiveChat({ id: item.group_id, name: item.group_name, picture: "http://emilcarlsson.se/assets/louislitt.png" })} isOnline={true} isMe={activeChat.name === item.group_name ? true : false} picture="http://emilcarlsson.se/assets/louislitt.png" name={item.group_name} lastMessage={item.message} />
                                })
                            }
                        </ul>
                    </div>
                    <div id="bottom-bar">
                        {/* <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true" /> <span>Add contact</span></button> */}
                        <button id="settings" onClick={logout}><i className="fa fa-cog fa-fw" aria-hidden="true" /> <span>Logout</span></button>
                    </div>
                </div>
                {
                    Object.keys(activeChat).length === 0 ?
                        <div className="content">
                            belum ada pesan
                        </div>
                        :
                        <ContentChatting name={activeChat.name} picture={activeChat.picture} id={activeChat.id} />

                }
            </div>

        </div>
    )
}

export default Chat
