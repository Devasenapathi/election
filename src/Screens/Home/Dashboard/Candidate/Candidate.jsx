import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Candidate = (props) => {
    const [details, setDetails] = useState([])

    useEffect(() => {
        const values = new Set()
        const uniqueArray = props.data.filter((item) => {
            const value = item['totalVotes'];
            if (!values.has(value)) {
                values.add(value);
                return true;
            }
            return false;
        });
        setDetails(uniqueArray)
    }, [props.data])
    const getDetails = () => {
        return (
            <table className="table table-responsive table-striped-columns">
                <thead className='table-dark'>
                    <tr>
                        <th scope="col">CandidateName</th>
                        <th scope="col">Constituency</th>
                        <th scope="col">Age</th>
                        <th scope="col">Party</th>
                        <th scope="col">Result</th>
                        <th scope="col">Total Vote</th>
                    </tr>
                </thead>
                <tbody>
                    {details.map(value => (
                        <tr key={value._id}>
                            <td><Link to={'/candidate'} state={{ from: value }} >{value.candidateName}</Link></td>
                            <td>{value.constituency}</td>
                            <td>{value.age !== 'Unknown' ? value.age : '-'}</td>
                            <td>{value.party}</td>
                            <td>{value.result === 'Winner' ? <div className='w-150 h-25 bg-success text-white text-center'>{value.result}</div> : <div className='w-150 h-25 bg-danger text-white text-center'>{value.result}</div>}</td>
                            <td>{value.totalVotes}</td>
                        </tr>
                    ))}

                </tbody>
            </table>
        )
    }
    return (
        <div>
            <div>
                {details.length > 0 ? getDetails() : ''}
            </div>
        </div>
    )
}

export default Candidate
