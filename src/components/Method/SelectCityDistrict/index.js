import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SelectCityDistrict.css'
import eventEmitter from '../../../pages/Users/util/EventEmitter';

const SelectCityDistrict = () => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'token': '10b95f73-8fad-11ee-af43-6ead57e9219a',
    },
  };
  
  const [cities, setCities] = useState({});
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [city, setCity] = useState('')
  const [district, setDistrict] = useState('')
  const [disID, setDisID] = useState('')
  const [ward, setWard] = useState('')
  const [waID, setWaID] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getCity = await axios.get('https://online-gateway.ghn.vn/shiip/public-api/master-data/province', config);
        //console.log(getCity.data.data[61].ProvinceName);
        setCities(getCity.data.data[61]); //TP HCM
        const provinceID = getCity.data.data[61].ProvinceID;
        const getDistrict = await axios.get(
          'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
          {
            params: { province_id: provinceID },
            headers: config.headers,
          }
        );
        setDistricts(getDistrict.data.data)
        setCity(getCity.data.data[61].ProvinceName)
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDistrictChange = async (e) => {
    const selectedDistrictId = e.target.value;
    // Find the selected district
    const selectedDistrict = districts.find(
      (district) => district.DistrictID === parseInt(selectedDistrictId, 10)
    );
    //console.log('selectedDistrict: ',selectedDistrict);
  
    if (selectedDistrict) {
      setDisID(selectedDistrictId)
      setDistrict(selectedDistrict.DistrictName);
      // Filter wards based on the selected district
      try {
        const getWard = await axios.get(
          'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
          {
            params: { district_id: selectedDistrictId },
            headers: config.headers,
          }
        );
  
        //console.log('getWard: ', getWard.data.data);
        setWards(getWard.data.data || []);
      } catch (error) {
        console.error('Error fetching wards:', error);
      }
    } else {
      console.error('Selected district not found');
    }
  };
  

  const handleWardChange = (e) => {
    const selectedWardId = e.target.value;
  
    // Filter wards based on selected district
    const selectedWard = wards.find(ward => ward.WardCode === selectedWardId);
    setWaID(selectedWardId)
    setWard(selectedWard.WardName);
  };

  useEffect(() => {
    const updatedSelectedValue = {
      city: city,
      district: district,
      districtID: disID,
      ward: ward,
      wardCode: waID
    };
  
    console.log(updatedSelectedValue);
    // Emit an event with the updated
    eventEmitter.emit('updateCityAddress', updatedSelectedValue);
  }, [ward]);
  

  return (
    <div>
      <select className="form-select form-select-sm mb-3 custom-select" id="city" aria-label=".form-select-sm" defaultValue="">
        <option key={cities.ProvinceID} value={cities.ProvinceID}>{cities.ProvinceName}</option>
      </select>

      <select className="form-select form-select-sm mb-3 custom-select" id="district" onChange={handleDistrictChange} aria-label=".form-select-sm" defaultValue="">
        <option value="">Choose District</option>
        {districts.map(district => (
          <option key={district.DistrictID} value={district.DistrictID}>{district.DistrictName}</option>
        ))}
      </select>

      <select className="form-select form-select-sm custom-select" id="ward" onChange={handleWardChange} aria-label=".form-select-sm" defaultValue="">
        <option value="">Choose Ward</option>
        {wards.map(ward => (
          <option key={ward.WardCode} value={ward.WardCode}>{ward.WardName}</option>
        ))}
      </select>
    </div>
  );
};

export default SelectCityDistrict;
