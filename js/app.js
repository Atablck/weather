let celsius = document.querySelectorAll('.celsius')
let weather_descr = document.querySelector('.weather_descr')
let feels_like = document.querySelector('.feels_like')

let wind = document.querySelectorAll('.w')
let humidity = document.querySelectorAll('.h')
let pressure = document.querySelectorAll('.p')

let input = document.querySelector('.input-field')
let search_btn = document.querySelector('.search_btn')

let city_name = document.querySelector('.city_name')

let new_active = document.querySelector('.b')

const apiKey = '9d28948efacd5e444984149710df1a4c'

let currentCity = ''
search_btn.addEventListener('click', () => {
    const rawCity = input.value.trim()
    const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase()
    input.value = ''

    currentCity = city
    
    if (!city) {
        showError('Enter city name')
        return
    }


    miniCards.forEach(c => {
        c.classList.remove('today_card')
        c.classList.add('notToday_card')
    })

    new_active.classList.add('today_card')

    getWeather(city)
    getMiniWeather(city)
})


input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        search_btn.click()
    }
})

const getWeather = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=en`


    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error('City not found')
        
        const data = await response.json()
        
        updateCity(data)
        updateMainWeather(data)
        updateMetric(data)

    } catch (error) {
        showError(error.message)
    }
}

let updateCity = (data) => {
    city_name.textContent = data.name + ', ' + data.sys.country
}


let updateMainWeather = (data) => {

    celsius.forEach(el => {
        el.textContent = Math.round(data.main.temp) + '°C'
    });

    weather_descr.textContent = data.weather[0].main

    feels_like.textContent = 'Feels like ' + Math.round(data.main.feels_like) + '°C'

    updateWeatherIcons(data, '.gggg')
    updateWeatherIcons(data, '.ggg')
}


const weatherIcons = {
    Clear: 'img/sun.png',
    Clouds: 'img/clouds.png',
    Rain: 'img/rain.png',
    Snow: 'img/snow.png'
}


let updateWeatherIcons = (weatherData, selector) => {


    const condition = weatherData.weather[0].main
    const iconPath = weatherIcons[condition] || 'img/default.png'

    const iconElement = document.querySelectorAll(selector)

    iconElement.forEach(el => {
        el.src = iconPath
        el.alt = condition
    })

    applyWeatherEffect(selector, condition)
}



let updateMetric = (data) => {

    wind.forEach(el => {
        el.textContent = Math.round(data.wind.speed) + ' m/s'
    })

    humidity.forEach(el => {
        el.textContent = data.main.humidity + '%'
    })

    pressure.forEach(el => {
        el.textContent = data.main.pressure + ' hPa'
    })
}


let showError = (message) => {
    celsius.textContent = ''
    weather_descr.textContent = message
    feels_like.textContent = ''
    wind.textContent = ''
    humidity.textContent = ''
    pressure.textContent = ''
}




let sec = document.querySelector('.sec')
let secs = document.querySelector('.secs')

let forecastList = []

let getMiniWeather = async (city) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric&lang=en`

    const response = await fetch(url)
    if (!response.ok) throw new Error('City not found')

    const data = await response.json()

    forecastList = data.list

    updateMiniWeather(forecastList, 1, '.sec', '.gg')
    updateMiniWeather(forecastList, 2, '.secs', '.g')
    
}

let updateMiniWeather = (forecastList, daysAhead = 1, tempSelector, iconSelector) => {

    let now = new Date()
    let targetDate = new Date(now)
    targetDate.setDate(targetDate.getDate() + daysAhead)

    let yyyy = targetDate.getFullYear()
    let mm = String(targetDate.getMonth() + 1).padStart(2, '0')
    let dd = String(targetDate.getDate()).padStart(2, '0')

    let targetTime = `${yyyy}-${mm}-${dd} 12:00:00`

    let g = forecastList.find(item => item.dt_txt === targetTime)


    const tempEl = document.querySelector(tempSelector)
    tempEl.textContent = Math.round(g.main.temp) + '°C'

    updateWeatherIcons(g, iconSelector)
}



const getDayLabel = (daysAhead) => {
    const now = new Date()
    const targetDate = new Date(now)
    targetDate.setDate(now.getDate() + daysAhead)

    if (daysAhead === 0) return "Today"

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const dayIndex = targetDate.getDay()

    return daysOfWeek[dayIndex]
}

document.querySelector('.tomorrow_label').textContent = getDayLabel(1)
document.querySelector('.dATomorrow_label').textContent = getDayLabel(2)



// const applyWeatherEffect = (selector, condition) => {
//     const wrap_container = document.querySelector('.wrap')
//     const back_container = document.querySelector('.back')
//     const rainContainer = document.getElementById('rain')
//     const isMobile = window.innerWidth <= 768

//     const clearRain = () => {
//         rainContainer.innerHTML = ''
//         wrap_container.style.background = '#F0EBE3'
//         back_container.style.background = '#FFFAFA'
//     }

//     if (selector === '.gggg' && condition === 'Rain') {
//         rainContainer.innerHTML = ''

//         if (isMobile) {
//             back_container.style.background = '#1e1e2f'
//         } else {
//             wrap_container.style.background = '#1e1e2f'
//         }

//         for (let i = 0; i < 100; i++) {
//             const drop = document.createElement('div')
//             drop.className = 'drop'
//             drop.style.left = `${Math.random() * 100}%`
//             drop.style.top = `${-100 - Math.random() * 300}px`
//             drop.style.animationDuration = `${1 + Math.random()}s`
//             drop.style.animationDelay = `${Math.random() * 5}s`
//             rainContainer.appendChild(drop)
//         }
//     }   else if (selector === '.gggg') {
//             clearRain()
//         }
// }







