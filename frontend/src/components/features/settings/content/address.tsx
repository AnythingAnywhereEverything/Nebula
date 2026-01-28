import React from "react";
import style from "@styles/layouts/address.module.scss"
import { NebulaButton } from "@components/ui/NebulaBtn";
import { noAddresses, userAddresses } from "src/mocks/address.mock";
import AddressCard from "../address/addressCard";

const Address: React.FC = () => {
    const addresses = userAddresses;

    return (

        <section className={style.addressContainer}>
            <div className={style.addressHead}>
                <h3>Address</h3>
            </div>

            <section className={style.locationContainer}>
                
                {addresses.length === 0? (
                    <div className={style.noLocation}>
                        <div>
                            <h2>You don't have addresses yet</h2>
                        </div>
                    </div>
                    ) : (
                    <section className={style.hasLocation}>
                        {addresses.map((item, index) => (
                            <AddressCard 
                            key={index}
                            name={item.name}  
                            internationalPrefix={item.internationalPrefix}
                            phoneNumber={item.phoneNumber}
                            addressLocal={item.addressLocal}
                            addressInter={item.addressInter}
                            postalCode={item.postalCode}
                            />
                        ))}
                    </section>
                    )
                }

            </section>

            <NebulaButton 
            className={style.setAddress}
            btnValues = "Add address"
            onClick={ () => {

            }}
            />
        </section>
    );
}
export default Address;