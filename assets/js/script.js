// curl -X 'GET' \
//   'https://ridb.recreation.gov/api/v1/recareas?limit=50&offset=0&state=CO&lastupdated=10-01-2018' \
//   -H 'accept: application/json' \
//   -H 'apikey: 185ece11-651c-4751-9493-bea8717c3a9a'

// https://ridb.recreation.gov/api/v1/recareas?limit=50&offset=0&state=CO&lastupdated=10-01-2018
// the above is an example of the request url for colorado. We can change the state easily when we make the actual request.

// we can use "RecAreaName" for the name of the Rec Area
// we can use "RecAreaDescription" for the description
// we can use "RecAreaLatitude" and "RecAreaLongitude" for coordinates
// we should also pull the "RecAreaID" to plug into the media request for a picture

// curl -X 'GET' \
//   'https://ridb.recreation.gov/api/v1/recareas/708/media?query=image&limit=50&offset=0' \
//   -H 'accept: application/json' \
//   -H 'apikey: 185ece11-651c-4751-9493-bea8717c3a9a'

// https://ridb.recreation.gov/api/v1/recareas/708/media?query=image&limit=50&offset=0
// in this example, the "708" is the RecAreaID, so we will need to replace that as requested
// some of the media is videos, but if we put the "query=image" bit in, as above, it filters them out
// not all of the rec areas have photos, so we should plan a generic "national parks" filler photo

