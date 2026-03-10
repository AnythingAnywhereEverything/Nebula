import {
    Button,
    ButtonGroup,
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
    Input,
    Textarea,
} from "@components/ui/NebulaUI";
import {
    SellerHeader,
    SellerLayout,
    SellerPanel,
    SellerPanelHeader,
} from "@components/layouts/sellerPageLayout";

import s from "@styles/layouts/seller/sellersetting.module.scss"
import {useEffect, useState } from "react";
import Form from "next/form";
import { updateShopInfo, UpdateShopInfo, getCurrentShopInfo} from "@/api/shop";
import { useShopService } from "@/hooks/useShopService";
import Avatar from "@components/ui/Nebula/avatar";
import { useParams } from "next/navigation";
import ShopSettingsCompo from "./settings/settings";

export default function ShopSettings() {
    const [errors, setErrors] = useState<{
        main: string | null
        profile: string | null
        banner: string | null
    }>({
        main: null,
        profile: null,
        banner: null
    })
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [loadingBanner, setLoadingBanner] = useState(false);
    
    const [previewProfile, setPreviewProfile] = useState< string | null>(null)
    const [previewBanner, setPreviewBanner] = useState< string | null>(null)

    const [selectedProfileFile, setSelectedProfileFile] = useState<File | null>(null);
    const [selectedBannerFile, setselectedBannerFile] = useState<File | null>(null);
    
    const [newStoreName, setNewStoreName] = useState('');
    const [newStoreDescription, setNewStoreDescription] = useState('');

    const {shopUpdateProfile, shopUpdateBanner} = useShopService();

    const { shop_id } = useParams();
    const [currentShop, setCurrentShop] = useState<any>();
    
    useEffect(() => {
        if (!shop_id || Array.isArray(shop_id)) return

        const fetchShop = async () => {
            try {
                const res = await getCurrentShopInfo(shop_id)
                if (res) {
                    console.log(res)
                    setCurrentShop(res)
                }
            } catch (e) {
                console.log(e)
            }
        }
        fetchShop()
    }, [shop_id])

    const handleImageFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "profile" | "banner"
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > 8 * 1024 * 1024) {
            setErrors(perv => ({
                ...perv,
                main:"File too large. Maximum size is 8MB."
            }))
            return
        }
    
        const objectUrl = URL.createObjectURL(file)
    
        if (type === "profile") {
            setPreviewProfile(objectUrl)
            setSelectedProfileFile(file)
        
            setErrors(prev => ({
                ...prev,
                profile: null
            }))
        } else {
            setPreviewBanner(objectUrl)
            setselectedBannerFile(file)
        
            setErrors(prev => ({
                ...prev,
                banner: null
            }))
        }
    }

    const handleImageCancel = (
        field: "profile" | "banner"
    ) => {
        if (field === "profile"){
            setPreviewProfile(null);
            setSelectedProfileFile(null);
            setErrors(prev => ({
                ...prev,
                profile: null
            }))
        } else {
            setPreviewBanner(null);
            setselectedBannerFile(null);
            setErrors(prev => ({
                ...prev,
                banner: null
            }))
        }
    }

    // * Submit handler
    const handleProfileSubmit = async () => {
        if (!selectedProfileFile || !currentShop?.id) return;
        
        try {
            setLoadingProfile(true);
                await shopUpdateProfile({
                shopId: currentShop.id,
                file: selectedProfileFile
            });
            setSelectedProfileFile(null);
        } catch (err: any) {
            setErrors(prev => ({
                ...prev,
                profile: err?.message || "Upload failed."
            }));
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleBannerSubmit = async () => {
        if (!selectedBannerFile || !currentShop) return;
        
        try {
            setLoadingBanner(true);
                await shopUpdateBanner({
                shopId: currentShop.id,
                file: selectedBannerFile
            });
            setSelectedProfileFile(null);
        } catch (err: any) {
            setErrors(prev => ({
                ...prev,
                profile: err?.message || "Upload failed."
            }));
        } finally {
            setLoadingBanner(false);
        }
    };

    const handleInfoSummit = (e:React.FormEvent) => {
        e.preventDefault()
        const payload: UpdateShopInfo = {
            id: `${currentShop.id}`,
            name: `${newStoreName}`,
            description:`${newStoreDescription}`,
        }
        updateShopInfo(payload);
    }

    const pendingProfileChange = !!selectedProfileFile;
    const pendingBannerChange = !!selectedBannerFile;

    return (
        <SellerLayout>
            <SellerHeader>Shop Settings</SellerHeader>
            <ShopSettingsCompo/>
            <SellerPanel>
                <SellerPanelHeader>Shop basic information</SellerPanelHeader>
                <FieldSeparator />
                <Form action={"#"}>
                    <Field>
                        <FieldGroup >
                            <Field className={s.storeProfile}>
                                <Field>
                                    <Field orientation={'horizontal'}>
                                        <Field>
                                            <FieldLabel>Store banner</FieldLabel>
                                        </Field>
                                        
                                            {!pendingBannerChange && (
                                                <Button variant="outline" size={"sm"} asChild>
                                                    <FieldLabel htmlFor="banner">
                                                        Change
                                                    </FieldLabel>
                                                </Button>
                                            )}
                                            
                                            {pendingBannerChange && (
                                                <ButtonGroup>
                                                    <ButtonGroup>
                                                        <Button size={"sm"} onClick={handleBannerSubmit} disabled={loadingBanner}>
                                                            {loadingBanner ? "Saving..." : "Save"}
                                                        </Button>
                                                    </ButtonGroup>
                                            
                                                    <ButtonGroup>
                                                        <Button
                                                            size={"sm"}
                                                            variant="outline"
                                                            onClick={() => handleImageCancel('banner')}
                                                            disabled={loadingBanner}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ButtonGroup>
                                                </ButtonGroup>
                                            )}
                                        <Button onClick={() => console.log(shop_id)}>
                                            Debug
                                        </Button>
                                    </Field>
                                    <Field orientation={'horizontal'} style={{gap: "calc(var(--spacing)* 4)"}}>
                                        <FieldGroup className={s.storeBannerContainer}>
                                            <FieldLabel htmlFor="banner">
                                                <img src={previewBanner ??  `/cdn/${currentShop?.shop_banner_url}`} alt="" />
                                            </FieldLabel>
                                            
                                                {errors.banner && (
                                                    <FieldDescription className={s.error}>
                                                    {errors.banner}
                                                    </FieldDescription>
                                                )}

                                                <Input
                                                type="file"
                                                id="banner"
                                                name = "banner"
                                                accept="image/jpg, image/jpeg" 
                                                hidden
                                                onChange={(e) => handleImageFileChange(e, 'banner')} 
                                                />
                                        </FieldGroup>
                                        
                                        <FieldDescription>
                                                Background images are displayed. Ideal size Is 3840x1240 pixels.<br/>
                                                Click the Image or Upload to change Banner
                                        </FieldDescription>
                                    </Field>
                                </Field>

                                <Field>
                                    <Field orientation={'horizontal'}>
                                        <Field>
                                            <FieldLabel>Store Profile</FieldLabel>
                                        </Field>
                                        {!pendingProfileChange && (
                                                <Button variant="outline" size={"sm"} asChild>
                                                    <FieldLabel htmlFor="profile">
                                                        Change
                                                    </FieldLabel>
                                                </Button>
                                            )}
                                            
                                            {pendingProfileChange && (
                                                <ButtonGroup>
                                                    <ButtonGroup>
                                                        <Button size={"sm"} onClick={handleProfileSubmit} disabled={loadingProfile}>
                                                            {loadingProfile ? "Saving..." : "Save"}
                                                        </Button>
                                                    </ButtonGroup>
                                            
                                                    <ButtonGroup>
                                                        <Button
                                                            size={"sm"}
                                                            variant="outline"
                                                            onClick={() => handleImageCancel('profile')}
                                                            disabled={loadingProfile}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    </ButtonGroup>
                                                </ButtonGroup>
                                            )}
                                    </Field>
                                    <Field orientation={'horizontal'}>
                                        <Field orientation={'horizontal'} className={s.storeProfileContainer}>
                                            <FieldLabel htmlFor="profile">
                                                <Avatar className={s.avatar} src={previewProfile ?? currentShop?.shop_profile_url} fill />
                                            </FieldLabel>
                                                
                                            {errors.profile && (
                                                    <FieldDescription className={s.error}>
                                                    {errors.profile}
                                                    </FieldDescription>
                                                )}
                                            <Input
                                                type="file"
                                                id="profile"
                                                name = "store-profile"
                                                accept="image/jpg, image/jpeg" 
                                                hidden
                                                onChange={(e) => handleImageFileChange(e, 'profile')}
                                                />
                                        </Field>

                                        <FieldDescription>
                                                    Ideal size is 175x175<br/>
                                                    Click the Image or Upload to change Profile
                                        </FieldDescription>
                                    </Field>
                                </Field>
                            </Field>

                        </FieldGroup>
                        <Field style={{paddingTop: "calc(var(--spacing) * 4)"}}>
                            <Field>
                                <FieldLabel>Store name <span>( current name : {currentShop?.name} )</span></FieldLabel>
                                <Input placeholder="Store name"
                                value={newStoreName}
                                defaultValue={currentShop?.name}
                                onChange={(e) => setNewStoreName(e.target.value)}
                                />
                            </Field>
                            <Field>
                                <FieldLabel>Store Description</FieldLabel>
                                <Textarea placeholder="Store description"
                                value={newStoreDescription}
                                onChange={(e) => setNewStoreDescription(e.target.value)}
                                />
                            </Field>
                        </Field>
                        {errors.main && (
                            <FieldDescription className={s.error}>
                            {errors.main}
                            </FieldDescription>
                        )}
                    </Field>
                </Form>
                <FieldSeparator/>
                <Field orientation={'horizontal'}>
                    <Field></Field>
                    <Button variant={'outline'}>Reset</Button>
                    <Button 
                    variant={'default'}
                    onClick={handleInfoSummit}
                    >Submit</Button>
                </Field>
            </SellerPanel>
        </SellerLayout>
    );
}
