import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Head from 'next/head';
import style from '@styles/layouts/authLayout.module.scss';
import { Button, FieldDescription, FieldError, FieldSet } from '@components/ui/NebulaUI';
import { verifyEmail } from '@/api/user';
import { NextPageWithLayout } from '@/types/global';
import AuthLayout from '@components/layouts/main-layouts/authLayout';
import Link from 'next/link';

const VerifyEmailPage: NextPageWithLayout = () => {
    const searchParams = useSearchParams();
    const e_token = searchParams.get('e_token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (!e_token) {
            setStatus('error');
            return;
        }

        const performVerification = async () => {
            let verify = await verifyEmail(e_token);
            if (verify) {
                setStatus("success")
            } else {
                setStatus("error")
            }
        };

        performVerification();
    }, [e_token]);

    return (
        <>
            <Head>
                <title>Nebula - Verify Email</title>
            </Head>
            <div className={style.authContainer}>
                <div className={style.form}>
                    <FieldSet>
                        {status === 'loading' && (
                            <>
                                <h2>Verifying your email...</h2>
                                <p>Please wait while we confirm your account.</p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <h2>Email Verified!</h2>
                                <FieldDescription>Your account is now active. You can now close this window.</FieldDescription>
                                <Button variant={"outline"} asChild>
                                    <Link href={"/"}>
                                        Go to home page
                                    </Link>
                                </Button>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <h2>Verification Failed</h2>
                                <FieldError>The link is invalid, expired, or has already been used.</FieldError>
                                <Button variant={"outline"} asChild>
                                    <Link href={"/"}>
                                        Go to home page
                                    </Link>
                                </Button>
                            </>
                        )}
                    </FieldSet>
                </div>
            </div>
        </>
    );
};

VerifyEmailPage.getLayout = (page) => (
    <AuthLayout>{page}</AuthLayout>
);

export default VerifyEmailPage;
