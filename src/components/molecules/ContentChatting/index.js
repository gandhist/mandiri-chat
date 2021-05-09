import React, { useEffect, useState, useRef } from 'react'
import Chatting from "../Chatting";
import IO from "socket.io-client";
const dotenv = require('dotenv');
// get config vars
dotenv.config();
const ENDPOINT = "http://localhost:5000";
let socket;
const local = JSON.parse(localStorage.getItem('userlogin'))

const ContentChatting = ({ id, name, picture }) => {
    const messagesEndRef = useRef(null);
    const [listChats, setListChats] = useState([])
    const [message, setMessage] = useState("")


    const scrollToBottom = () => {
        const scroll = messagesEndRef.current.scrollHeight - messagesEndRef.current.clientHeight;
        messagesEndRef.current.scrollTo(0, scroll)
    };

    useEffect(() => {
        const getListMessage = () => {
            fetch(`http://localhost:5000/api/v1/getChat/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${local.token}`,
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json())
                .then((res) => {
                    setListChats(res.data)
                })
                .catch((err) => {
                    console.log('err', err)
                })
        }
        getListMessage()
        scrollToBottom()
    }, [id])

    useEffect(() => {
        socket = IO(ENDPOINT, {
            auth: {
                jwtToken: local?.token
            }
        });
        socket.emit('joinRoom', { username: local.name, room: id })
    }, [id])

    useEffect(() => {
        const getMessage = socket.on('message', message => {
            setListChats(msgs => [...msgs, message])
            scrollToBottom()
        })
        return () => getMessage();
    }, [])



    const handleSend = (e) => {
        e.preventDefault();
        socket.emit("chatMessage", { msg: message, username: local.id, room: id }) // emit the message to server
        setMessage("")
        scrollToBottom()
    }
    return (
        <div className="content">
            <div className="contact-profile">
                <img src={picture} alt="" />
                <p>{name}</p>
                {/* <div className="social-media">
                    <i className="fa fa-facebook" aria-hidden="true" />
                    <i className="fa fa-twitter" aria-hidden="true" />
                    <i className="fa fa-instagram" aria-hidden="true" />
                </div> */}
            </div>
            <div className="messages" ref={messagesEndRef}>
                <ul>
                    {
                        listChats.map((item, index) => {
                            const isMe = local.id === parseInt(item.send_by) ? true : false;

                            const myPic = "http://emilcarlsson.se/assets/mikeross.png"
                            return <Chatting key={index} isMe={isMe} picture={isMe ? myPic : picture} message={item.message} />
                        })
                    }
                </ul>
            </div>
            <div className="message-input">
                <div className="wrap">
                    <form onSubmit={handleSend} >
                        <input type="text" placeholder="Write your message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                        <i className="fa fa-paperclip attachment" aria-hidden="true" />
                        <button className="submit" >
                            <i className="fa fa-paper-plane" aria-hidden="true" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ContentChatting
