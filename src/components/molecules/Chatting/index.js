import React from 'react'
import PreviewLink from './PreviewLink'

const PlainText = ({message}) => {
  return (
    <p>{message}</p>
  )
}



const Chatting = ({ isMe, picture, message, time }) => {
  const Message = ({message}) => {
    // if(message.includes('http')){
    //   return <PreviewLink link={message} /> 
    // }
    return <PlainText message={message} />
  }
  return (
    <>
    <li className={isMe ? 'replies' : 'sent'}>
      {/* <img src={picture} alt="" /> */}
      <Message message={message} />
    </li>
      {/* <span>{time}</span> */}
    </>
  )
}

export default Chatting
