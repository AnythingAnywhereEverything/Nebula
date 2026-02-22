import { Button, Field } from "@components/ui/NebulaUI";
import s from "@styles/sidebar.module.scss"
import Link from "next/link";
import { usePathname } from "next/navigation";

const SellerSettingOption:React.FC = () => {
    const currentPath = usePathname();

    const settingMap=[
        {name: "Account & Security", link: "/portal/seller/order/setting/account" },
        {name: "Notification", link: "/portal/seller/order/setting/notification" },
        {name: "Product", link: "/portal/seller/order/setting/product" },
        {name: "Payment", link: "/portal/seller/order/setting/payment" },
        {name: "Chat", link: "/portal/seller/order/setting/chat" },
        {name: "Vacation Mode", link: "/portal/seller/order/setting/vacation" },
            
    ]

     const renderButtons = (
        items: { name: string; link?: string }[],
        activePath: string
    ) => {
        return items.map((item, index) => {
            const isActive =
                typeof activePath === 'string' &&
                typeof item.link === 'string' &&
                activePath.startsWith(item.link);
    
            return (
                <Button
                    key={index}
                    size={"sm"}
                    variant={"ghost"}
                    justify={"start"}
                    asChild
                    className={isActive ? s.active : ''}
                >
                    <Link href={item.link ?? ""}>
                        {item.name}
                    </Link>
                </Button>
            );
        });
    };
    return(
        <Field orientation={'horizontal'}>
            {renderButtons(settingMap, currentPath)}
        </Field>
    )
}

export default SellerSettingOption;