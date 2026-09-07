// ==========================================
// AI SMART TRIP DASHBOARD
// result.js
// ==========================================


// ==========================================
// GEOAPIFY API KEY
// ==========================================

const GEOAPIFY_API_KEY =
    "7b334cfa6afd4758b72fa488cbbfefb0";


// ==========================================
// MAP
// ==========================================

var map = L.map("map").setView(
    [20.5937, 78.9629],
    5
);


L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution:
            "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// ==========================================
// SERVICE MARKER LAYERS
// ==========================================

const serviceLayers = {

    petrolStations:
        L.layerGroup().addTo(map),

    evStations:
        L.layerGroup().addTo(map),

    restaurants:
        L.layerGroup().addTo(map),

    hotels:
        L.layerGroup().addTo(map),

    hospitals:
        L.layerGroup().addTo(map),

    parking:
        L.layerGroup().addTo(map)

};


// ==========================================
// GET COORDINATES
// ==========================================

async function getCoordinates(place) {

    const url =
        `https://nominatim.openstreetmap.org/search` +
        `?format=json` +
        `&q=${encodeURIComponent(place)}`;


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Nominatim error: " +
                response.status
            );

        }


        const data =
            await response.json();


        if (data.length === 0) {

            alert(
                "Location not found: " +
                place
            );

            return null;
        }


        return [

            parseFloat(data[0].lat),

            parseFloat(data[0].lon)

        ];


    } catch (error) {

        console.error(
            "Coordinate error:",
            error
        );

        return null;
    }

}


// ==========================================
// GET PLACES FROM GEOAPIFY
// ==========================================

async function getNearbyPlaces(
    lat,
    lon,
    category
) {

    const url =
        `https://api.geoapify.com/v2/places` +
        `?categories=${encodeURIComponent(category)}` +
        `&filter=circle:${lon},${lat},5000` +
        `&bias=proximity:${lon},${lat}` +
        `&limit=20` +
        `&apiKey=${GEOAPIFY_API_KEY}`;


    try {

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "Geoapify error: " +
                response.status
            );

        }


        const data =
            await response.json();


        return data.features || [];


    } catch (error) {

        console.error(
            "Geoapify error:",
            error
        );

        return [];
    }

}


// ==========================================
// SERVICE CONFIGURATION
// ==========================================

const serviceTypes = {

    petrolStations: {

        category:
            "service.vehicle.fuel",

        icon:
            "⛽",

        markerIcon:
            "⛽",

        title:
            "Petrol Pump"

    },


    evStations: {

        category:
            "service.vehicle.charging_station",

        icon:
            "⚡",

        markerIcon:
            "⚡",

        title:
            "EV Charging Station"

    },


    restaurants: {

        category:
            "catering.restaurant",

        icon:
            "🍴",

        markerIcon:
            "🍴",

        title:
            "Restaurant"

    },


    hotels: {

        category:
            "accommodation.hotel",

        icon:
            "🏨",

        markerIcon:
            "🏨",

        title:
            "Hotel"

    },


    hospitals: {

        category:
            "healthcare.hospital",

        icon:
            "🏥",

        markerIcon:
            "🏥",

        title:
            "Hospital"

    },


    parking: {

        category:
            "parking",

        icon:
            "🅿",

        markerIcon:
            "🅿",

        title:
            "Parking"

    }

};


// ==========================================
// ADD SERVICE MARKER TO MAP
// ==========================================

function addServiceMarker(
    place,
    serviceType
) {

    const p =
        place.properties;


    if (
        !p.lat ||
        !p.lon
    ) {

        return;
    }


    const marker =
        L.marker(
            [
                p.lat,
                p.lon
            ]
        );


    const name =
        p.name ||
        "Unnamed Place";


    const address =
        p.formatted ||
        "Address unavailable";


    const mapsUrl =
        `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`;


    marker.bindPopup(`

        <div class="map-popup">

            <h3>
                ${serviceType.icon}
                ${name}
            </h3>

            <p>
                <strong>
                    Type:
                </strong>
                ${serviceType.title}
            </p>

            <p>
                📍 ${address}
            </p>

            <a
                href="${mapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >
                🧭 Open in Maps
            </a>

        </div>

    `);


    serviceLayers[
        getServiceContainerId(serviceType)
    ].addLayer(marker);

}


// ==========================================
// GET SERVICE CONTAINER ID
// ==========================================

