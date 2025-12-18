// navbar component
import React from 'react';
import Link from 'next/link';
import style from '@styles/layouts/navbarDesktop.module.scss';
import { NerdFonts } from '../utilities/NerdFonts';
import { Hamburger } from '../features/NavigatorBar/hamburger';
import { NebulaButton } from '@components/ui/NebulaBtn';

interface UserLocation {
  city: string;
  country_name: string;
}

// Get user's location based on IP (later for delivery info)
const getUserLocation = async (): Promise<UserLocation | null> => {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) {
            throw new Error('Failed to fetch location');
        }
        const data = await res.json();
        return {
            city: data.city,
            country_name: data.country_name,
        };
    } catch (error) {
        console.error('Error fetching user location:', error);
        return null;
    }
}

const Navbar: React.FC = () => {
    const [userLocation, setUserLocation] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function fetchLocation() {
            const location = await getUserLocation();
            setUserLocation(location ? location.country_name : "Unknown");
        }
        fetchLocation();
    }, []);



    return (
    <nav className={style.navbar}>
        <div className={style.navTop}>
            <div className={style.navLogo}>
                <Hamburger></Hamburger>
                {/* Logo here later */}
                <Link href="/">Nebula</Link>
            </div>

            <div className={style.navSearch}>
                <div className={style.navLocation}>
                    <NerdFonts>
                        
                    </NerdFonts>
                    <div className={style.locationText}>
                        <span>Deliver to</span>
                        <strong>{userLocation}</strong>
                    </div>
                </div>

                {/* Search bar */}
                <form className={style.navSearchBox} action="/search" method="GET">
                    <input type="text" placeholder="Search in Nebula..." />
                    <button type="submit">Search</button>
                </form>

            </div>
            {/* Shopping Interaction */}
            <div className={style.navActions}>
                <NebulaButton 
                    href="/auth/signin"
                    btnValues={"Sign in"}
                    btnComponent = {(
                        <ul style={{position:"absolute"}}>
                            <li>Test1</li>
                            <li>Test1</li>
                            <li>Test1</li>
                            <li>Test1</li>
                        </ul>
                    )}
                />
                <NebulaButton isIcon href="/wishlist" btnValues={""}/>
                <NebulaButton isIcon href="/gifts" btnValues={"󰹄"}/>
                <NebulaButton isIcon notificationCount={5} href="/cart" btnValues={""}/>
                <NebulaButton 
                    btnValues={"Totally a normal button"} 
                    onClick={() => {
                        console.log("Hello World!")
                    }}
                />
            </div>
        </div>
        <div className={style.navBottom}>
            <ul className="navbar-promotions">
                <li><Link href="/features/gifts">Gifts</Link></li>
                <li><Link href="/market/bestsellers">Best Sellers</Link></li>
                <li><Link href="/deals">Today Deals</Link></li>
                <li><Link href="/giftcards">Gift Cards</Link></li>
            </ul>
        </div>
    </nav>
    );
}

export { Navbar };