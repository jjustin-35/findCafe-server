const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, () => {
    console.log('mongoose is connected.')
});

const Cafes = require('./models').cafeModel;
const fs = require('fs');
const path = require('path');

const getdata = async () => {
    let areas = fs.readFileSync(path.resolve(__dirname, './data/taiwan_districts.json'))
    areas = JSON.parse(areas);

    let data = fs.readFileSync(path.resolve(__dirname, './data/cafe.json'));
    data = JSON.parse(data);

    // fn
    const countStars = (obj) => {
        const query = ['wifi', 'seat', 'quiet', 'tasty', 'cheap', 'music'];
        let stars = 0;

        query.forEach(element => {
            stars += (Number(obj[element]) / query.length);
        })

        return stars;
    }

    const dealAddress = (string) => {
        let country = "unknown", districts = "unknown", location = "unknown";
        for (let area of areas) {
            let areaName = area.name;
            if (areaName.match("台")) {
                areaName = areaName + "|" + areaName.replace("台", "臺")
            }
            const re = new RegExp(areaName, "g");
            const array = string.match(re);
    
            if (array) {
                country = array[0];
            }

            for (let subarea of area.districts) {
                const re = new RegExp(subarea.name, "g");

                const array = string.match(re);
                if (array) {
                    districts = array[0];
                    if (!country) {
                        country = area.name;
                    }
                } else {
                    continue;
                }
            }
        }
    
        location = string.replace(country, "").replace(districts, "")
    
        return {country, districts, location}
    }

    const dealTag = (tag) => {
        const tagList = ['wifi', 'seat', 'quiet', 'tasty', 'cheap', 'music'];
        const newTag = ['有wifi', '座位多', '環境安靜', '餐點好吃', '東西便宜', '音樂好聽'];

        tagList.forEach((theTag, i) => {
            if (tag === theTag) {
                tag = newTag[i];
            }
        })

        return tag;
    }

    const getTag = (cafe) => {
        let tags = [];
        for (let i in cafe) {
            if (!isNaN(cafe[i]) && Number(cafe[i]) <= 5) {
                if (cafe[i] >= 3) {
                    let theTag = {};
                    theTag[i] = cafe[i];
                    tags = [...tags, theTag];
                }
            }
        }

        tags.sort((a, b) => {
            let aValue;
            let bValue;
            for (let p in a) {
                aValue = a[p];
            }
            for (let p in b) {
                bValue = b[p];
            }

            return bValue - aValue;
        });

        tags = tags.map((tag) => {
            for (let name in tag) {
                name = dealTag(name);
                return name;
            }
        })

        return tags.slice(0, 3);
    }
    try {
        for (let cafe of data) {
            let { id, name, url, address, limited_time, mrt, latitude, open_time, longitude, wifi, seat, quiet, tasty, cheap, music } = cafe;

            address = dealAddress(address);

            let newCafe = new Cafes({
                id,
                name,
                url,
                address: {...address , mrt, latitude, longitude },
                limited_time,
                time: { open_time },
                stars: countStars(cafe),
                rank: {
                    wifi, seat, quiet, tasty, cheap, music
                }
            })

            await newCafe.save();
        }

        console.log('complete')
    } catch (err) {
        console.log(err)
    }
}

getdata();