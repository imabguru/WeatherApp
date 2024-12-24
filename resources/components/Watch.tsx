import React, { useEffect, useState } from "react";
import { OrbitProgress } from "react-loading-indicators";

// let[timeZone, setTimeZone] = ['Europe/Berlin', SetTimeZone]
let timeZone = 'Europe/Berlin';
export let loading = false;
const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

let timeAPIURL = 'https://timeapi.io/api/time/current/zone?timeZone=';


const currentTime = {
    apiCallTimeFinished: false,
    hour: 0,
    minute: 0,
    second: 0,
    milliseconds: 0,

    day: 0,
    month: 0,
    dayOfWeek: ''
};

function Watch(){

    const[hourMinuteString, setHourMinuteString] = useState('--:--');
    const[secondsString, setSecondsString] = useState('--');

    const[dayOfWeekString, setDayOfWeekString] = useState('---');
    const[monthString, setMonthString] = useState('---');
    const[dayString, setDayString] = useState('--');

    // We define some functions upfront:
    const InitializeTime = () =>{
        setHourMinuteString(currentTime.hour.toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping: false }) + ':' + currentTime.minute.toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping: false }));
        setSecondsString(currentTime.second.toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping: false }));
        setDayString(currentTime.day.toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping: false }));
        setMonthString(months[currentTime.month - 1]);
    };
    // Updating the time every second via setIntervalln
    const UpdateTime = () =>{
        // First we update the seconds:
        if(currentTime.second < 59){ currentTime.second++; }
        // New Minute:
        else{ 
            currentTime.second = 0;    
            NewMinute();
            setHourMinuteString(currentTime.hour.toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping: false }) + ':' + currentTime.minute.toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping: false }));
        }
        setSecondsString(currentTime.second.toLocaleString('en-US', { minimumIntegerDigits:2, useGrouping: false }));
    };
    // Get the current time API (once at load)
    function CallTimeAPI(){
        if(currentTime.apiCallTimeFinished === true){ return;}

        const url = timeAPIURL + timeZone;
        

        fetch(url)
        .then(response => response.json())
        .then(data => {
                currentTime.hour = data.hour;
                currentTime.minute = data.minute;
                currentTime.second = data.seconds;
                currentTime.milliseconds = data.milliseconds;

                currentTime.day = data.day;
                currentTime.month = Number(data.month);
                currentTime.dayOfWeek = data.dayOfWeek.slice(0, 3).toUpperCase();

        }).then(() => {
            currentTime.apiCallTimeFinished = true;
            console.log('API Call for time finished');
            SetWatchToLoading(false);
            // When the API calls finished, we can Initialize the clock:
            InitializeTime();
        })
        .catch(error => console.error("Error calling time API", error));
    }

    useEffect(() =>{
        currentTime.apiCallTimeFinished = false;
    }, [loading])

    // We reload if the timezone changed:
    useEffect(() =>{
        CallTimeAPI();
    }, [timeZone]);

    // We set the intervall and use the effect hook to update the UI
    useEffect(() => {
        const interval = setInterval(() => UpdateTime(), 1000);
        return () => clearInterval(interval);
    });

    if(loading === true){
        return(
            <div className="watchContainer">
                <div className="progressBarContainer">
                    <OrbitProgress color='white'></OrbitProgress>
                </div>
            </div>
        );
    
    }
    else{
            // We build the UI:
        return <div className="watchContainer">
                <div className="dateContainer">
                    <p className="dateParagraph" id="day">
                        {currentTime.dayOfWeek}
                    </p>
                    <p className="dateParagraph" id="month">
                        {monthString}
                    </p>
                    <p className="dateParagraph" id="date">
                        {dayString}
                    </p>
                </div>

                <div className="timeContainer">
                    <p className="timeParagraph" id="time">
                        {hourMinuteString}<span id="seconds">:{secondsString}</span>
                    </p>
                    <p className="dateParagraph" id="timeZoneParagraph">
                        {timeZone.replace('_', ' ').replace('/', ' / ')}
                    </p>
                </div>

            </div>
    }
}

export default Watch;



export function SetTimeZone(newZone:string){
    console.log('Time Zone updated! New time zone: ' + timeZone);
    timeZone = newZone;
}

export function SetWatchToLoading(_loading:boolean){
    console.log('Setting Watch to loading state: ' + _loading);
    loading = _loading;
}

// Functions for updating the date and time:
function NewMinute(){
    if(currentTime.minute < 59){ currentTime.minute++; }
    else{
        currentTime.minute = 0;
        NewHour();
    }
}
function NewHour(){
    if(currentTime.hour < 23){ currentTime.hour++; }
    else{
        currentTime.hour = 0;
    }
    NewDay();
}
function NewDay(){
    
}


