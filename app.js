// Function to generate time slots for the entire day
function generateAllDayTimeSlots() {
    const timeSlots = [];
    for (let i = 6; i <= 21; i++) {
        const startTime = `${i % 12 === 0 ? 12 : i % 12}:${i % 12 === 0 ? '00' : '30'} ${i < 12 ? 'AM' : 'PM'}`;
        const endTime = `${(i + 1) % 12 === 0 ? 12 : (i + 1) % 12}:${(i + 1) % 12 === 0 ? '00' : '30'} ${(i + 1) < 12 ? 'AM' : 'PM'}`;
        timeSlots.push({ startTime, endTime, available: 500 });
    }
    return timeSlots;
}

// Function to display all time slots for a parking deck with quantity selection
function displayAllTimeSlots(deckId, selectedDate) {
    const deckElement = document.getElementById(deckId);
    if (deckElement) {
        const timeSlotsElement = document.getElementById(`timeSlots-${deckId}`);
        if (timeSlotsElement) {
            const allTimeSlots = generateAllDayTimeSlots();

            // Separate available and reserved time slots
            const availableTimeSlots = allTimeSlots.filter((slot) => slot.available > 0);
            const reservedTimeSlots = allTimeSlots.filter((slot) => slot.available === 0);

            // Clear existing content
            timeSlotsElement.innerHTML = '';

            // Display available time slots
            displayTimeSlots(deckId, timeSlotsElement, availableTimeSlots);

            // Display reserved time slots
            displayTimeSlots(deckId, timeSlotsElement, reservedTimeSlots, true);

            // Display selected date
            displaySelectedDate(deckId, selectedDate);
        }
    }
}

// Helper function to display time slots
function displayTimeSlots(deckId, container, timeSlots, isReserved = false) {
    timeSlots.forEach((slot) => {
        const slotContainer = document.createElement('div');
        slotContainer.classList.add('time-slot-container');

        // Interactive dropdown menu
        const quantityDropdown = createQuantityDropdown(deckId, slot);
        slotContainer.appendChild(quantityDropdown);

        // Time slot button
        const slotButton = document.createElement('button');
        const status = isReserved ? 'Reserved' : (slot.available > 0 ? 'Available' : 'Not Available');
        const availabilityText = isReserved ? `(${status} - ${slot.available - 1}/500)` : `(${status} - ${slot.available}/500)`;
        slotButton.innerText = `${slot.startTime} - ${slot.endTime} ${availabilityText}`;
        slotButton.id = `button-${deckId}-${slot.startTime}`;

        // Style the button based on availability
        if (!isReserved && slot.available > 0) {
            slotButton.classList.add('available');
            slotButton.addEventListener('click', () => selectAndReserveTimeSlot(deckId, slot, quantityDropdown));
        } else if (isReserved) {
            slotButton.classList.add('reserved');
            slotButton.disabled = true;
        } else {
            slotButton.classList.add('unavailable');
            slotButton.disabled = true;
        }

        slotContainer.appendChild(slotButton);
        container.appendChild(slotContainer);
    });
}

// Function to create a quantity dropdown menu
function createQuantityDropdown(deckId, slot) {
    const dropdown = document.createElement('select');
    dropdown.classList.add('quantity-dropdown');

    for (let i = 1; i <= 500; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        dropdown.add(option);
    }

    dropdown.addEventListener('change', () => {
        const selectedQuantity = parseInt(dropdown.value, 10);
        if (!isNaN(selectedQuantity) && selectedQuantity > 0 && selectedQuantity <= slot.available) {
            // Enable the corresponding time slot button
            const slotButton = document.getElementById(`button-${deckId}-${slot.startTime}`);
            if (slotButton) {
                slotButton.disabled = false;
            }
        } else {
            alert('Invalid quantity. Please select a number between 1 and the available spots.');
            dropdown.value = '1';
        }
    });

    return dropdown;
}

// Function to display selected date
function displaySelectedDate(deckId, selectedDate) {
    const dateElement = document.getElementById(`selectedDate-${deckId}`);
    if (dateElement) {
        dateElement.innerText = `Date for parking: ${selectedDate}`;
    }
}

