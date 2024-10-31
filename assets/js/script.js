'use strict';

function select(selector, scope = document) {
  return scope.querySelector(selector);
}

function listen(event, selector, callback) {
  selector.addEventListener(event, callback);
}

const clockElement = select(".clock");
const alarmTimeElement = select(".alarm-time");
const alarmSetIndicator = select(".alarm-set-indicator");
const hoursInput = select(".hours");
const minutesInput = select(".minutes");
const setAlarmButton = select(".set-alarm");

const alarmSound = new Audio('./assets/audio/clock-alarm.mp3');
alarmSound.type = 'audio/mp3';

let alarmTime = null;

function numbersOnly(input) {
  input.addEventListener("input", () => {
    input.value = input.value.replace(/\D/g, "");
  });
}
numbersOnly(hoursInput);
numbersOnly(minutesInput);

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}`;
    
  if (alarmTime && `${hours}:${minutes}` === alarmTime) {
    alarmSound.play();
    clockElement.classList.add("active");
    alarmSetIndicator.classList.remove("hidden");

    // Remove active class when audio ends
    alarmSound.addEventListener("ended", () => {
      clockElement.classList.remove("active");
      alarmTimeElement.textContent = "";
    }, { once: true }); // Use { once: true } to ensure the listener is removed after it runs once

    alarmTime = null; // Reset the alarm
  } 
}

function setAlarm() {
  const hours = hoursInput.value;
  const minutes = minutesInput.value;

  if (!/^\d{2}$/.test(hours) || !/^\d{2}$/.test(minutes)) {
    return;
  }
    
  const hh = parseInt(hours, 10);
  const mm = parseInt(minutes, 10);

  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) {
    return;
  }

  alarmTime = `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  alarmTimeElement.textContent = alarmTime;
  alarmSetIndicator.classList.remove("hidden");
    
  // Clear inputs after setting the alarm
  hoursInput.value = "";
  minutesInput.value = "";
}

// Update the clock every second
setInterval(updateClock, 1000);

listen("click", setAlarmButton, setAlarm);
