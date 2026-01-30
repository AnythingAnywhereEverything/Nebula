import React from "react";
import style from "@styles/layouts/address.module.scss"
import { NebulaButton } from "@components/ui/NebulaBtn";
import { noAddresses, userAddresses } from "src/mocks/address.mock";
import AddressCard from "../address/addressCard";
import { FieldGroup } from "@components/ui/NebulaUI";

const Address: React.FC = () => {
    const addresses = noAddresses;

    return (

        <section className={style.addressContainer}>
            {addresses.length === 0? (
                <div className={style.noLocation}>
                    <div>
                        <h2>You don't have addresses yet</h2>
                    </div>
                </div>
                ) : (
                <FieldGroup className={style.hasLocation}>
                    {addresses.map((item, index) => (
                        <AddressCard 
                            key={index}
                            name={item.name}
                            internationalPrefix={item.internationalPrefix}
                            phoneNumber={item.phoneNumber}
                            addressLocal={item.addressLocal}
                            addressInter={item.addressInter}
                            postal_code={item.postal_code}
                            city={""} 
                            city_id={""}
                            state={""} 
                            state_id={""} 
                            country={""}
                            country_id={""}
                        />
                    ))}
                </FieldGroup>
                )
            }
        </section>
    );
}
export default Address;