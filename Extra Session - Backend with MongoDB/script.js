// Generate Bearer Token for REST API authentication
async function fetchBearerToken(apiKey) {
    const url = 'https://services.cloud.mongodb.com/api/client/v2.0/app/data-mslfv/auth/providers/api-key/login';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                key: apiKey
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch bearer token');
        }

        const responseData = await response.json();
        return responseData.access_token;
    } catch (error) {
        console.error('Error fetching bearer token:', error);
        throw error;
    }
}

// Call API to retrieve data from MongoDB
async function fetchDataWithBearerToken(searchTerm) {
    const apiKey = 'sNWGg1vojvB2jJzB3RXKTUhqL9wduCaGK28KY3UhwwHWFOKwsbQFB2HjPP4yaDdv'; // Replace <api_key> with your actual API key

    try {
        const bearerToken = await fetchBearerToken(apiKey);

        const url = 'https://data.mongodb-api.com/app/data-mslfv/endpoint/data/v1/action/find';
        const requestData = {
            dataSource: 'WIS',
            database: 'sample_mflix',
            collection: 'movies',
            filter: {
                title: { "$regex": "(?i)" + searchTerm }
            },
            sort: { "completedAt": 1 }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/ejson',
                'Accept': 'application/json',
                'Authorization': `Bearer ${bearerToken}`
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const responseData = await response.json();
        console.log(responseData);
        return responseData;
    } catch (error) {
        console.error('Error:', error);
    }
}




// Function to fetch data from the API
async function fetchData() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to render data in cards
async function renderData(searchTerm) {
    const container = document.querySelector('.container');
    const data = await fetchDataWithBearerToken(searchTerm);
    console.log(data);

    if (!data) {
        return;
    }

    data["documents"].forEach(item => {
        const card = document.createElement('div');
        card.classList.add('card');

        const title = document.createElement('h2');
        title.textContent = item.title;

        const directors = document.createElement('h4');
        directors.textContent = "Director(s): " + item.directors;

        const plot = document.createElement('p');
        plot.textContent = item.plot;

        card.appendChild(title);
        card.appendChild(directors);
        card.appendChild(plot);
        container.appendChild(card);
    });
}


// Get search term
const form = document.querySelector("form");

form.addEventListener("submit",(e)=>{
    e.preventDefault();


    if(form["searchbox"].value){
        document.querySelector(".container").innerHTML = "";
        console.log(form["searchbox"].value);
        // Call the renderData function to display data
        renderData(form["searchbox"].value);
        form.reset();
    }else{
        console.log("Provide required values");
    }
})