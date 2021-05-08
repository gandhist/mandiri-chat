import React from 'react'

const ListIndex = ({isOnline, isMe, picture, name, lastMessage, onClick}) => {
    return (
        <li className={`contact ${isMe && 'active'} `} onClick={onClick} >
          <div className="wrap">
            <span className={`contact-status ${isOnline && 'online'} `} />
            <img src={picture} alt="" />
            <div className="meta">
              <p className="name">{name}</p>
              <p className="preview">{lastMessage}</p>
            </div>
          </div>
        </li>
    )
}

export default ListIndex
