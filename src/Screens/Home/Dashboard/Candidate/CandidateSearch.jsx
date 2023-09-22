import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

const CandidateSearch = (props) => {
  const location = useLocation();
  const [candidate, setCandidate] = useState('');
  const [selectedState, setSelectedState] = useState();
  const [selectedParty, setSelectedParty] = useState();
  const [selectedConstituency, setSelectedConstituency] = useState();
  const [loader, setLoader] = useState(false)
  const [states, setStates] = useState([]);
  const [candidateList, setCandidateList] = useState([]);
  const [parties, setParties] = useState([]);
  const [candidateFilter, setCandidateFilter] = useState([]);
  const [constituency, setConstituency] = useState([]);

  useEffect(() => {
    fetchCandidate()
    fetchData()
  }, []);

  const fetchCandidate = () => {
    if (location.state !== null) {
      setLoader(true)
      const regex = /,|\b\w\b|\b\w\w\b/g
      var result = location.state.from.candidateName.replace(regex, '').trim()
      // var result = result1.replace(regex1,'').trim()
      setSelectedState(location.state.from.state)
      setCandidate(result)
      const value = {
        state: location.state.from.state,
        candidate: result
      }
      axios.get("main/getCandidate", { params: value }).then((res) => {
        const party = []
        const constituencies = []
        res.data.map((value) => {
          party.push(value.party)
          constituencies.push(value.constituency)
        })
        const arr = Array.from(new Set(party))
        const constitute = Array.from(new Set(constituencies))
        setLoader(false)
        setConstituency(constitute.sort())
        setParties(arr.sort())
        setCandidateList(res.data.filter((items) => (items.constituency === location.state.from.constituency && items.party === location.state.from.party)))
      })
    }
  }

  const fetchData = () => {
    axios.get("main/getState").then((v) => {
      setStates(v.data)
    })

  }

  const notify = (e) => toast.error(e)

  const handleState = (e) => {
    setCandidate('')
    setCandidateFilter([])
    setCandidateList([])
    setParties([])
    setConstituency([])
    setSelectedParty(undefined)
    setSelectedConstituency(undefined)
    setSelectedState(e)
  }

  useEffect(() => {
    setCandidateFilter([])
    setCandidateList([])
    setParties([])
    setConstituency([])
    setSelectedParty(undefined)
    setSelectedConstituency(undefined)
  }, [candidate])


  const handleSubmit = () => {
    setLoader(true)
    setSelectedConstituency(undefined)
    setSelectedParty(undefined)
    setConstituency([])
    setCandidateFilter([])
    setParties([])
    const value = {
      state: selectedState,
      candidate: candidate
    }
    axios.get("main/getCandidate", { params: value }).then((res) => {
      if (res.data.length === 0) {
        notify(`No! candidates found in ${selectedState}`)
      }
      const party = []
      const constituencies = []
      res.data.map((value) => {
        party.push(value.party)
        constituencies.push(value.constituency)
      })
      const arr = Array.from(new Set(party))
      const constitute = Array.from(new Set(constituencies))
      setLoader(false)
      setConstituency(constitute.sort())
      setParties(arr.sort())
      setCandidateList(res.data)
    })
  }

  useEffect(() => {
    if (selectedConstituency) {
      const data = candidateList.filter((items) => { return items.party === selectedParty && items.constituency === selectedConstituency })
      if (data.length === 0) {
        notify(`No! ${candidate} found in ${selectedConstituency} for ${selectedParty}`)
        setConstituency(candidateList.filter((items) => items.party === selectedParty))
        setCandidateFilter(candidateList.filter((items) => items.party === selectedParty))
      } else {
        setConstituency(candidateList.filter((items) => items.party === selectedParty))
        setCandidateFilter(candidateList.filter((items) => items.party === selectedParty))
      }

    } else {
      setCandidateFilter(candidateList.filter((items) => items.party === selectedParty))
      setConstituency(candidateList.filter((items) => items.party === selectedParty))
    }
  }, [selectedParty])


  const handleConstituency = (e) => {
    setSelectedConstituency(e)
    if (selectedParty) {
      const data = candidateList.filter((items) => { return items.party === selectedParty && items.constituency === e })
      if (data.length === 0) {
        notify(`No! candidate found in ${e} ${selectedParty}`)
        setCandidateFilter(candidateList.filter((items) => items.party === selectedParty))
      }
      setCandidateFilter(data)
    } else {
      setCandidateFilter(candidateList.filter((items) => items.constituency === selectedConstituency))
    }
  }

  return (
    <div className="d-flex">
      <div className="col-2.5">
        <div className="list-group d-flex flex-column gap-2 text-center">
          {states.map((value) => (
            <button type="button" className={`list-group-item list-group-item-action ${selectedState === value.state ? 'active' : ''}`} value={value.state} onClick={(e) => handleState(e.target.value)}>{value.state}</button>
          ))}
        </div>
      </div>

      <div className="col-10">
        <div className="text-center">
          <h3>{selectedState}</h3>
        </div>

        {selectedState ?
          <input type="text" className='form-control-lg col-3 p-2 m-2' placeholder="Candidate Name" aria-label="CandidateName" name="candidate" value={candidate} onChange={(e) => setCandidate(e.target.value)}></input>
          : ''}
        {parties.length > 1 ?
          <select className='form-control-lg p-2 m-2' value={selectedParty} onChange={(e) => setSelectedParty(e.target.value)}>
            <option key={"Select Party"}>Select Party</option>
            {parties.map(items => (
              <option key={items} value={items}>{items}</option>
            ))}
          </select>
          : ""}

        {constituency.length > 1 ?
          <select className='form-control-lg p-2 m-2' value={selectedConstituency} onChange={(e) => handleConstituency(e.target.value)}>
            <option key={"Select Party"}>Select Constituency</option>
            {constituency.map(items => (
              <option key={items._id} value={items.constituency}>{items.constituency}</option>
            ))}
          </select>
          : ""}
        {selectedState ?
          <button type='button' className="btn btn-primary col-3" onClick={handleSubmit}>
            {loader ?
              <div>
                <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
              </div>
              : "Search"}
          </button>
          : ""}

        {!selectedState ?
          <div className='text-center text-danger'>
            <h3>Select state</h3>
          </div> : ''}


        {loader ?
          <div className="text-center d-felx">
            <div className="spinner-grow mt-5 pt-5 text-primary" style={{ width: "5rem", height: "5rem" }} role="status">
            </div>
          </div>
          : ""
        }

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

        {candidateList.length !== 0 || candidateFilter.length !== 0 ?
          <table className="table table-responsive table-striped-columns">
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
              {candidateFilter.length !== 0 ?
                candidateFilter.map(value => (
                  <tr key={value._id}>
                    <td>{value.electionId}</td>
                    <td>{value.candidateName}</td>
                    <td>{value.constituency}</td>
                    <td>{value.year}</td>
                    <td>{value.age !== 'Unknown' ? value.age : '-'}</td>
                    <td>{value.party}</td>
                    <td>{value.result === 'Winner' ? <div className='w-150 h-25 bg-success text-white text-center'>{value.result}</div> : <div className='w-150 h-25 bg-danger text-white text-center'>{value.result}</div>}</td>
                    <td>{value.totalVotes}</td>
                  </tr>
                )) : candidateList.map(value => (
                  <tr key={value._id}>
                    <td>{value.electionId}</td>
                    <td>{value.candidateName}</td>
                    <td>{value.constituency}</td>
                    <td>{value.year}</td>
                    <td>{value.age !== 'Unknown' ? value.age : '-'}</td>
                    <td>{value.party}</td>
                    <td>{value.result === 'Winner' ? <div className='w-150 h-25 bg-success text-white text-center'>{value.result}</div> : <div className='w-150 h-25 bg-danger text-white text-center'>{value.result}</div>}</td>
                    <td>{value.totalVotes}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          : ""}
      </div>
    </div>
  )
}

export default CandidateSearch
