const apiKey = 'a674850be12342ea80e327955936924e';
const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions');
const cityContainer = document.getElementById('city-container');

let debounceTimer;

// Auto-complete suggestions (basic city list for demo; ideally, use a dataset)
const knownCities = [
  "Tokyo, Japan", "Toronto, Canada", "New York, USA", "London, UK", "Paris, France",
  "Los Angeles, USA", "Chicago, USA", "Vancouver, Canada", "Berlin, Germany",
  "Seoul, South Korea", "Delhi, India", "Bangkok, Thailand", "Rome, Italy"
];

// Display suggestions based on input
searchInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    const query = searchInput.value.toLowerCase();
    suggestionsList.innerHTML = '';

    if (query.length < 2) return;

    const filtered = knownCities.filter(city => city.toLowerCase().includes(query));
    filtered.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      li.addEventListener('click', () => {
        searchInput.value = city;
        suggestionsList.innerHTML = '';
        fetchCityTime(city);
      });
      suggestionsList.appendChild(li);
    });
  }, 200);
});

// Allow pressing Enter to search
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    suggestionsList.innerHTML = '';
    const city = searchInput.value.trim();
    if (city) {
      fetchCityTime(city);
    }
  }
});

async function fetchCityTime(city) {
  try {
    const geoRes = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(city)}&key=${apiKey}`);
    const geoData = await geoRes.json();
    const result = geoData.results[0];

    if (!result || !result.annotations.timezone) {
      cityContainer.innerHTML = `<p style="color:red;">❌ Couldn't find time info for "${city}".</p>`;
      return;
    }

    const timezone = result.annotations.timezone.name;
    const now = new Date();
    const localTime = now.toLocaleString('en-US', { timeZone: timezone });

    displayCityCard(city, timezone, localTime);
  } catch (err) {
    console.error(err);
    cityContainer.innerHTML = `<p style="color:red;">Something went wrong while fetching the data.</p>`;
  }
}

function displayCityCard(city, timezone, time) {
  cityContainer.innerHTML = `
    <div class="city-card">
      <h2>${city}</h2>
      <p><strong>Time Zone:</strong> ${timezone}</p>
      <p><strong>Local Time:</strong> ${time}</p>
    </div>
  `;
}