function getServiceContainerId(
    serviceType
) {

    for (
        const key in serviceTypes
    ) {

        if (
            serviceTypes[key] ===
            serviceType
        ) {

            return key;
        }

    }


    return null;

}


// ==========================================
// DISPLAY SERVICE CARDS
// ==========================================

function displayPlaces(
    places,
    containerId,
    serviceType
) {

    const container =
        document.getElementById(
            containerId
        );


    if (!container) {

        console.warn(
            "Container not found:",
            containerId
        );

        return;
    }


    container.innerHTML = "";


    if (
        !places ||
        places.length === 0
    ) {

        container.innerHTML =

            `<p>
                No ${serviceType.title.toLowerCase()}
                found along this route.
            </p>`;

        return;
    }


    places.forEach(
        function (place) {

            const p =
                place.properties;


            const name =
                p.name ||
                "Unnamed Place";


            const address =
                p.formatted ||
                "Address unavailable";


            const lat =
                p.lat;


            const lon =
                p.lon;


            const mapsUrl =
                `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "station-card";


            card.innerHTML = `

                <h3>
                    ${serviceType.icon}
                    ${name}
                </h3>

                <p>
                    📍 ${address}
                </p>

                <a
                    href="${mapsUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="maps-button"
                >
                    🧭 Open in Maps
                </a>

            `;


            container.appendChild(
                card
            );

        }
    );

}


// ==========================================
// REMOVE DUPLICATES
// ==========================================

function removeDuplicates(
    places
) {

    const unique = [];

    const seen =
        new Set();


    places.forEach(
        function (place) {

            const p =
                place.properties;


            const id =
                p.place_id ||
                `${p.lat},${p.lon}`;


            if (
                !seen.has(id)
            ) {

                seen.add(id);

                unique.push(
                    place
                );

            }

        }
    );


    return unique;

}


// ==========================================
// LOAD SERVICES ALONG ROUTE
// ==========================================

async function loadRouteServicesAlongRoute(
    routeCoordinates
) {

    console.log(
        "Searching services along route..."
    );


    if (
        !routeCoordinates ||
        routeCoordinates.length === 0
    ) {

        console.error(
            "No route coordinates."
        );

        return;
    }


    // --------------------------------------
    // Clear old markers
    // --------------------------------------

    Object.values(
        serviceLayers
    ).forEach(
        function (layer) {

            layer.clearLayers();

        }
    );


    // ======================================
    // SELECT ROUTE SEARCH POINTS
    // ======================================

    const samplePoints = [];


    const step =
        Math.max(
            1,
            Math.floor(
                routeCoordinates.length /
                10
            )
        );


    for (
        let i = 0;
        i < routeCoordinates.length;
        i += step
    ) {

        samplePoints.push(
            routeCoordinates[i]
        );

    }


    // Always search destination
    samplePoints.push(
        routeCoordinates[
            routeCoordinates.length - 1
        ]
    );


    console.log(
        "Search points:",
        samplePoints.length
    );


    // ======================================
    // SEARCH ALL SERVICE TYPES
    // ======================================

    for (
        const containerId in serviceTypes
    ) {

        const serviceType =
            serviceTypes[
                containerId
            ];


        let allPlaces = [];


        // ----------------------------------
        // Search each route point
        // ----------------------------------

        for (
            const point of samplePoints
        ) {

            const lat =
                point.lat;


            const lon =
                point.lng;


            const places =
                await getNearbyPlaces(
                    lat,
                    lon,
                    serviceType.category
                );


            allPlaces =
                allPlaces.concat(
                    places
                );

        }


        // ----------------------------------
        // Remove duplicates
        // ----------------------------------

        const uniquePlaces =
            removeDuplicates(
                allPlaces
            );


        console.log(
            serviceType.title,
            "found:",
            uniquePlaces.length
        );


        // ----------------------------------
        // Display cards
        // ----------------------------------

        displayPlaces(
            uniquePlaces.slice(
                0,
                20
            ),

            containerId,

            serviceType
        );


        // ----------------------------------
        // Add map markers
        // ----------------------------------

        uniquePlaces
            .slice(0, 20)
            .forEach(
                function (place) {

                    addServiceMarker(
                        place,
                        serviceType
                    );

                }
            );

    }

}


// ==========================================
// MAIN ROUTE FUNCTION
// ==========================================

async function showRoute() {

    console.log(
        "Starting route..."
    );


    // ======================================
    // START
    // ======================================

    const startCoords =
        await getCoordinates(
            startCity
        );


    // ======================================
    // DESTINATION
    // ======================================

    const destinationCoords =
        await getCoordinates(
            destinationCity
        );


    console.log(
        "Start:",
        startCoords
    );


    console.log(
        "Destination:",
        destinationCoords
    );


    if (
        !startCoords ||
        !destinationCoords
    ) {

        console.error(
            "Could not find locations."
        );

        return;
    }


    // ======================================
    // ROUTING
    // ======================================

    const control =
        L.Routing.control({

            waypoints: [

                L.latLng(
                    startCoords[0],
                    startCoords[1]
                ),

                L.latLng(
                    destinationCoords[0],
                    destinationCoords[1]
                )

            ],

            routeWhileDragging:
                false,

            draggableWaypoints:
                false,

            addWaypoints:
                false,

            collapsible:
                true,

            show:
                false,

            createMarker:
                function (i, wp) {

                    return L.marker(
                        wp.latLng
                    );

                }

        })
        .addTo(map);


    // ======================================
    // ROUTE FOUND
    // ======================================

    control.on(
        "routesfound",
        function (e) {

            const route =
                e.routes[0];


            // ==================================
            // DISTANCE
            // ==================================

            const distancekm =
                route.summary.totalDistance /
                1000;


            const distanceElement =
                document.getElementById(
                    "distance"
                );


            if (
                distanceElement
            ) {

                distanceElement.textContent =
                    distancekm.toFixed(1) +
                    " km";

            }


            // ==================================
            // TIME
            // ==================================

            const durationHours =
                route.summary.totalTime /
                3600;


            const hours =
                Math.floor(
                    durationHours
                );


            const minutes =
                Math.round(
                    (
                        durationHours -
                        hours
                    ) * 60
                );


            const durationElement =
                document.getElementById(
                    "duration"
                );


            if (
                durationElement
            ) {

                durationElement.textContent =
                    `${hours} hr ${minutes} min`;

            }


            // ==================================
            // FUEL
            // ==================================

            const fuelRequired =
                distancekm /
                mileage;


            const fuelElement =
                document.getElementById(
                    "fuelRequired"
                );


            if (
                fuelElement
            ) {

                fuelElement.textContent =
                    fuelRequired.toFixed(2) +
                    " L";

            }


            // ==================================
            // FUEL COST
            // ==================================

            const fuelCost =
                fuelRequired *
                fuelPrice;


            const fuelCostElement =
                document.getElementById(
                    "fuelCost"
                );


            if (
                fuelCostElement
            ) {

                fuelCostElement.textContent =
                    "₹" +
                    fuelCost.toFixed(0);

            }


            // ==================================
            // TOLL
            // ==================================

            const tollCost =
                350;


            const tollElement =
                document.getElementById(
                    "tollCost"
                );


            if (
                tollElement
            ) {

                tollElement.textContent =
                    "₹" +
                    tollCost;

            }


            // ==================================
            // REMAINING BUDGET
            // ==================================

            const remainingBudget =
                budget -
                fuelCost -
                tollCost;


            const budgetElement =
                document.getElementById(
                    "remainingBudget"
                );


            if (
                budgetElement
            ) {

                budgetElement.textContent =
                    "₹" +
                    remainingBudget.toFixed(0);

            }


            // ==================================
            // DEBUG
            // ==================================

            console.log(
                "Distance:",
                distancekm
            );


            console.log(
                "Mileage:",
                mileage
            );


            console.log(
                "Fuel required:",
                fuelRequired
            );


            console.log(
                "Fuel price:",
                fuelPrice
            );


            console.log(
                "Fuel cost:",
                fuelCost
            );


            console.log(
                "Remaining budget:",
                remainingBudget
            );


            // ==================================
            // LOAD ALL ROUTE SERVICES
            // ==================================

            loadRouteServicesAlongRoute(
                route.coordinates
            );

        }
    );

}


// ==========================================
// ACCORDION
// ==========================================

const accordions =
    document.querySelectorAll(
        ".accordion"
    );


console.log(
    "Accordions found:",
    accordions.length
);


accordions.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const panel =
                    this.nextElementSibling;


                if (!panel) {

                    return;
                }


                if (
                    panel.style.maxHeight
                ) {

                    panel.style.maxHeight =
                        null;

                } else {

                    panel.style.maxHeight =
                        panel.scrollHeight +
                        "px";

                }

            }
        );

    }
);


// ==========================================
// START
// ==========================================

showRoute();