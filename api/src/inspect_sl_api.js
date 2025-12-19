
const params = new URLSearchParams({
    type_origin: 'any',
    type_destination: 'any',
    name_origin: '9091001000009182',
    name_destination: '9091001000009192',
    calc_number_of_trips: '1',
    itd_time: '1945',
    itd_date: '20251220'
});
const url = `https://journeyplanner.integration.sl.se/v2/trips?${params.toString()}`;

fetch(url)
    .then(res => res.json())
    .then(data => {
        if (data.journeys && data.journeys.length > 0) {
            const firstLeg = data.journeys[0].legs[0];
            console.log("Keys:", Object.keys(firstLeg));
            // Print everything EXCEPT arrays to avoid flooding
            const cleanLeg = {};
            for (const key in firstLeg) {
                if (!Array.isArray(firstLeg[key])) {
                    cleanLeg[key] = firstLeg[key];
                } else {
                    cleanLeg[key] = `[Array of length ${firstLeg[key].length}]`;
                }
            }
            console.log(JSON.stringify(cleanLeg, null, 2));
        } else {
            console.log("No journeys found");
        }
    })
    .catch(err => console.error(err));
