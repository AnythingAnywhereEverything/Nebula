import React from 'react';
import style from "@styles/layouts/browsingHistory.module.scss";
import HistoryItem from '@components/ui/NebulaHistoryItem';

const HistoryContainer: React.FC = () => {
    return (
        <section className={style.historyContainer}>
            <HistoryItem
                itemid="1234"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={40}
                itemrating={3.0}
                itemtitle="Travel Essentials,4 in 1 for Apple Watch Charger/iPhone Charger/Multi Charging Cable,Vacation RV Camping Essentials,USB C/L/Micro Portable Charger for iWatch 11-1/iPhone 17-12,Car&Gift-4FT"
                />

                <HistoryItem
                itemid="213"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={40}
                itemrating={4.0}
                itemtitle="Gaming Laptop, 16.0inch Laptop Computer with AMD Ryzen 7 7730U(8C/16T, Up to 4.5GHz), 16GB RAM 512GB NVMe SSD Windows 11 Laptop, Radeon RX Vega 8 Graphics,WiFi 6, Backlit KB"
                />

                <HistoryItem
                itemid="213"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={40}
                itemrating={4.0}
                itemtitle="Gaming Laptop, 16.0inch Laptop Computer with AMD Ryzen 7 7730U(8C/16T, Up to 4.5GHz), 16GB RAM 512GB NVMe SSD Windows 11 Laptop, Radeon RX Vega 8 Graphics,WiFi 6, Backlit KB"
                />
                <HistoryItem
                itemid="214"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={25}
                itemrating={4.5}
                itemtitle="Mechanical Gaming Keyboard, RGB Backlit, Blue Switches, USB Wired"
             />
            
            <HistoryItem
                itemid="215"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={60}
                itemrating={4.2}
                itemtitle="Wireless Gaming Mouse, 26000 DPI Optical Sensor, Ultra-Lightweight"
             />
            
            <HistoryItem
                itemid="216"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={120}
                itemrating={4.7}
                itemtitle="27-inch Gaming Monitor, QHD 165Hz, 1ms Response Time, IPS Panel"
             />
            
            <HistoryItem
                itemid="217"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={80}
                itemrating={4.1}
                itemtitle="Gaming Headset, Surround Sound 7.1, Noise-Canceling Mic, RGB Lighting"
             />
            
            <HistoryItem
                itemid="218"
                itemimageurl="https://placehold.co/400"
                itemprice_usd={45}
                itemrating={3.9}
                itemtitle="Laptop Cooling Pad, Dual Fan, Adjustable Height, USB Powered"
             />
        </section>
    )
}

export default HistoryContainer;