
	mapboxgl.accessToken ='pk.eyJ1IjoiZGVsdGEtc3R1ZHVlbnQiLCJhIjoiY2xvMDk0MTVhMTJ3ZDJrcGR5ZDFkaHl4ciJ9.Gj2VU1wvxc7rFVt5E4KLOQ';
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 9 // starting zoom
    });
const marker1=new mapboxgl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates)
    .setPopup( new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.location}</h4><p>Exact location of the listing</p>`))
    .addTo(map);