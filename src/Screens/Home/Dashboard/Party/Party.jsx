import React, { useEffect } from 'react'
import axios from 'axios';
import { useState } from 'react';
import Pagination from '../../../../utils/Pagination';
import { Link } from 'react-router-dom';

const Party = () => {
    const [selectedState, setSelectedState] = useState()
    const [selectedParty, setSelectedParty] = useState()
    const [selectedConstituency, SetSelectedConstituency] = useState()
    const [loader, setLoader] = useState(false)
    const [party, setParty] = useState([])
    const [states, setStates] = useState([]);
    const [parties, setParties] = useState([])
    const [partyFilter, setPartyFilter] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [constituency, setConstituency] = useState([])

    const indexOfLastItem = currentPage * 1000;
    const indexOfFirstItem = indexOfLastItem - 1000;
    let currentItems = []
    if (partyFilter.length > 0) {
        currentItems = partyFilter;
    } else {
        currentItems = party.slice(indexOfFirstItem, indexOfLastItem)
    }


    const paginate = pageNumber => setCurrentPage(pageNumber);
    useEffect(() => {
        fetchData()
    }, []);

    const fetchData = () => {
        axios.get("main/getState").then((v) => {
            setStates(v.data)
        })
    }

    const handleState = (e) => {
        setLoader(true)
        setSelectedParty(undefined)
        setConstituency([])
        setParties([])
        setParty([])
        setPartyFilter([])
        setSelectedState(e)
        axios.get("main/getParty", { params: { "state": e } }).then((v) => {
            const party = []
            const constituencies = []
            v.data.map((value) => {
                party.push(value.party)
                constituencies.push(value.constituency)
            })
            const arr = Array.from(new Set(party))
            const constitute = Array.from(new Set(constituencies))
            setLoader(false)
            setConstituency(constitute.sort())
            setParties(arr.sort())
            setParty(v.data)
        })
    }

    const handleChange = (e) => {
        setSelectedParty(e)
        setPartyFilter(party.filter(items => items.party === e))
    }

    const handleConstituency = (e) => {
        SetSelectedConstituency(e)
        setPartyFilter(party.filter((items) => (items.constituency === e)))
    }

    return (
        <div className='d-flex'>
            <div className="col-2.5">
                <div className="list-group d-flex flex-column gap-2 text-center">
                    {states.map((value) => (
                        <button type="button" className={`list-group-item list-group-item-action ${selectedState === value.state ? 'active' : ''}`} value={value.state} onClick={(e) => handleState(e.target.value)}>{value.state}</button>
                    ))}
                </div>
            </div>

            <div className="col-8">
                <div className="text-center">
                    <h3>{selectedState}</h3>
                </div>

                {parties.length > 1 ?
                    <select className='form-control-lg m-3' value={selectedParty} onChange={(e) => handleChange(e.target.value)}>
                        <option key={"Select Party"}>Select Party</option>
                        {parties.map(items => (
                            <option key={items} value={items}>{items}</option>
                        ))}
                    </select> : ""}

                {constituency.length > 1 ?
                    <select className='form-control-lg ms-3 me-3 mb-3' value={selectedConstituency} onChange={(e) => handleConstituency(e.target.value)}>
                        <option key={"Select Party"}>Select Constituency</option>
                        {constituency.map(items => (
                            <option key={items} value={items}>{items}</option>
                        ))}
                    </select> : ""}


                {/* <Pagination
                    itemsPerPage={1000}
                    totalItems={party.length}
                    paginate={paginate}
                /> */}

                {!selectedState ?
                    <div className='text-center text-danger'>
                        <h3>Select state</h3>
                    </div> : ''}


                {loader ?
                    <div className="d-flex justify-content-center align-items-center">
                        <div className="spinner-grow mt-5 pt-5 text-primary" style={{ width: "5rem", height: "5rem" }} role="status">
                        </div>
                    </div>
                    : ""
                }


                {parties.length !== 0 || partyFilter.length !== 0 ?
                    <table className="table table-responsive ms-5 table-striped-columns">
                        <thead className='table-dark'>
                            <tr>
                                <th scope="col">Election_Type</th>
                                <th scope="col">CandidateName</th>
                                <th scope="col">Contituency</th>
                                <th scope="col">Year</th>
                                <th scope="col">Age</th>
                                <th scope="col">Party</th>
                                <th scope="col">Result</th>
                                <th scope="col">Total Vote</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length !== 0 ?
                                currentItems.map(value => (
                                    <tr key={value._id}>
                                        <td>{value.electionId}</td>
                                        <td><Link to={'/candidate'} state={{ from: value }} >{value.candidateName}</Link></td>
                                        <td>{value.constituency}</td>
                                        <td>{value.year}</td>
                                        <td>{value.age !== 'Unknown' ? value.age : '-'}</td>
                                        <td>{value.party}</td>
                                        <td>{value.result === 'Winner' ? <div className='w-150 h-25 bg-success text-white text-center'>{value.result}</div> : <div className='w-150 h-25 bg-danger text-white text-center'>{value.result}</div>}</td>
                                        <td>{value.totalVotes}</td>
                                    </tr>
                                )) : party.map(value => (
                                    <tr key={value._id}>
                                        <td>{value.electionId}</td>
                                        <td><Link to={'/candidate'} state={{ from: value }} >{value.candidateName}</Link></td>
                                        <td>{value.constituency}</td>
                                        <td>{value.year}</td>
                                        <td>{value.age !== 'Unknown' ? value.age : '-'}</td>
                                        <td>{value.party}</td>
                                        <td>{value.result === 'Winner' ? <div className='w-150 h-25 bg-success text-white text-center'>{value.result}</div> : <div className='w-150 h-25 bg-danger text-white text-center'>{value.result}</div>}</td>
                                        <td>{value.totalVotes}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table> :
                    ""
                }
                <Pagination
                    itemsPerPage={1000}
                    totalItems={party.length}
                    paginate={paginate}
                />
            </div>
        </div>
    )
}

export default Party
