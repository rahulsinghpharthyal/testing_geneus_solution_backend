import fetch from 'node-fetch';
import Visitor from '../models/Visitor.js';

const captureVisitorData = async (req, res, next) => {
    try {
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        // console.log('this is ip', ip);

        //for testin purposer this code:-
        //     const res = await fetch('https://api64.ipify.org?format=json');
        // const da = await res.json();



        // Fetch location data from GeoLocation-DB
        const response = await fetch(`https://geolocation-db.com/json/${ip}&position=true`);
        const data = await response.json();
        console.log('this is data', data)
        // Extract data
        const city = data.city || 'Unknown';
        const country = data.country_name || 'Unknown';
        const latitude = data.latitude || null;
        const longitude = data.longitude || null;
        const ipv4 = data.IPv4 || ip;
        // console.log(city);
        // console.log(country);
        // console.log(latitude);
        // console.log(longitude);
        // console.log(ipv4);
    
        // Save visitor data in MongoDB
        const newVisitor = new Visitor({ ip: ipv4, city, country});
        await newVisitor.save();
    
        console.log(`Visitor Data Saved: IP=${ipv4}, City=${city}, Country=${country}`);
    
        next(); // Continue to the next middleware
      } catch (error) {
        console.error('Error fetching visitor data:', error);
        next(); // Continue processing even if there's an error
      }
};

export default captureVisitorData;
