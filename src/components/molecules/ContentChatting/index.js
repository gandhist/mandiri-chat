import React from 'react'
import Chatting from "../Chatting";


const ContentChatting = ({ name, picture }) => {
    return (
        <div className="content">
            <div className="contact-profile">
                <img src={picture} alt="" />
                <p>{name}</p>
                <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true" />
                    <i className="fa fa-twitter" aria-hidden="true" />
                    <i className="fa fa-instagram" aria-hidden="true" />
                </div>
            </div>
            <div className="messages">
                <ul>
                    <Chatting isMe={true} picture="http://emilcarlsson.se/assets/mikeross.png" message="How the hell am I supposed to get a jury to believe you when I am not even sure that I do?!" />
                    <Chatting isMe={false} picture={picture} message="When you're backed against the wall, break the god damn thing down." />
                </ul>
            </div>
            <div className="message-input">
                <div className="wrap">
                    <input type="text" placeholder="Write your message..." />
                    <i className="fa fa-paperclip attachment" aria-hidden="true" />
                    <button className="submit">🚀
                                <i className="fa fa-paper-plane" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ContentChatting
