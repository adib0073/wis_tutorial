async function readCSVFile(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch CSV file');
    }

    const csvText = await response.text();
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');

    const jsonData = [];
    for (let i = 1; i < lines.length; i++) {
      const data = lines[i].split(',');
      const entry = {};
      for (let j = 0; j < headers.length; j++) {
        entry[headers[j].trim()] = data[j].trim();
      }
      jsonData.push(entry);
    }

    return jsonData;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Example usage:
const csvUrl = 'example.csv'; // Replace with the URL of your CSV file
readCSVFile(csvUrl)
  .then(data => {
    console.log(data); // List of JSON objects
  })
  .catch(error => {
    console.error('Failed to read CSV file:', error);
  });
