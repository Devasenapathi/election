import React, { useEffect } from 'react'
import axios from 'axios';
import { useState } from 'react';
import Pagination from '../../../../utils/Pagination';
import { Link } from 'react-router-dom';
import { removeDuplicates } from '../../../../utils/duplicateremover';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sortingParty } from '../../../../utils/sorting';

const Party = () => {
    const [selectedState, setSelectedState] = useState()
    const [selectedParty, setSelectedParty] = useState()
    const [selectedConstituency, SetSelectedConstituency] = useState()
    const [selectedYear, setSelectedYear] = useState()
    const [loader, setLoader] = useState(false)
    const [year, setYear] = useState([])
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
    const notify = (e) => toast.error(e)

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
            const arr = removeDuplicates(v.data, 'party')
            const constitute = removeDuplicates(v.data, 'constituency')
            const years = removeDuplicates(v.data, 'year').sort((a, b) => b.year - a.year)
            setYear(years)
            setLoader(false)
            setConstituency(constitute)
            setParties(sortingParty(arr))
            setParty(v.data.sort())
        })
    }

    useEffect(() => {
        if (selectedConstituency) {
            const data = party.filter((items) => { return items.party === selectedParty && items.constituency === selectedConstituency })
            if (data.length === 0) {
                SetSelectedConstituency(undefined)
                notify(`No! candidates found in ${selectedConstituency} for ${selectedParty}`)
                const arr = removeDuplicates(party.filter((items) => items.party === selectedParty), 'constituency')
                setConstituency(arr)
                setPartyFilter(party.filter((items) => items.party === selectedParty))
            } else {
                const arr = removeDuplicates(data, 'constituency')
                setConstituency(arr)
                setPartyFilter(data)
            }

        } else {
            const data = party.filter((items) => items.party === selectedParty)
            const constitute = removeDuplicates(data, 'constituency')
            setPartyFilter(party.filter((items) => items.party === selectedParty))
            setConstituency(constitute)
        }
    }, [selectedParty])


    const handleConstituency = (e) => {
        SetSelectedConstituency(e)
        if (selectedParty) {
            if (selectedYear) {
                const data = party.filter((items) => { return items.party === selectedParty && items.year === selectedYear && items.constituency === e })
                if (data.length === 0) {
                    notify(`No! candidate found in ${e} for ${selectedParty} at ${selectedYear}`)
                    const value = party.filter((items) => { return items.party === selectedParty && items.constituency === e })
                    const years = party.filter((items) => items.party === selectedParty)
                    setYear(removeDuplicates(years, 'year').sort((a, b) => b.year - a.year))
                    setPartyFilter(value)
                } else {
                    setPartyFilter(data)
                }
            } else {
                const data = party.filter((items) => { return items.party === selectedParty && items.constituency === e })
                if (data.length === 0) {
                    notify(`No! candidate found in ${e} ${selectedParty}`)
                    setPartyFilter(party.filter((items) => items.party === selectedParty))
                } else {
                    setPartyFilter(data)
                    setYear(removeDuplicates(data, 'year').sort((a, b) => b.year - a.year))
                }
            }
        } else {
            setPartyFilter(party.filter((items) => items.constituency === selectedConstituency))
        }
    }

    useEffect(() => {
        if (selectedParty) {
            if (selectedConstituency) {
                const data = party.filter((items) => { return items.party === selectedParty && items.year === selectedYear && items.constituency === selectedConstituency })
                if (data.length === 0) {
                    const value = party.filter((items) => { return items.party === selectedParty && items.constituency === selectedConstituency })
                    const years = party.filter((items) => items.party === selectedParty)
                    setYear(removeDuplicates(years, 'year').sort((a, b) => b.year - a.year))
                    notify(`No candidates found in ${selectedYear} at ${selectedConstituency}`)
                    setPartyFilter(value)
                } else {
                    setPartyFilter(data)
                }
            } else {
                const data = party.filter((items) => { return items.party === selectedParty && items.year === selectedYear })
                if (data.length === 0) {
                    notify(`No candidates found in ${selectedYear} in ${selectedParty} `)
                } else {
                    setPartyFilter(data)
                }
            }
        } else {
            setPartyFilter(party.filter((items) => items.year === selectedYear))
        }
    }, [selectedYear])

    const resetParty = () => {
        const data = party.filter((items) => items.party === selectedParty)
        const constitute = removeDuplicates(data, 'constituency')
        setPartyFilter(party.filter((items) => items.party === selectedParty))
        setConstituency(constitute)
    }

    const resetYear = () => {
        const data = party.filter((items) => { return items.party === selectedParty && items.constituency === selectedConstituency })
        const years = party.filter((items) => items.party === selectedParty)
        const constitute = removeDuplicates(years, 'year').sort((a, b) => b.year - a.year)
        setPartyFilter(data)
        setYear(constitute)
    }

    return (
        <div className='d-flex'>
            {selectedState ?
                <ToastContainer
                    position="bottom-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored" />
                : ''}
            <div className="col-3 sideScroll overflow-scroll">
                <div style={{ height: '75vh' }}>
                    <div className="list-group d-flex flex-column gap-2 text-center">
                        {states.map((value) => (
                            <button type="button" className={`list-group-item list-group-item-action ${selectedState === value.state ? 'active' : ''}`} value={value.state} onClick={(e) => handleState(e.target.value)}>{value.state}</button>
                        ))}
                    </div>
                </div>
            </div>

            


            <div className="col-9 scroll overflow-scroll" style={{ height: '75vh' }}>
                <div className="text-center">
                    <h3>{selectedState}</h3>
                </div>
                {!selectedState ?
                <div className='text-center text-danger'>
                    <h3>Select State First...</h3>
                </div> : ''}

                <div className='d-flex'>
                {parties.length > 0 ?
                    <div>
                        <select className='form-control-lg ms-3 mb-3' value={selectedParty} onChange={(e) => setSelectedParty(e.target.value)}>
                            <option key={"Select Party"}>Select Party</option>
                            {parties.map(items => (
                                <option key={items._id} value={items.party}>{items.party}</option>
                            ))}
                        </select>
                    </div>
                    : ""}

                {parties.length > 0 ?
                    <div className='input-group ms-5 mb-3'>
                        <select className='form-control-lg' value={selectedConstituency} onChange={(e) => handleConstituency(e.target.value)}>
                            <option key={"Select Party"}>Select Constituency</option>
                            {constituency.map(items => (
                                <option key={items._id} value={items.constituency}>{items.constituency}</option>
                            ))}
                        </select>
                        {/* <button className="btn btn-outline-primary" type="button" onClick={resetParty}>reset</button> */}
                    </div>
                    : ""}

                {parties.length > 0 ?
                    <div className='input-group mb-3'>
                        <select className='form-control-lg' value={selectedYear} onChange={(e) => { setSelectedYear(e.target.value) }}>
                            <option key={0}>Select year</option>
                            {year.map(items => (
                                <option key={items._id} value={items.year}>{items.year}</option>
                            ))}
                        </select>
                        {/* <button className="btn btn-outline-primary" type="button" onClick={resetYear}>reset</button> */}
                    </div>
                    : ""}
                </div>


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
                {/* <Pagination
                    itemsPerPage={1000}
                    totalItems={party.length}
                    paginate={paginate}
                /> */}
            </div>
        </div>
    )
}

export default Party
