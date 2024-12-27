var mainCalendar = new FullCalendar.Calendar(document.getElementById('mainCalendar'), {
    initialView: 'dayGridMonth',
    dateClick: function(info) {
      // Show the time slots calendar below
      document.getElementById('timeCalendar').style.display = 'block';
      document.getElementById('dateClicked').textContent = info.dateStr;
      
      // Generate and populate the time slots dropdown
      populateTimeSlots(info.dateStr);
    },
    event:[
        {
            title: 'Women\'s Session',
            startTime: '12:00:00',
            endTime: '14:00:00',
            daysOfWeek: [0], // 0 = Sunday
            description: 'Women\'s swimming session',
            color: '#FFB6C1', // Custom color for the event
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU', // Weekly recurrence on Sunday
          },
          {
            title: 'Men\'s Session',
            startTime: '17:00:00',
            endTime: '19:00:00',
            daysOfWeek: [0], // 0 = Sunday
            description: 'Men\'s swimming session',
            color: '#ADD8E6', // Custom color for the event
            recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU', // Weekly recurrence on Sunday
          }
    ]
  });

  mainCalendar.render();

  // Function to generate and populate time slots for the selected day
  function populateTimeSlots(date) {
    var timeSlots = generateTimeSlots(date);
    var selectElement = document.getElementById('timeSlots');
    
    // Clear existing options
    selectElement.innerHTML = '';

    // Create a default option
    var defaultOption = document.createElement('option');
    defaultOption.textContent = 'Choose a time slot';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    selectElement.appendChild(defaultOption);

    // Populate the select dropdown with time slots
    timeSlots.forEach(function(slot) {
      var option = document.createElement('option');
      option.textContent = slot;
      selectElement.appendChild(option);
    });
  }

  // Function to generate time slots for the selected day
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
    
    // Example: Customize slots based on the selected date or other conditions
    slots = times.map(function(time) {
      return time + " on " + date;
    });
    return slots;
  }