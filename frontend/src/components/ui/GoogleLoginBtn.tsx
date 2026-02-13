import { useGoogleLogin } from "@react-oauth/google";
import { Button, Icon } from "./NebulaUI";
import { useRouter } from "next/router";
import { setCacheUserId, setToken } from "@/handler/token_handler";

export default function GoogleAuthButton() {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google token response:", tokenResponse);

      const res = await fetch("/api/v2/auth/oauth_register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          access_token: tokenResponse.access_token,
        }),
      });

      
      if (!res.ok) {
        console.error("OAuth registration failed");
        return;
      }
      
      const data = await res.json();
      setToken(data.token);
      setCacheUserId(data.user_id);

      router.push("/");
    },
  });


  return (
    <Button variant={"outline"} onClick={() => login()}>
      <Icon value="" />
      Continue with Google
    </Button>
  );
}
