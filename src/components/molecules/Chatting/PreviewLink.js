import React, { useEffect, useState }  from 'react'
import { Link } from 'react-router-dom'
import { API_URL } from '../../../config/api'
import useToken from '../../../utils/useToken'

const PreviewLink = ({link}) => {
    const [data, setData] = useState({})
    const {token} = useToken()

    const getMeta = async () => {
        await fetch(`${API_URL}/getMeta`, {
        headers: {"Authorization": `Bearer ${token}`, 'Content-Type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({url: link})
        }).then(res => res.json()).then((res) => {
        setData(res.data)
        })
    }

    useEffect(() => {
        getMeta()
    }, [])


  return (
    <Link target="_blank" to={link} >
    <div className="card mb-3 pull-right" style={{maxWidth: '540px'}}>
    {Object.keys(data).length > 0  && 
      <div className="row g-0">
        <div className="col-md-4">
          <img src={data.ogImage.url} height={data.ogImage.height} width={data.ogImage.width} alt="..." className="img-fluid"  />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{data.ogTitle}</h5>
            <p className="card-text">{data.ogDescription}</p>
          </div>
        </div>
      </div>
      }
      </div>
      </Link>
  )
}

export default PreviewLink
