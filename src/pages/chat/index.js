import React, { useState } from 'react'
import { ContentChatting, ListChat } from '../../components/molecules'

const Chat = () => {

    const local = JSON.parse(localStorage.getItem('userlogin'))

    const [activeChat, setActiveChat] = useState({})

    return (
        <div>
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
                        <label ><i className="fa fa-search" aria-hidden="true" /> 🔎</label>
                        <input type="text" placeholder="Search contacts..." />
                    </div>
                    <div id="contacts">
                        <ul>
                            <ListChat onClick={() => setActiveChat({name: "Louis Litt", picture:"http://emilcarlsson.se/assets/louislitt.png"})} isOnline={true} isMe={activeChat.name === 'Louis Litt' ? true : false} picture="http://emilcarlsson.se/assets/louislitt.png" name="Louis Litt" lastMessage="You just got LITT up, Mike." />
                            <ListChat onClick={() => setActiveChat({name: "Harvey Specter", picture:"http://emilcarlsson.se/assets/harveyspecter.png"})} isOnline={true} isMe={activeChat.name === 'Harvey Specter' ? true : false} picture="http://emilcarlsson.se/assets/harveyspecter.png" name="Harvey Specter" lastMessage="Wrong. You take the gun, or you pull out a bigger one. Or, you call their bluff. Or, you do any one of a hundred and forty six other things." />
                            <ListChat onClick={() => setActiveChat({name: "Rachel Zane", picture:"http://emilcarlsson.se/assets/rachelzane.png"})} isOnline={false} isMe={activeChat.name === 'Rachel Zane' ? true : false} picture="http://emilcarlsson.se/assets/rachelzane.png" name="Rachel Zane" lastMessage="I was thinking that we could have chicken tonight, sounds good?" />
                        </ul>
                    </div>
                    {/* <div id="bottom-bar">
      <button id="addcontact"><i className="fa fa-user-plus fa-fw" aria-hidden="true" /> <span>Add contact</span></button>
      <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true" /> <span>Settings</span></button>
    </div> */}
                </div>
                {
                    Object.keys(activeChat).length === 0 ?
                    <div className="content">
                    </div>
                    :
                    <ContentChatting name={activeChat.name} picture={activeChat.picture} />

                }
            </div>

        </div>
    )
}

export default Chat
