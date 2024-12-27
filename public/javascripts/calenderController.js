var mainCalendar = new FullCalendar.Calendar(
  document.getElementById("mainCalendar"),
  {
    initialView: "dayGridMonth",
    aspectRatio: 3,
    headerToolbar: {
      start: "dayGridMonth,timeGridWeek,timeGridDay",
      center: "title",
    },
    businessHours: {
      startTime: "12:00",
      endTime: "21:00",
      daysOfWeek: [0, 1, 2, 3, 4], 
    },

    dateClick: function (info) {
      document.getElementById("timeCalendar").style.display = "block";
      document.getElementById("dateClicked").textContent = info.dateStr;

      populateTimeSlots(info.dateStr);
    },
    event: [
      {
        title: "Women's Session",
        startTime: "12:00:00",
        endTime: "14:00:00",
        daysOfWeek: [0],
        description: "Women's swimming session",
        color: "#FFB6C1",
        recurrenceRule: "FREQ=WEEKLY;BYDAY=SU",
      },
      {
        title: "Men's Session",
        startTime: "17:00:00",
        endTime: "19:00:00",
        daysOfWeek: [0],
        description: "Men's swimming session",
        color: "#ADD8E6",
        recurrenceRule: "FREQ=WEEKLY;BYDAY=SU",
      },
    ],
  }
);

mainCalendar.render();

function populateTimeSlots(date) {
  var timeSlots = generateTimeSlots(date);
  var selectElement = document.getElementById("timeSlots");

  selectElement.innerHTML = "";

  var defaultOption = document.createElement("option");
  defaultOption.textContent = "Choose a time slot";
  defaultOption.disabled = true;
  defaultOption.selected = true;
  selectElement.appendChild(defaultOption);

  timeSlots.forEach(function (slot) {
    var option = document.createElement("option");
    option.textContent = slot;
    selectElement.appendChild(option);
  });

  selectElement.addEventListener("change", function (event) {
    var selectedTim = event.target.value;
    document.getElementById("peopleForm").style.display = "block";
    document.getElementById("dateClickedPeople").textContent = date;
    document.getElementById("timeClicked").textContent = selectedTim;
    document.getElementById("bookButton").style.display = "block";
  });
}

window.bookingProcess=async function bookingProcess() {
  
  var date = document.getElementById("dateClickedPeople").textContent;
  var time = document.getElementById("timeClicked").textContent;
  var numPeople = document.getElementById("numPeople").value;
  alert('Secessfully captured '+date+time+numPeople);

  
  

  

  const response = await fetch('/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      date: date,
      time: time,
      numPeople: numPeople,
    }),
  });
  if(response.ok){
    alert('sended secessfully');
  }
  
}

function generateTimeSlots(date) {
  var slots = [];
  var times = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
  ];

  slots = times.map(function (time) {
    return time + " on " + date;
  });
  return slots;
}