const applyWeatherEffect = (selector, condition) => {
    const wrap_container = document.querySelector('.wrap')
    const back_container = document.querySelector('.back')
    const rainContainer = document.getElementById('rain')
    const snowContainer = document.getElementById('snow')
    const isMobile = window.innerWidth <= 768

    if (!wrap_container || !back_container || !rainContainer || !snowContainer) return

    const clearEffects = () => {
        rainContainer.innerHTML = ''
        snowContainer.innerHTML = ''
        wrap_container.style.background = '#F0EBE3'
        back_container.style.background = '#FFFAFA'
    }

    const createRain = () => {
        rainContainer.innerHTML = ''
        snowContainer.innerHTML = ''

        if (isMobile) {
            back_container.style.background = '#1e1e2f'
        } else {
            wrap_container.style.background = '#1e1e2f'
        }

        for (let i = 0; i < 100; i++) {
            const drop = document.createElement('div')
            drop.className = 'drop'
            drop.style.left = `${Math.random() * 100}%`
            drop.style.top = `${-100 - Math.random() * 300}px`
            drop.style.animationDuration = `${1 + Math.random()}s`
            drop.style.animationDelay = `${Math.random() * 5}s`
            rainContainer.appendChild(drop)
        }
    }

  
    const createSnow = () => {
        snowContainer.innerHTML = ''
        rainContainer.innerHTML = ''

        if (isMobile) {
            back_container.style.background = '#0e0f1a'
        } else {
            wrap_container.style.background = '#0e0f1a'
        }

        const FLAKES = isMobile ? 80 : 120
        const INSTANT_RATIO = 0.5 

        const negDelayForStartAbove = (startYvh, fallDuration, maxVisibleYvh) => {
   
            const tMax = Math.max(0, Math.min(0.98, (maxVisibleYvh - startYvh) / (160 - startYvh)))
            const t0 = Math.random() * tMax 
            return -(t0 * fallDuration)
        }

        for (let i = 0; i < FLAKES; i++) {
            const flake = document.createElement('div')
            flake.className = 'flake'

            const core = document.createElement('span')
            core.className = 'flake-core'

            const size = 2 + Math.random() * 4
            const fallDuration = 10 + Math.random() * 10 
            const swayDuration = 2 + Math.random() * 2.5
            const drift = (Math.random() * 60 - 30).toFixed(1)


            flake.style.left = `${Math.random() * 100}%`

 
            const startYvh = -(120 + Math.random() * 100) 
            flake.style.setProperty('--startY', `${startYvh}vh`)
    
            flake.style.transform = `translate3d(0, ${startYvh}vh, 0)`
            flake.style.animationDuration = `${fallDuration}s`

            const isInstant = i < Math.floor(FLAKES * INSTANT_RATIO)
            const maxVisibleYvh = isInstant ? -2 : -8 
            const negDelay = negDelayForStartAbove(startYvh, fallDuration, maxVisibleYvh)

            flake.style.animationDelay = `${negDelay}s`  
            core.style.width = `${size}px`
            core.style.height = `${size}px`
            core.style.opacity = (0.6 + Math.random() * 0.4).toFixed(2)
            core.style.setProperty('--drift', `${drift}px`)
            core.style.animationDuration = `${swayDuration}s`
            core.style.animationDelay = `${Math.random() * swayDuration}s`

            flake.appendChild(core)
            snowContainer.appendChild(flake)
        }
    }

  
    if (selector === '.gggg' && condition === 'Rain') {
        createRain()
    } else if (selector === '.gggg' && condition === 'Snow') {
        createSnow()
    } else if (selector === '.gggg') {
        clearEffects()
    }
}


const updateMainCardByDay = (forecastList, daysAhead) => {
    const now = new Date()
    const targetDate = new Date(now)
    targetDate.setDate(targetDate.getDate() + daysAhead)

    const yyyy = targetDate.getFullYear()
    const mm = String(targetDate.getMonth() + 1).padStart(2, '0')
    const dd = String(targetDate.getDate()).padStart(2, '0')

    const targetTime = `${yyyy}-${mm}-${dd} 12:00:00`
    const data = forecastList.find(item => item.dt_txt === targetTime)

    if (!data) return


    document.querySelector('.celsius').textContent = Math.round(data.main.temp) + '°C'
    document.querySelector('.weather_descr').textContent = data.weather[0].main
    document.querySelector('.feels_like').textContent = 'Feels like ' + Math.round(data.main.feels_like) + '°C'

    wind.forEach(el => {
        el.textContent = Math.round(data.wind.speed) + ' m/s'
    })
    humidity.forEach(el => {
        el.textContent = data.main.humidity + '%'
    })
    pressure.forEach(el => {
        el.textContent = data.main.pressure + ' hPa'
    })

    updateWeatherIcons(data, '.gggg')
    applyWeatherEffect('.gggg', data.weather[0].main)
}



const miniCards = document.querySelectorAll('.column_dir')

miniCards.forEach(card => {
    card.addEventListener('click', () => {

        miniCards.forEach(c => {
            c.classList.remove('today_card')
            c.classList.add('notToday_card')
        })

        card.classList.add('today_card')
        card.classList.remove('notToday_card')

        const dayOffset = Number(card.dataset.day)

        if (dayOffset === 0) {
            getWeather(currentCity) 
        } else {
            updateMainCardByDay(forecastList, dayOffset)
        }
    })
})