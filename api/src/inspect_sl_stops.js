const params = new URLSearchParams({
    name_sf: 'Slussen',
    any_obj_filter_sf: '0',
    type_sf: 'any'
});
const url = `https://journeyplanner.integration.sl.se/v2/stop-finder?${params.toString()}`;

fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(err => console.error(err));
