import React from 'react';
import './Assembly.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

const Assembly = () => {
  const [states, setStates] = useState([])
  const [constituency, setConstituency] = useState()
  const [selectedState, setSelectedState] = useState()
  const [index, setIndex] = useState()
  const [details, setDetails] = useState([])

  //  useEffects calls the fetcData funcrion which makes an api call.
  //  Then the fetchData function store the data values in setStates
  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = () => {
    axios.get("main/getAssembly").then((v) => {
      setStates(v.data)
    })
  }

  //this function used to find the index of the state selected and then assigned to index state
  const handleState = (e) => {
    setSelectedState(e)
    const index = states.findIndex(item => item.state === e)
    setIndex(index)
  }

  const handleConstituency = (e) => {
    setConstituency(e)
    var value = {
      "electionId":"A",
      "state": selectedState,
      "constituency": e,
    }
    axios.get('/main/getAssemblyData/', { params: value }).then((item) => {
      setDetails(item.data)
    })
  }

  const getState = () => { 
    return (
      <div >
        <select value={selectedState} on Change={e => handleState(e.target.value)} className='btn btn-primary dropdown-toggle'>
          <option>Select state</option>
          {states.map((value) => (
            <option key={value._id} value={value.state}>{value.state}</option>
          ))}
        </select>
      </div>
    );
  }


  const getConstituency = () => {
    return (
      <div className='ms-3'>
        <select value={constituency} onChange={e => handleConstituency(e.target.value)} className='btn btn-success dropdown-toggle'>
          <option>Select Contituency</option>
          {states[index].constituency.map(value => (
            <option key={value} value={value} className='dropdown-item'>{value}</option>
          ))}
        </select>
      </div>
    );
  }

  const getDetails = () => {
    return (
      <table className="table table-striped-columns">
        <thead>
          <tr>
            <th scope="col">CandidateName</th>
            <th scope="col">Age</th>
            <th scope="col">Party</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {details.map(value => (
            <tr key={value._id}>
              <td>{value.candidateName}</td>
              <td>{value.age!=='Unknown'?value.age:'Nan'}</td>
              <td>{value.party}</td>
              <td>{value.result}</td>
            </tr>
          ))}

        </tbody>
      </table>
    )
  }


  return (
    <>
      <div className='assembly'>
        <h5>Assembly Constituency</h5>
        <div className='grid p-10 mt-4'>
        <div className='d-flex mb-5'>
          <div className='g-col-6'>
            {getState()}
          </div>
          <div className='g-col-6'>
            {index !== undefined && index !== -1 ? getConstituency() : ''}
          </div>
          </div>
          <div>
            {details.length > 0 ? getDetails() : ''}
          </div>
        </div>
      </div>
    </>
  );
}

export default Assembly
