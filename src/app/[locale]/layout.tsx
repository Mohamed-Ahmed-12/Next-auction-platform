import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/routing';
import ClientWrapper from '@/components/wrappers/ClientWrapper';
import "./globals.css";
import "flag-icons/css/flag-icons.min.css";
import { Quicksand, Cairo } from 'next/font/google';

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const cairo = Cairo({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate locale
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Load messages server-side
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  // Determine text direction (optional but recommended)
  const direction = locale === 'ar' ? 'rtl' : 'ltr';


  return (
    <html lang={locale} dir={direction}>
      <body className={locale == "ar" ? `${cairo.className}` : `${quicksand.className} `}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}