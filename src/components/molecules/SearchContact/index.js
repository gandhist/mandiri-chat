import React, { useEffect, useState } from 'react'
import { API_URL } from '../../../config/api'
import { useToken } from '../../../utils/'

const SearchContact = ({ isShow, onClose, onClick }) => {
    const { token } = useToken()
    const local = JSON.parse(localStorage.getItem('userlogin'))
    const [contacts, setContacts] = useState([])
    const [contactsFiltered, setContactsFiltered] = useState([])
    const [isSearch, setIsSearch] = useState(false)
    useEffect(() => {
        fetch(`${API_URL}/contacts`, {
            headers: { "Authorization": `Bearer ${token}`, 'Content-Type': 'application/json' },
            method: 'GET',
        }).then(res => res.json())
            .then((res) => {
                setContacts(res.data)
            })
            .catch((err) => {
                console.log('err', err)
            })
    }, [token])

    const onTyping = (e) => {
        if (e.target.value !== "") {
            setIsSearch(true)
            const contactsFiltered = contacts.filter((el) => {
                return el.name.toLowerCase().includes(e.target.value)
            })
            setContactsFiltered(contactsFiltered)
        }
        else {
            setIsSearch(false)
        }
    }

    // handle onselect contact 
    const handleOnSelectContact = (data) => {
        onClick(data)
    }

    const ContactLists = () => {
        if (isSearch) {
            if (contactsFiltered.length > 0) {
                return (
                    contactsFiltered.map((contact) => {
                        return (
                            <div key={contact.id} className="list-group-item list-group-item-action bg-dark text-white" style={{ cursor: 'pointer' }} onClick={() => {
                                let roomId = `${local.id}_${contact.id}`
                                let dataSetChat = { id: contact.id, room_id: roomId, name: contact.name, picture: contact.picture, tipe: 'pc' }
                                handleOnSelectContact(dataSetChat)
                            }}>
                                <div className="d-flex flex-row bd-highlight">
                                    <img src={contact.picture} className="rounded" height="80" width="80" alt="..." />
                                    <div className="mr-2">&nbsp;&nbsp;&nbsp; </div>
                                    <div className="d-flex w-100 flex-column">
                                        <h5 className="mb-1">{contact.name}</h5>
                                        <small>Winter is coming</small>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )
            }
            else {
                return <div>Tidak ada data</div>
            }
        }
        else {
            if (contacts.length > 0) {
                return (
                    contacts.map((contact) => {
                        return (
                            <div key={contact.id} className="list-group-item list-group-item-action bg-dark text-white" style={{ cursor: 'pointer' }} onClick={() => {
                                let roomId = `${local.id}_${contact.id}`
                                handleOnSelectContact({ id: contact.id, name: contact.name, picture: contact.picture, tipe: 'pc', room_id: roomId })
                            }} >
                                <div className="d-flex flex-row bd-highlight">
                                    <img src={contact.picture} className="rounded" height="80" width="80" alt="..." />
                                    <div className="mr-2">&nbsp;&nbsp;&nbsp; </div>
                                    <div className="d-flex w-100 flex-column">
                                        <h5 className="mb-1">{contact.name}</h5>
                                        <small>Winter is coming</small>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )
            }
            else {
                return <div>Tidak ada data</div>
            }
        }
    }

    return (
        <div className={`modal fade ${isShow && 'show'}`} id="exampleModalCenteredScrollable" tabIndex={-1} aria-labelledby="exampleModalCenteredScrollableTitle" aria-modal="true" role="dialog" style={{ display: isShow ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content text-white" style={{ backgroundColor: '#32465a' }} >
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenteredScrollableTitle">Select Contact</h5>
                        <button type="button" onClick={onClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                    </div>
                    <div className="modal-body">
                        <div className="input-group mb-3">
                            <button className="btn btn-outline-light" type="button" id="button-addon2"> <i className="fa fa-search fa-fw" aria-hidden="true" />Search</button>
                            <input type="text" className="form-control" placeholder="Search Contact" aria-label="Recipient's username" aria-describedby="button-addon2" onKeyUp={(e) => { onTyping(e) }} />
                        </div>
                        <div className="list-group">
                            <ContactLists />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default SearchContact
