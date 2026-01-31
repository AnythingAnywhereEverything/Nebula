import React from "react";
import style from "@styles/layouts/address.module.scss"
import { NebulaButton } from "@components/ui/NebulaBtn";
import { noAddresses, userAddresses } from "src/mocks/address.mock";
import AddressCard from "../address/addressCard";
import { FieldGroup } from "@components/ui/NebulaUI";

const Address: React.FC = () => {
    const addresses = userAddresses;

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
                    {addresses.map((user, index) => (
                        <AddressCard 
                            key={index}
                            {...user}
                        />
                    ))}
                </FieldGroup>
                )
            }
        </section>
    );
}
export default Address;