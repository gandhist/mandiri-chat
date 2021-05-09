import React from 'react'

const Chatting = ({ isMe, picture, message }) => {
  return (
    <li className={isMe ? 'replies' : 'sent'}>
      <img src={picture} alt="" />
      <p>{message}</p>
    </li>
  )
}

export default Chatting
