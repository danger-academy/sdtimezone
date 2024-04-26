function updateTime() {
    const timeElements = document.querySelectorAll('.time');
    timeElements.forEach(element => {
        const timezone = element.getAttribute('data-timezone');
        const time = new Date().toLocaleTimeString('en-US', { timeZone: timezone });
        element.textContent = time;
    });
}

function fetchDataFromSharePointList() {
    const siteUrl = 'https://vitalcore.sharepoint.com/sites/ServiceDesk';
    const listName = 'TeamMembers';
    const restUrl = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=Title,Location,Timezone`;

    fetch(restUrl, {
        headers: { "Accept": "application/json;odata=verbose" },
        credentials: 'same-origin' // Necessary for SharePoint Online authentication
    })
    .then(response => response.json())
    .then(data => {
        const members = data.d.results; // Correct data path
        const dashboard = document.getElementById('team-dashboard');
        
        members.forEach(member => {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'team-member';

            const nameDiv = document.createElement('div');
            nameDiv.className = 'name';
            nameDiv.textContent = member.Title; // Correctly using Title
            memberDiv.appendChild(nameDiv);

            const locationDiv = document.createElement('div');
            locationDiv.className = 'location';
            locationDiv.textContent = member.Location;
            memberDiv.appendChild(locationDiv);

            const timeDiv = document.createElement('div');
            timeDiv.className = 'time';
            timeDiv.setAttribute('data-timezone', member.Timezone);
            memberDiv.appendChild(timeDiv);

            dashboard.appendChild(memberDiv);
        });

        // Update time initially
        updateTime();

        // Then update every second to keep the time accurate
        setInterval(updateTime, 1000);
    })
    .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', fetchDataFromSharePointList);