// Function to handle date selection
function handleDateSelection(deckId) {
    const dateInput = document.getElementById(`dateSelector-${deckId}`);
    if (dateInput) {
        dateInput.addEventListener('change', () => {
            const selectedDate = dateInput.value;
            displayAllTimeSlots(deckId, selectedDate);
        });
    }
}

// Function to allow users to select and reserve multiple time slots
function selectAndReserveTimeSlot(deckId, slot, quantityDropdown) {
    const selectedQuantity = parseInt(quantityDropdown.value, 10);

    if (!isNaN(selectedQuantity) && selectedQuantity > 0 && selectedQuantity <= slot.available) {
        for (let i = 0; i < selectedQuantity; i++) {
            reserveIndividualTimeSlot(deckId, slot.startTime, slot.endTime, slot.available);
        }
    } else {
        alert('Invalid quantity. Please select a number between 1 and the available spots.');
        quantityDropdown.value = '1';
    }
}

// Function to reserve a single time slot
function reserveIndividualTimeSlot(deckId, startTime, endTime, availableSpots) {
    const userEmail = prompt('Please enter your email:');

    if (userEmail !== null) {
        if (availableSpots > 0) {
            const reservationAPI = 'https://example.com/reserve-spot';
            const reservationData = { deckId, startTime, endTime, userEmail };

            simulateApiCall(reservationAPI, reservationData)
                .then(() => {
                    alert(`Reservation successful! Confirmation email sent to ${userEmail}`);
                    markTimeSlotAsReserved(deckId, startTime, endTime);
                    updateAvailableSpots(deckId);
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert('Error during reservation. Please try again.');
                });
        } else {
            alert('This time slot is not available.');
        }
    }
}

// Placeholder function to simulate API call
function simulateApiCall(api, data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ message: 'Reservation successful!' });
        }, 1000);
    });
}

// Function to mark a time slot as reserved
function markTimeSlotAsReserved(deckId, startTime, endTime) {
    const timeSlotsElement = document.getElementById(`timeSlots-${deckId}`);
    if (timeSlotsElement) {
        const timeSlots = timeSlotsElement.querySelectorAll('button');
        const targetSlot = Array.from(timeSlots).find((slot) => {
            const slotText = slot.innerText;
            return slotText.includes(startTime) && slotText.includes(endTime);
        });

        if (targetSlot) {
            targetSlot.classList.remove('available');
            targetSlot.classList.add('reserved');
            targetSlot.innerText = `${startTime} - ${endTime} (Reserved - ${targetSlot.available - 1}/500)`;
            targetSlot.disabled = true;
        }
    }
}

// Function to update available spots
function updateAvailableSpots(deckId) {
    const timeSlotsElement = document.getElementById(`timeSlots-${deckId}`);
    if (timeSlotsElement) {
        const availableSpotsElement = document.getElementById(`availableSpots-${deckId}`);
        if (availableSpotsElement) {
            const timeSlots = timeSlotsElement.querySelectorAll('button');
            const availableSlots = Array.from(timeSlots).filter((slot) => !slot.classList.contains('reserved')).length;
            availableSpotsElement.innerText = `${availableSlots}/500`;
        }
    }
}

// Call the function to handle date selection for each deck
handleDateSelection('k-deck');
handleDateSelection('m-deck');
handleDateSelection('n-deck');
handleDateSelection('s-deck');
handleDateSelection('t-deck');
handleDateSelection('u-deck');

// Call the function to display all time slots for each deck
displayAllTimeSlots('k-deck', getCurrentDate());
displayAllTimeSlots('m-deck', getCurrentDate());
displayAllTimeSlots('n-deck', getCurrentDate());
displayAllTimeSlots('s-deck', getCurrentDate());
displayAllTimeSlots('t-deck', getCurrentDate());
displayAllTimeSlots('u-deck', getCurrentDate());

// Function to get the current date in "YYYY-MM-DD" format
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
