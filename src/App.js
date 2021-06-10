import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {useState, useEffect} from "react"
import { MenuItem, FormControl,Select,Card,CardContent} from "@material-ui/core"
import "./App.css"
import Infobox from "./Infobox"
import Map from "./Map"
import Table from "./Table"
import {sortData} from "./util.js"
import LineGraph from "./LineGraph.js"
//https://disease.sh/v3/covid-19/countries


function App() {
  const [countries,setCountries] = useState([])
  const [country,setCountry] = useState("worldwide")
  const [countryInfo,setcountryInfo] = useState({});
  const [tableData,setTableData] = useState([]);

  useEffect(()=>{
       fetch("https://disease.sh/v3/covid-19/all")
      .then(response=>response.json())
      .then(data=>{
        setcountryInfo(data);
      })
  },[])


  useEffect(()=>{
    const getCountriesData = async()=>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country) => (
          { 
            name : country.country,
            value : country.countryInfo.iso2,
          }
        ))
        const sortedData = sortData(data)
        setTableData(sortedData);
        setCountries(countries);
      })
    }
    getCountriesData();
    
  },[])
  const handleChange = async (event)=>{
    const countryCode = event.target.value;

    const url = countryCode === "worldwide"  
    ? "https://disease.sh/v3/covid-19/all" 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response=>response.json())
    .then(data =>{
      setCountry(countryCode);  
      setcountryInfo(data);
        
    })

  }
  return (
      <div className = "app">
        {/*Header*/}
        <div className = "app__left">
        <div className = "app__header">
          <h1>Covid 19 Tracker</h1>
        {/*Title+ Input dropdown*/}
        <FormControl className = "app__dropdown">
            <Select variant = "outlined" value = {country}
            onChange = {handleChange}>
                {/*Loop MenuItem */}
                <MenuItem value = "worldwide">Worldwide</MenuItem>
                {
                  countries.map((country,index)=>{
                  return <MenuItem key = {index} value = {country.value}>{country.name}</MenuItem>
                  })
                }
            </Select>
        </FormControl>
        </div>
        
        {/*Infobox*/}
        <div className = "app__stats">
          <Infobox title = "Coronavirus Cases" cases = {countryInfo.todayCases} total = {countryInfo.cases}/>
          <Infobox title = "Recovered" cases ={countryInfo.todayRecovered} total = {countryInfo.recovered}/>
          <Infobox title = "Deaths" cases = {countryInfo.todayDeaths} total = {countryInfo.deaths}/>
          {/*Covid Cases */}
          {/*Covid Recoveries */}
        </div>
        {/*Map*/}
        <Map/>
        </div>
        <Card className = "app_left">
          <CardContent>
              <h3>Live Cases by Countries</h3>
                {/*Table*/}
                <Table countries = {tableData}/>
              <h3>Worldwide new Cases</h3>
                {/*Graph*/}
              <LineGraph/>
          </CardContent>
         </Card>      
    </div>
  );
}

export default App;
