//curl -X GET
// "https://developer.nps.gov/api/v1/parks?stateCode=CO&api_key=CIOhNHwWVZAX8YbB1U7TJWA0Q8aazIZthMXdZLmY"
// -H "accept: application/json"
//here we see that the key is a part of the url. I used a stateCode of "CO" here to test, but that can be exchanged for any two-character state code
//we can use "fullName" to get the name of the park
//we can use "description" for the description
//"latitude" and "longitude" can be used with the weather API to get local weather data
//alternately, "addresses.postalCode" can be used to get a five-digit postal code
//"images.url" will give a lovely .jpg of the park
