import React from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon
  } from "react-share";

const Article = () => {   
    const [places, setPlaces] = React.useState([])
    const [originalPlaces, setOriginalPlaces] = React.useState([])
    const [sortedType, setSortedType] = React.useState("Random")
    const [quantity, setQuantity] = React.useState(10)
    const [ratingCheck, setRatingCheck] = React.useState([])
    const [center, setCenter] = React.useState({
        lat: 19.44005,
        lng: -99.1270
    })

    React.useEffect(() => {
        loadPlaces()
    }, [])

    React.useEffect(() => {
        if(sortedType === "Random") {
            const sorted = [...places].sort((a,b) => Math.random() - .5)
            setPlaces(sorted)
        }
        if(sortedType === "Alphabetically") {
            const sorted = [...places].sort((a,b) => a.name.localeCompare(b.name))
            setPlaces(sorted)
        }
        if(sortedType === "Rating") {
            const sorted = [...places].sort((b, a) => a.rating - b.rating)
            setPlaces(sorted)
        }
    }, [sortedType])

    React.useEffect(() => {
        setPlaces(originalPlaces)

        if(ratingCheck.length > 0) {
            const sorted = [...originalPlaces].filter(item => ratingCheck.includes(item.rating))
            setPlaces(sorted)
            setSortedType("Random")
        } else {
            setPlaces(originalPlaces)
            setSortedType("Random")
        }
    }, [ratingCheck])
    
    const loadPlaces = async() => {
        try{
            const response = await fetch('https://raw.githubusercontent.com/Luisjor/EDT-Melp/main/src/Components/text');

            const datos = await response.json()
            setPlaces(datos)
            setOriginalPlaces(datos)
        } catch(e) {
            console.log(e)
        }
    }
    
    function ratingValue(event) {
        if(event.target.checked === true) {
            const newArray = [...ratingCheck].concat(+event.target.value)
            setRatingCheck(newArray)
        } else {
            const index = [...ratingCheck].indexOf(+event.target.value)
            const newRating = [...ratingCheck]
            newRating.splice(index, 1)
            setRatingCheck(newRating)
        }
        
    }

    const containerStyle = {
        width: '100%',
        height: '100%'
    };

    return(
        <>
            <section className="places_section">
            <div className="places_sortby">
                <h2>The Top {quantity} Best Restaurants in your Area</h2>
                <div className='sort_options'>
                    <div className='rating_div'>
                        <span>Rating:</span>
                        <ul>
                            <li><input type="checkbox" id="rating" name="rating" value="0" onClick={(event) => ratingValue(event)}/>1 star</li>
                            <li><input type="checkbox" id="rating" name="rating" value="1" onClick={(event) => ratingValue(event)}/>2 star</li>
                            <li><input type="checkbox" id="rating" name="rating" value="2" onClick={(event) => ratingValue(event)}/>3 star</li>
                            <li><input type="checkbox" id="rating" name="rating" value="3" onClick={(event) => ratingValue(event)}/>4 star</li>
                            <li><input type="checkbox" id="rating" name="rating" value="4" onClick={(event) => ratingValue(event)}/>5 star</li>
                        </ul>
                    </div>

                    <div>
                        <span>Items: </span>
                            <select name="select" defaultValue={10} onChange={(e) => setQuantity(e.target.value)}>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                    </div>

                    <div>
                        <span>Sort: </span>

                        <select name="select" value={sortedType} onChange={(e) => setSortedType(e.target.value)}>
                            <option value="Random">Random</option>
                            <option value="Alphabetically">Alphabetically</option>
                            <option value="Rating">Rating</option>
                        </select>
                    </div>

                </div>
                
                


            </div>

            {places.map((place, i) => {
                        if(i<quantity) {
                        return(
                            
                                <article className="place_card" key={place.id} onClick={() => setCenter(place.address.location)}>
                                    <a href={place.contact.site} className="aBack">
                                        <div className="imgBack"
                                            style={{ 
                                            backgroundImage: `url("https://s3.amazonaws.com/static.om.anigamy.net/static.selecciones.com.ar/App/Article/12-consejos-para-saber-que-pedir-en-un-restaurante-2636-mainImage-0.jpg")` 
                                            }}>
                                    
                                        </div>
                                    </a>
                                    <div className="place_data">
                                        <h1>{place.name}</h1>
                                        <span>
                                            {("\u2B50").repeat(place.rating + 1)}
                                            {(place.rating + 1)} ({(Math.floor(Math.random() * (1000 - 600 + 1) + 600))} reviews)</span>
                                        <p className="article_location">{place.address.street}, { place.address.city}, {place.address.state}</p>
                                        <p className="article_description">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>

                                        <div className="contact_options">
                                            <div className="phone_options">
                                                <p className='contact_buttons'><a href={"tel:" + place.contact.phone}><i className="fa-solid fa-phone"></i></a>
                                                <a href={"mailto:" + place.contact.email + "?subject=Melp Order"}><i className="fa-solid fa-envelope"></i></a></p>
                                            </div>
                                            <div className="share_buttons">
                                                Share:
                                                <FacebookShareButton
                                                    url={place.contact.site}
                                                    quote={"Check this out!"}
                                                    hashtag={"#MelpToYourHome"}>
                                                    <FacebookIcon size={25} round={true}/>
                                                </FacebookShareButton>
                                                <TwitterShareButton
                                                    url={place.contact.site}
                                                    title={"Check this out!"}
                                                    hashtags={["#MelpToYourHome"]}>
                                                    <TwitterIcon size={25} round={true}/>
                                                </TwitterShareButton>
                                                <WhatsappShareButton
                                                    url={place.contact.site}
                                                    title={"Check this out!"}>
                                                    <WhatsappIcon size={25} round={true}/>
                                                </WhatsappShareButton>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                </article>
                            
                        )}
                    })
            
            }
            </section>

            <section className="map_container">
                    <LoadScript
                        googleMapsApiKey="AIzaSyC5QRQPWJyh8jLPz7NRS0Dyr5EUASRiO0E"
                    >
                        <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={18}
                        >

                        {places.map((point, i) => {
                        if(i<quantity) {
                        return(
                            <MarkerF
                            key={point.id}
                            position={point.address.location}
                            title={point.name}
                            />
                        )}
                        })}
                        { /* Child components, such as markers, info windows, etc. */ }
                        <></>
                        </GoogleMap>
                    </LoadScript>                
            </section>
        
        </>

        
    )
}

export default Article;