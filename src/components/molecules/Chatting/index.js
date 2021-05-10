import React from 'react'

const Chatting = ({ isMe, picture, message, time }) => {
  return (
    <>
    <li className={isMe ? 'replies' : 'sent'}>
      {/* <img src={picture} alt="" /> */}
      <p>{message}</p>
    </li>
      {/* <span>{time}</span> */}
    </>
  )
}

export default Chatting
