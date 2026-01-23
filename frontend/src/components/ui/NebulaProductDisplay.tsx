import React from "react";
import { NebulaButton } from "@components/ui/NebulaBtn";
import cp from "@styles/ui/nebulaProductField.module.scss";
import NebulaProductField from "./NebulaProductField";

type BaseProps = {
    title: string;
    max_rows?: number;
    min_price?: number;
    max_price?: number;
}

type AlterSelectorLinkProps = BaseProps & {
    type: 'customLink';
    text: string;
    link: string;
}

type ShowMoreButtonProps = BaseProps & {
    type: 'showMore';
    recommend: string;
}

type DisplayOnlyProps = BaseProps & {
    type: 'display';
}

type NebulaProductDisplayProps = AlterSelectorLinkProps | ShowMoreButtonProps | DisplayOnlyProps;



const NebulaProductDisplay: React.FC<NebulaProductDisplayProps> = (props) => {
    const {
        title,
        max_rows,
        min_price,
        max_price
    } = props;


    const buttonConfig = (() => {
        if (props.type === "customLink") {
            return {
                href: props.link,
                text: props.text,
            };
        }

        if (props.type === "showMore") {
            const recommendQuery = props.recommend
                ? `q=${encodeURIComponent(props.recommend)}`
                : "";
            const minPriceQuery = min_price !== undefined ? `&min_price=${min_price}` : "";
            const maxPriceQuery = max_price !== undefined ? `&max_price=${max_price}` : "";

            return {
                href: `/search?${recommendQuery}${minPriceQuery}${maxPriceQuery}`,
                text: "Show more",
            };
        }

        return null;
    })();

    
    return (
        <section className={cp.selectorContainer}>
            <header className={`${cp.selectorHeader} ${buttonConfig ? "" : cp.displayHeader}`}>
                <h2 className={cp.title}>{title}</h2>
                {buttonConfig && (
                    <NebulaButton
                        href={buttonConfig.href}
                        className={cp.showMoreButton}
                        btnValues={buttonConfig.text}
                    />
                )}
            </header>
            <NebulaProductField max_rows={max_rows}/>
        </section>
    );
};

export default NebulaProductDisplay;
