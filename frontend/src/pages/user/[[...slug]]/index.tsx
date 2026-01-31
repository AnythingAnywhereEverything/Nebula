import { useRouter } from "next/router";
import { useEffect } from "react";
import style from '@styles/layouts/usersetting.module.scss';
import UserSettingsOptions from "@components/features/settings/userSettingsOptions";
import UserSettingContainer from "@components/features/settings/userSettingContainer";
import { userSettingsAllowList } from "src/constants/userSettingsRoutes";

export default function UserPage() {
  const router = useRouter();
  const { slug } = router.query;

  const currentPath = Array.isArray(slug) ? "/" + slug.join("/") : "/account/profile";

  const pageMeta = userSettingsAllowList[currentPath];

  useEffect(() => {
    if (!router.isReady) return;

    if (!pageMeta) router.replace("/user/account/profile");
  }, [router, pageMeta]);

  if (!router.isReady || !pageMeta) return <p>Loading...</p>;

  const PageComponent = pageMeta.component;

  return (
    <div className={style.userSetting}>
      <UserSettingsOptions />
      <UserSettingContainer title={pageMeta.title} discription={pageMeta.description} extraHeader={pageMeta.extra}>
        <PageComponent />
      </UserSettingContainer>
    </div>
  );
}
