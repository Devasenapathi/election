import React from "react";
import "./Dashboard.css";
import { useEffect, useState, useReducer } from 'react';
import axios from 'axios';
import PieChart from "./majorityPieChart/PieChart";
import Candidate from "./Candidate/Candidate";
import Majority from "./majorityPieChart/Majority";

const Dashboard = () => {
  const [states, setStates] = useState([])
  const [constituency, setConstituency] = useState([])
  const [year, setYear] = useState([])
  const [fullDetails, setFullDetails] = useState([])
  const [details, setDetails] = useState([])
  const [list, setList] = useState([])
  const [selectedState, setSelectedState] = useState()
  const [selectedYear, setSelectedYear] = useState()
  const [selectedConstituency, setSelectedConstituency] = useState()
  const [electionType, setElectionType] = useState()


  const data = [
    { label: 'Category A', value: 30, color: 'red' },
    { label: 'Category B', value: 40, color: 'blue' },
    { label: 'Category C', value: 20, color: 'green' },
  ];

  const object = [
    { id: 1, type: 'LOKSHABA', value: 'L' },
    { id: 2, type: 'ASSEMBLY', value: 'A' }
  ]
  useEffect(() => {
    fetchData()
  }, []);

  const fetchData = () => {
    axios.get("main/getState").then((v) => {
      setStates(v.data)
    })

  }

  useEffect(() => {
    if (electionType !== undefined) {
      if (electionType === 'L') {
        const data = states.filter((e) => e.state === selectedState)
        setConstituency(data[0].lokshaba)

      } else {
        const data = states.filter((e) => e.state === selectedState)
        setConstituency(data[0].assembly)
      }
    }
  }, [selectedState])

  useEffect(() => {
    if (selectedYear !== undefined) {
      setList(details.filter((a) => a.year === selectedYear))
    }
  }, [details])

  const handleState = (e) => {
    setSelectedYear(undefined)
    setConstituency([])
    setYear([])
    setSelectedState(e)
  }

  const handleType = (e) => {
    setElectionType(e)
    setSelectedYear(undefined)
    setSelectedConstituency(undefined)
    setConstituency([])
    setYear([])
    setFullDetails([])
    setList([])
    setSelectedYear(undefined)
    if (selectedState !== undefined) {
      if (e === 'L') {
        const data = states.filter((e) => e.state === selectedState)
        setConstituency(data[0].lokshaba)

      } else {
        console.log(states, "assembly data")
        const data = states.filter((e) => e.state === selectedState)
        setConstituency(data[0].assembly)

      }
    } else {
      console.log("I cannot work here")
    }
  }

  const handleConstituency = (e) => {
    setSelectedConstituency(e)
    var years = []
    var value = {
      "electionId": electionType,
      "state": selectedState,
      "constituency": e,
    }
    axios.get('/main/getDetails', { params: value }).then((item) => {
      setDetails(item.data)
      item.data.map((y) => {
        years.push(y.year)
      })
      const uniqueArray = Array.from(new Set(years));
      setYear(uniqueArray.slice().sort((a, b) => b - a))
    })
  }

  const handleYear = (e) => {
    setSelectedYear(e)
    setList(details.filter((a) => a.year === e))
    var value = {
      "electionId": electionType,
      "state": selectedState,
      "constituency": selectedConstituency,
      "year": e,
    }
    axios.get('/main/getTotalVotes', { params: value }).then((item) => {
      setFullDetails(item.data)
    })


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

      <div className="col-9">
        <div className="text-center">
          <h3>{selectedState}</h3>
        </div>

        <div className="m-3 d-flex justify-content-center align-items-center">
          <div className="ms-5">
            <select value={electionType} className='btn btn-success dropdown-toggle' onChange={(e) => handleType(e.target.value)}>
              <option key={0}>Select Election Type</option>
              {selectedState !== undefined ?
                object.map((element) => (
                  <option key={element.id} value={element.value}>{element.type}</option>
                ))
                : <option disabled>
                  <span>Loading...</span>
                </option>}
            </select>
          </div>

          <div className="ms-5">
            <select value={selectedConstituency} onChange={e => handleConstituency(e.target.value)} className='btn btn-primary dropdown-toggle'>
              <option key={1}>Select Contituency</option>
              {constituency.length === 0 ?
                <option disabled>
                  <span>Loading...</span>
                </option> : constituency.map(value => (
                  <option key={value} value={value} className='dropdown-item'>{value}</option>
                ))}
            </select>
          </div>

          <div className="ms-5">
            <select value={selectedYear} className='btn btn-secondary dropdown-toggle' onChange={e => handleYear(e.target.value)}>
              <option key={2}>Select Year</option>
              {year.length === 0 ?
                (<option disabled>
                  <span role="status">Loading...</span>
                </option>) : year.map((e) => (
                  <option key={e} value={e} className="dropdown-item">{e}</option>
                ))}
            </select>
          </div>
        </div>


        {selectedYear !== undefined ? <div className="overflow text-center m-5">
          <div className="row d-flex justify-content-center">
            <div className="col-6 mr-5">
              <PieChart data={fullDetails} />
            </div>
            <div className="col-3 ml-5">
              <Majority data={fullDetails} />
            </div>
          </div>
        </div> : ""}

        <div className="text-center">
          {selectedYear !== undefined ? <div>
            <Candidate data={list} />
          </div> : 'Select state...'}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
