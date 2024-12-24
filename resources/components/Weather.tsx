import React, { useEffect, useState } from "react";

import {SetTimeZone} from "../components/Watch"
import { SetWatchToLoading } from "../components/Watch";

import { OrbitProgress } from "react-loading-indicators";


let apiCallSuccessful = false;

// WeatherAPI
let location = 'London'
let loadedLocation = '';
let currentInput = '';
const weatherAPIKey = '0400ec3680a64f74bd6165001240912';
let apiUrl = 'http://api.weatherapi.com/v1/current.json?key=' + weatherAPIKey + '&q=';

const defaultLocation = 'Berlin';

const weatherData = {
    apiCallWeatherFinished: false,
    timeZone: '',
    temparature: 0,
    conditionText: '',
    conditionIconSrc: ''
}

function Weather(){    
    
    const[locationString, setLocationString] = useState(location);
    const[conditionIconSource, setConditionIconSource] = useState('');
    const[conditionText, setConditionText] = useState('');

    // If the API call was successful, we update the UI:
    function UpdateUI() {
        setLocationString(location);

        setConditionIconSource(weatherData.conditionIconSrc);
        setConditionText(weatherData.conditionText);
    }

    function HandleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        currentInput = e.target.value;
    }
    
    function OnUpdateButton(){
        console.log('Checking if location input is valid...');
        location = currentInput;
        weatherData.apiCallWeatherFinished = false;
        SetWatchToLoading(true);
        CallWeatherAPI();
    }

    function CallWeatherAPI(){
        if(weatherData.apiCallWeatherFinished === true){return;}
        const url = apiUrl + location + '&aqi=no';
        console.log('Calling Weather API...');
        fetch(url)
        .then(response => response.json())
        .then(data => {
              weatherData.temparature = data.current.temp_c;
              weatherData.timeZone = data.location.tz_id;
              weatherData.conditionIconSrc = data.current.condition.icon;
              weatherData.conditionText = data.current.condition.text;
    
              loadedLocation = location;
              weatherData.apiCallWeatherFinished = true;
              apiCallSuccessful = true;

              // We set the time zone on the watch:
              SetTimeZone(weatherData.timeZone);
              // We update the UI:
              UpdateUI();

              console.log('API Call for Weather finished');
        }).then(() => {
            
        })
        .catch(error => { 
            console.error("Error calling weather API", error);
            apiCallSuccessful = false;
            window.alert('Location Not Found!');
            SetWatchToLoading(false);
        });
    }
    
    // We reload if the location changed:
    useEffect(() =>{
        weatherData.apiCallWeatherFinished = false;
        SetWatchToLoading(true);
        CallWeatherAPI();
    }, [location]);

   if(weatherData.apiCallWeatherFinished === false){
    return <OrbitProgress color="white"></OrbitProgress>
   }
   else{
    return (<div className="weatherContainer">
    
        <div className="locationConditionContainer">
            <p id="loadedLocation" >{locationString}</p>
            
            <div className="conditionContainer">
                <img id="conditionIcon" src={conditionIconSource}></img>
                <p id="conditionText">{conditionText}</p>
            </div>
        </div>
        
    
        <div className="locationChangeContainer">
            <input id="locationInput" className="locationInput" title="Enter your location" onChange={(e: React.ChangeEvent<HTMLInputElement>) => HandleInputChange(e)}/>
            <button id="updateButton" className="updateButton" title="Update your location" onClick={OnUpdateButton}></button>
        </div>

    </div>);
   }

}

export default Weather;

export function SetLocation(newLoc:string){
    console.log('New Location: ' + newLoc);

    if(newLoc==='world!'){ location = 'Berlin'; }
    else{ location = newLoc; }

}

