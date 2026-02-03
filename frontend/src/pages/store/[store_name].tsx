
import AdvanceFilter from "@components/features/search/advanceFilter";
import FilterBar from "@components/features/search/filterBar";
import { Button, ButtonGroup, Field, FieldDescription, FieldGroup, Icon, ProductContainer, ProductContainerDescription, ProductContainerHeader, ProductContainerHeaderAddon, ProductContainerHeaderGroup, ProductContainerTitle, ProductField, ProductHeader, Separator } from "@components/ui/NebulaUI";
import s from "@styles/store.module.scss"
import ReactMarkdown from "react-markdown";
import Markdown from "react-markdown";

export default function Store() {
    return (
        <div className={s.pageContainer}>
            <FieldGroup>
                <StoreHeader />
                <Separator />
                <Field className={s.page}>
                    <ImageContainer />
                    <DisplayShopCategory />
                    <ImageContainer />
                    <DisplayShopCategory />
                    <MarkdownContainer />
                </Field>
                <Separator />
                <Field className={s.allItems} orientation={"horizontal"}>
                
                    <AdvanceFilter/>
                    <Field>
                        <FilterBar/>
                        <ProductField max_rows={10}/>
                    </Field>
                </Field>
            </FieldGroup>
        </div>
    );
}

function DisplayShopCategory(): React.ReactNode {
    return <ProductContainer>
        <ProductContainerHeader>
            <ProductContainerHeaderGroup>
                <ProductContainerTitle>ProductCategory</ProductContainerTitle>
            </ProductContainerHeaderGroup>
            <ProductContainerHeaderAddon>
                <Button variant={"outline"} size={"sm"}>Show more</Button>
            </ProductContainerHeaderAddon>
        </ProductContainerHeader>
        <ProductField max_rows={1}/>
    </ProductContainer>
}

function ImageContainer(): React.ReactNode {
    return (
        <Field>
            <img src="https://placehold.co/2700x1000" alt="" />
        </Field>
    )
}
function MarkdownContainer(): React.ReactNode {
    return (
        <Field>
            <ReactMarkdown>{"# Hello Markdown!\nYikes"}</ReactMarkdown>
        </Field>
    )
}

function StoreHeader(): React.ReactNode {
    return (
        <Field>
            <Field className={s.storeBanner}>
                <img src="https://placehold.co/2700x1000" alt="" />
            </Field>
            <Field className={s.storeDetail} orientation={"horizontal"}>
                <Field className={s.left} orientation={"horizontal"}>
                    <div className={s.profile}>
                        <img src="https://placehold.co/175" alt="" />
                    </div>
                    <div className={s.profileSeparator} />
                    <Field>
                        <h1>Store's Name</h1>
                        <FieldDescription>
                            Active XX minutes ago.
                        </FieldDescription>
                        <ButtonGroup>
                            <ButtonGroup>
                                <Button className={s.iconWithin} size={"sm"}><Icon></Icon>Follow</Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button className={s.iconWithin} size={"sm"}><Icon></Icon>Share</Button>
                            </ButtonGroup>
                        </ButtonGroup>
                    </Field>
                </Field>
                <div className={s.reputation}>
                    <Field orientation={"horizontal"} className={s.reputationDetail}>
                        <Icon className={s.repuIcon}></Icon>
                        Products:
                        <span className={s.highlight}>120</span>
                    </Field>
                    <Field orientation={"horizontal"} className={s.reputationDetail}>
                        <Icon className={s.repuIcon}></Icon>
                        Followers:
                        <span className={s.highlight}>1.2k</span>
                    </Field>
                    <Field orientation={"horizontal"} className={s.reputationDetail}>
                        <Icon className={s.repuIcon}></Icon>
                        Rating:
                        <span className={s.highlight}>4.7 (1.6k Rating)</span>
                    </Field>
                    <Field orientation={"horizontal"} className={s.reputationDetail}>
                        <Icon className={s.repuIcon}></Icon>
                        Joined:
                        <span className={s.highlight}>8 years ago</span>
                    </Field>
                </div>
            </Field>
        </Field>
    )
}