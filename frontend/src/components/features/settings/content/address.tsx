import React from "react";
import style from "@styles/layouts/address.module.scss"
import AddressCard from "../address/addressCard";
import { FieldGroup } from "@components/ui/NebulaUI";
import { useAddress } from "@/hooks/useAddress";

const Address: React.FC = () => {

    const { data } = useAddress();

    console.log(data);
    return (

        <section className={style.addressContainer}>
            {data?.length === 0 ? (
                <div className={style.noLocation}>
                    <div>
                        <h2>You don't have addresses yet</h2>
                    </div>
                </div>
                ) : (
                <FieldGroup className={style.hasLocation}>
                    {data?.map((address, index) => (
                        <AddressCard 
                            key={index}
                            {...address}
                        />
                    ))}
                </FieldGroup>
                )
            }
        </section>
    );
}
export default Address;