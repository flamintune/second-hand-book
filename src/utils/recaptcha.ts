declare global {
    interface Window {
        grecaptcha: {
            ready: (callback: () => void) => void;
            execute: (siteKey: string, options: { action: string }) => Promise<string>;
        };
    }
}

const RECAPTCHA_SITE_KEY = '6Ldb_EUqAAAAAPHHmBdKM2fIOFYxGuHcArZO5stb';

export const executeRecaptcha = async (action: string): Promise<string> => {
    try {
        return await new Promise((resolve, reject) => {
            window.grecaptcha.ready(async () => {
                try {
                    const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
                    resolve(token);
                } catch (error) {
                    reject(error);
                }
            });
        });
    } catch (error) {
        console.error('ReCaptcha execution failed:', error);
        throw error;
    }
}; 