import { useRouter } from "next/router";
import { useEffect } from "react";
import style from '@styles/layouts/usersetting.module.scss';
import { portalSellerAllowedList } from "src/constants/portalSellerRoutes";

export default function SellerPortal() {
    const router = useRouter();
    const { slug } = router.query;

    const currentPath = Array.isArray(slug) ? "/" + slug.join("/") : "/seller/dashboard";

    const pageMeta = portalSellerAllowedList[currentPath];

    useEffect(() => {
        if (!router.isReady) return;

        if (!pageMeta) router.replace("/portal/seller/dashboard");
    }, [router, pageMeta]);

    if (!router.isReady || !pageMeta) return <p>Loading...</p>;

    const PageComponent = pageMeta.component;

    return (
        <div className={style.userSetting}>
            <PageComponent />
        </div>
    );
}
