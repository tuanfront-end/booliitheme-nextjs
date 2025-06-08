import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { RootLayout } from '@/components/RootLayout'
import { Border } from '@/components/Border'
import productImage from '@/images/bitpan.png'
import bitpanImage from '@/images/bitpan.png'
import bitpanImage2 from '@/images/bitpan2.png'
import chisfisImage from '@/images/chisfis.png'
import chisfisImage2 from '@/images/chisfis2.png'
import cisecoImage from '@/images/ciseco.png'
import cisecoImage2 from '@/images/ciseco2.png'
import ncmazImage from '@/images/ncmaz.png'
import ncmazImage2 from '@/images/ncmaz2.png'
import ciscrypImage from '@/images/ciscryp.png'
import ciscrypImage2 from '@/images/ciscryp2.png'
import ncmazfaustImage from '@/images/ncmazfaust.png'
import ncmazfaustImage2 from '@/images/ncmazfaust2.png'
import ncmazfseImage from '@/images/ncmazfse.png'
import ncmazfseImage2 from '@/images/ncmazfse2.png'
import cisecoh2Image from '@/images/cisecoh2.png'
import cisecoh2Image2 from '@/images/cisecoh2-2.png'
import clsx from 'clsx'

const CleanIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={'currentColor'}
    fill={'none'}
    {...props}
  >
    <path
      d="M21 3L13 11.5"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M9.44573 11.0854C6.96539 12.0368 4.98269 11.8736 3 11.0885C3.50059 17.531 6.50414 20.0089 10.5089 21C10.5089 21 13.5261 18.8664 13.961 13.8074C14.0081 13.2595 14.0317 12.9856 13.9178 12.6769C13.8038 12.3682 13.5802 12.1468 13.1329 11.704C12.3973 10.9757 12.0295 10.6116 11.5929 10.5204C11.1564 10.4293 10.5862 10.648 9.44573 11.0854Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M4.5 16.4464C4.5 16.4464 7 16.9286 9.5 15"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M8.5 7.25C8.5 7.94036 7.94036 8.5 7.25 8.5C6.55964 8.5 6 7.94036 6 7.25C6 6.55964 6.55964 6 7.25 6C7.94036 6 8.5 6.55964 8.5 7.25Z"
      stroke="currentColor"
      strokeWidth="0.8"
    ></path>
    <path
      d="M11 4V4.1"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
)

const BlockGameIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={'currentColor'}
    fill={'none'}
    {...props}
  >
    <path
      d="M22 18C22 19.4001 22 20.1002 21.7275 20.635C21.4878 21.1054 21.1054 21.4878 20.635 21.7275C20.1002 22 19.4001 22 18 22C16.5999 22 15.8998 22 15.365 21.7275C14.8946 21.4878 14.5122 21.1054 14.2725 20.635C14 20.1002 14 19.4001 14 18C14 16.5999 14 15.8998 14.2725 15.365C14.5122 14.8946 14.8946 14.5122 15.365 14.2725C15.8998 14 16.5999 14 18 14C19.4001 14 20.1002 14 20.635 14.2725C21.1054 14.5122 21.4878 14.8946 21.7275 15.365C22 15.8998 22 16.5999 22 18Z"
      stroke="currentColor"
      strokeWidth="0.8"
    ></path>
    <path
      d="M22 10C22 11.4001 22 12.1002 21.7275 12.635C21.4878 13.1054 21.1054 13.4878 20.635 13.7275C20.1002 14 19.4001 14 18 14C16.5999 14 15.8998 14 15.365 13.7275C14.8946 13.4878 14.5122 13.1054 14.2725 12.635C14 12.1002 14 11.4001 14 10C14 8.59987 14 7.8998 14.2725 7.36502C14.5122 6.89462 14.8946 6.51217 15.365 6.27248C15.8998 6 16.5999 6 18 6C19.4001 6 20.1002 6 20.635 6.27248C21.1054 6.51217 21.4878 6.89462 21.7275 7.36502C22 7.8998 22 8.59987 22 10Z"
      stroke="currentColor"
      strokeWidth="0.8"
    ></path>
    <path
      d="M14 18C14 19.4001 14 20.1002 13.7275 20.635C13.4878 21.1054 13.1054 21.4878 12.635 21.7275C12.1002 22 11.4001 22 10 22C8.59987 22 7.8998 22 7.36502 21.7275C6.89462 21.4878 6.51217 21.1054 6.27248 20.635C6 20.1002 6 19.4001 6 18C6 16.5999 6 15.8998 6.27248 15.365C6.51217 14.8946 6.89462 14.5122 7.36502 14.2725C7.8998 14 8.59987 14 10 14C11.4001 14 12.1002 14 12.635 14.2725C13.1054 14.5122 13.4878 14.8946 13.7275 15.365C14 15.8998 14 16.5999 14 18Z"
      stroke="currentColor"
      strokeWidth="0.8"
    ></path>
    <path
      d="M10 6C10 7.40013 10 8.1002 9.72752 8.63497C9.48783 9.10538 9.10538 9.48783 8.63498 9.72752C8.1002 10 7.40013 10 6 10C4.59987 10 3.8998 10 3.36502 9.72751C2.89462 9.48783 2.51217 9.10538 2.27248 8.63497C2 8.10019 2 7.40013 2 6C2 4.59987 2 3.8998 2.27248 3.36502C2.51217 2.89462 2.89462 2.51217 3.36502 2.27248C3.8998 2 4.59987 2 6 2C7.40013 2 8.1002 2 8.63498 2.27248C9.10538 2.51217 9.48783 2.89462 9.72752 3.36502C10 3.8998 10 4.59987 10 6Z"
      stroke="currentColor"
      strokeWidth="0.8"
    ></path>
  </svg>
)

const ApiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={'currentColor'}
    fill={'none'}
    {...props}
  >
    <path
      d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z"
      stroke="currentColor"
      strokeWidth="0.8"
    ></path>
    <path
      d="M6 13.5L7.5 9L9.375 13.5M6 13.5L5.5 15M6 13.5H9.375M9.375 13.5L10 15"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M12.5 12V9.7C12.5 9.51387 12.5 9.42081 12.5245 9.34549C12.5739 9.19327 12.6933 9.07393 12.8455 9.02447C12.9208 9 13.0139 9 13.2 9H14.5C15.3284 9 16 9.67157 16 10.5C16 11.3284 15.3284 12 14.5 12H12.5ZM12.5 12V15"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M18.5 9V15"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
)

const CheckmarkCircle02Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={'currentColor'}
    fill={'none'}
    {...props}
  >
    <path
      d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
      stroke="currentColor"
      strokeWidth="0.8"
    ></path>
    <path
      d="M8 12.5L10.5 15L16 9"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
)

const ShopifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={'currentColor'}
    fill={'none'}
    {...props}
  >
    <path
      d="M16 23V4L4 7.5L3 20.5L16 23Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M17.5 5.14833L16 4V23L21 21.5C21 18.8371 20.7998 16.178 20.4012 13.5451L19.1298 5.14833H17.5Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M13.0016 4.87502C13.0092 2.85785 12.239 1.26304 11.0023 1.02911C9.44084 0.73373 7.72699 2.71982 7.17435 5.46517C7.09535 5.85761 7.04435 6.24433 7.01953 6.61979"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M14.8665 4.33083C14.5732 3.14854 13.9527 2.31296 13.1092 2.14837C11.7258 1.8784 10.2195 3.50662 9.55469 5.8801"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M12.7896 9.42437C11.7896 9.0035 9.19076 8.24627 8.50372 10.266C8.1332 11.3553 8.79795 12.5183 10.2171 13.6331C12.2041 15.1939 11.867 16.524 11.5033 17.0001C10.2176 18.6837 7.64621 17.7016 6.78906 17.0001"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
)

const WordpressIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={'currentColor'}
    fill={'none'}
    {...props}
  >
    <path
      d="M2 6H3M3 6L7.457 17.4921C8.10731 19.1689 8.43246 20.0073 8.9816 20C9.53074 19.9926 9.83482 19.1459 10.443 17.4524L10.5 17.2935M3 6H6.5M6.5 6H7.457M6.5 6L10.5 17.2935M10.5 17.2935L12.816 11"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M10 6H11M11 6L15.457 17.4921C16.1073 19.1689 16.4325 20.0073 16.9816 20C17.5307 19.9926 17.8348 19.1459 18.443 17.4524L18.5 17.2935M11 6H14.5M14.5 6H15.457M14.5 6L18.5 17.2935M18.5 17.2935L20.5288 11.644M20.5288 11.644L21.5377 9.23491C21.9415 8.12432 22.0835 6.93739 21.9529 5.76443C21.7963 4.35795 21.1576 3 19.5012 3C17.9632 3 17.2101 4.72272 18.1898 5.89363C19.7701 7.78249 21.1719 9.87537 20.5288 11.644Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
)

const TailwindcssIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    color={'currentColor'}
    fill={'none'}
    {...props}
  >
    <path
      d="M12 6C8.4 6 7.16667 8.66667 7 10C7 10 7.81901 8.41169 9.86274 8.41169C12.3627 8.41169 12.5667 12 17.0667 12C20.7116 12 21.8333 9.51702 22 8.27554C22 8.27554 21.2198 9.67872 19.2198 9.67872C16.7296 9.67872 16.4134 6 12 6Z"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinejoin="round"
    />
    <path
      d="M7 12C3.4 12 2.16667 14.6667 2 16C2 16 2.81901 14.4117 4.86274 14.4117C7.36274 14.4117 7.56671 18 12.0667 18C15.7116 18 16.8333 15.517 17 14.2755C17 14.2755 16.2198 15.6787 14.2198 15.6787C11.7296 15.6787 11.4134 12 7 12Z"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinejoin="round"
    />
  </svg>
)

const ReactIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={clsx(
      'size-8 flex-none stroke-current text-gray-400',
      props.className,
    )}
    fill="none"
  >
    <ellipse cx="16" cy="16" rx="13" ry="5"></ellipse>
    <ellipse
      cx="16"
      cy="16"
      rx="13"
      ry="5"
      transform="rotate(60 16 16)"
    ></ellipse>
    <ellipse
      rx="13"
      ry="5"
      transform="matrix(-.5 .86603 .86603 .5 16 16)"
    ></ellipse>
    <circle cx="16" cy="16" r="2"></circle>
  </svg>
)

const NextIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={clsx(
      'size-8 flex-none stroke-current text-gray-400',
      props.className,
    )}
    fill="none"
  >
    <defs>
      <linearGradient
        id="next-icon-gradient-a"
        x1="15.125"
        y1="18.25"
        x2="24.25"
        y2="27.375"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".24" stopColor="currentColor"></stop>
        <stop offset="1" stopColor="currentColor" stopOpacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="next-icon-gradient-b"
        x1="20.5"
        y1="11.25"
        x2="20.5"
        y2="18.25"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="currentColor"></stop>
        <stop offset="1" stopColor="currentColor" stopOpacity="0"></stop>
      </linearGradient>
    </defs>
    <path d="M16.25 28.5c6.765 0 12.25-5.485 12.25-12.25S23.015 4 16.25 4 4 9.485 4 16.25 9.485 28.5 16.25 28.5Z"></path>
    <path
      d="M12 21.5V12l12.25 14.25"
      stroke="url(#next-icon-gradient-a)"
    ></path>
    <path
      d="M21.25 12a.75.75 0 1 0-1.5 0v8.17l1.5 1.64V12Z"
      fill="url(#next-icon-gradient-b)"
      strokeWidth="0"
    ></path>
  </svg>
)

const Typescript01Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    color={'currentColor'}
    fill={'none'}
    {...props}
  >
    <path
      d="M2.5 12.0001C2.5 7.52178 2.5 5.28261 3.89124 3.89136C5.28249 2.50012 7.52166 2.50012 12 2.50012C16.4783 2.50012 18.7175 2.50012 20.1088 3.89136C21.5 5.28261 21.5 7.52178 21.5 12.0001C21.5 16.4785 21.5 18.7176 20.1088 20.1089C18.7175 21.5001 16.4783 21.5001 12 21.5001C7.52166 21.5001 5.28249 21.5001 3.89124 20.1089C2.5 18.7176 2.5 16.4785 2.5 12.0001Z"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinejoin="round"
    ></path>
    <path
      d="M18 12.0001H16.2C15.5373 12.0001 15 12.5374 15 13.2001V13.8001C15 14.4629 15.5373 15.0001 16.2 15.0001H16.8C17.4627 15.0001 18 15.5374 18 16.2001V16.8001C18 17.4629 17.4627 18.0001 16.8 18.0001H15"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M8.5 12.0001H10.5M12.5 12.0001H10.5M10.5 12.0001V18.0001"
      stroke="currentColor"
      strokeWidth="0.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
)

const ArrowUpRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.1}
    stroke="currentColor"
    className="size-6"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
    />
  </svg>
)

export const metadata: Metadata = {
  description: 'We are Booliitheme. We design high-quality website templates.',
}

export default async function Home() {
  return (
    <RootLayout>
      <Container className="mt-24 sm:mt-32 md:mt-56">
        <FadeIn className="max-w-3xl">
          <h1 className="font-display text-5xl font-medium tracking-tight text-balance text-neutral-950 sm:text-7xl">
            We are Booliitheme. We design high-quality website templates.
          </h1>
          <p className="mt-6 text-xl text-neutral-600">
            Enthusiast of designing websites from sketch to implementation into
            live versions. Ready to meet client expectations as a freelancer or
            full-time project manager.
          </p>
        </FadeIn>
      </Container>
      <GridProjects />
      <ContactSection />
    </RootLayout>
  )
}

const projects = [
  {
    id: 1,
    name: 'Bitpan',
    shortDescription: 'Multi-purpose E-commerce Next.js template',
    price: '$29',
    rating: 5,
    reviewCount: 14,
    image: bitpanImage,
    image2: bitpanImage2,
    imageAlt: 'Bitpan - Multipurpose eCommerce Next.js Template',
    isNew: true,
    description:
      'Bitpan is a modern and responsive Next.js template designed for multi-purpose e-commerce websites. It features a clean and user-friendly interface, making it easy for users to browse and purchase products online.',
    href: 'https://bitpan-ecommerce-nextjs-template.vercel.app',
    features: [
      {
        name: 'Next.js 15',
        icon: NextIcon,
      },
      {
        name: 'Tailwind CSS 4',
        icon: TailwindcssIcon,
      },
      {
        name: 'React 19',
        icon: ReactIcon,
      },
      {
        name: 'TypeScript 5',
        icon: Typescript01Icon,
      },
    ],
  },
  {
    id: 2,
    name: 'Chisfis',
    shortDescription: 'Online Booking Next.js Template',
    price: '$29',
    rating: 5,
    reviewCount: 380,
    image: chisfisImage,
    image2: chisfisImage2,
    imageAlt: 'Chisfis - Online Booking Next.js Template',
    href: 'https://chisfis-nextjs.vercel.app',
    description:
      'Chisfis is a modern and responsive Next.js template designed for booking online services. It features a clean and user-friendly interface, making it easy for users to navigate and book services online.',
    features: [
      {
        name: 'Next.js 15',
        icon: NextIcon,
      },
      {
        name: 'Tailwind CSS 4',
        icon: TailwindcssIcon,
      },
      {
        name: 'React 19',
        icon: ReactIcon,
      },
      {
        name: 'TypeScript 5',
        icon: Typescript01Icon,
      },
    ],
  },
  {
    id: 3,
    name: 'Ciseco',
    shortDescription: 'E-commerce Next.js template',
    price: '$29',
    rating: 5,
    reviewCount: 18,
    image: cisecoImage,
    image2: cisecoImage2,
    imageAlt: 'Ciseco - E-commerce Next.js template',
    href: 'https://ciseco-nextjs.vercel.app',
    description:
      'Ciseco is a modern and responsive Next.js template designed for e-commerce websites. It features a clean and user-friendly interface, making it easy for users to browse and purchase products online.',
    features: [
      {
        name: 'Next.js 15',
        icon: NextIcon,
      },
      {
        name: 'Tailwind CSS 4',
        icon: TailwindcssIcon,
      },
      {
        name: 'React 19',
        icon: ReactIcon,
      },
      {
        name: 'TypeScript 5',
        icon: Typescript01Icon,
      },
    ],
  },
  {
    id: 4,
    name: 'Ncmaz',
    shortDescription: 'Blog, News and Magazine Next.js template',
    price: '$29',
    rating: 5,
    reviewCount: 14,
    image: ncmazImage,
    image2: ncmazImage2,
    imageAlt: 'Ncmaz - Blog, News and Magazine Next.js template',
    description:
      'Ncmaz is a modern and responsive Next.js template designed for blogs, news, and magazine websites. It features a clean and user-friendly interface, making it easy for users to read and share articles.',
    href: 'https://ncmaz-nextjs.vercel.app',
    features: [
      {
        name: 'Next.js 14',
        icon: NextIcon,
      },
      {
        name: 'Tailwind CSS 3',
        icon: TailwindcssIcon,
      },
      {
        name: 'React 18',
        icon: ReactIcon,
      },
      {
        name: 'TypeScript 5',
        icon: Typescript01Icon,
      },
    ],
  },
  {
    id: 8,
    name: 'Ciscryp',
    shortDescription: 'NFT Marketplace NextJs React Template',
    price: '$29',
    rating: 5,
    reviewCount: 14,
    image: ciscrypImage,
    image2: ciscrypImage2,
    imageAlt: 'Ciscryp - NFT Marketplace NextJs React Template',
    description:
      'Ciscryp is a modern and responsive Next.js template designed for NFT marketplaces. It features a clean and user-friendly interface, making it easy for users to browse, buy, and sell NFTs online.',
    href: 'https://ciscryp-nextjs.vercel.app',
    features: [
      {
        name: 'Next.js 14',
        icon: NextIcon,
      },
      {
        name: 'Tailwind CSS 3',
        icon: TailwindcssIcon,
      },
      {
        name: 'React 18',
        icon: ReactIcon,
      },
      {
        name: 'TypeScript 5',
        icon: Typescript01Icon,
      },
    ],
  },
  {
    id: 5,
    name: 'Ciseco Hydrogen',
    shortDescription: "Hydrogen Shopify's Headless Store theme",
    price: '$49',
    rating: 5,
    reviewCount: 14,
    image: cisecoh2Image,
    image2: cisecoh2Image2,
    imageAlt: "Ciseco - Hydrogen Shopify's Headless Store theme",
    description:
      "Ciseco Hydrogen is a modern and responsive Next.js template designed for Shopify's headless store. It features a clean and user-friendly interface, making it easy for users to browse and purchase products online.",
    href: 'https://ciseco-h2.booliitheme.com',
    features: [
      {
        name: 'Shopify Hydrogen',
        icon: ShopifyIcon,
      },
      {
        name: 'Tailwind CSS 3',
        icon: TailwindcssIcon,
      },
      {
        name: 'React 18',
        icon: ReactIcon,
      },
      {
        name: 'TypeScript 5',
        icon: Typescript01Icon,
      },
    ],
  },
  {
    id: 6,
    name: 'Ncmaz Headless WP',
    shortDescription: 'Next.js Headless WordPress Blog Magazine template',
    price: '$49',
    rating: 5,
    reviewCount: 14,
    image: ncmazfaustImage,
    image2: ncmazfaustImage2,
    imageAlt: 'Ncmaz - NextJs Headless WordPress Blog Magazine template',
    description:
      'Ncmaz Headless WordPress is a modern and responsive Next.js template designed for headless WordPress blogs and magazines. It features a clean and user-friendly interface, making it easy for users to read and share articles.',
    href: 'https://ncmaz-faust-delta.vercel.app',
    features: [
      {
        name: 'WordPress 6.8',
        icon: WordpressIcon,
      },
      {
        name: 'Next.js 14',
        icon: NextIcon,
      },
      {
        name: 'Tailwind CSS 3',
        icon: TailwindcssIcon,
      },
      {
        name: 'TypeScript 5',
        icon: Typescript01Icon,
      },
    ],
  },
  {
    id: 7,
    name: 'Ncmaz WordPress FSE',
    shortDescription: 'Ncmaz WordPress Full Site Editing Block Theme',
    price: '$49',
    rating: 5,
    reviewCount: 14,
    image: ncmazfseImage,
    image2: ncmazfseImage2,
    imageAlt: 'Ncmaz - News Magazine Full Site Editing WordPress Block Theme',
    description:
      'Ncmaz WordPress FSE is a modern and responsive WordPress block theme designed for news and magazine websites. It features a clean and user-friendly interface, making it easy for users to read and share articles.',
    href: 'https://ncmaz-fse.booliitheme.com',
    features: [
      {
        name: 'WordPress 6.8',
        icon: WordpressIcon,
      },
      {
        name: 'Full Site Editing',
        icon: CleanIcon,
      },
      {
        name: 'Gutenberg Blocks',
        icon: BlockGameIcon,
      },
      {
        name: 'WordPress Interactive API',
        icon: ApiIcon,
      },
    ],
  },
]

function GridProjects() {
  return (
    <div className="mt-24 sm:mt-32 lg:mt-40">
      <Container>
        <FadeIn>
          <Border className="pt-16">
            <div className="max-w-3xl">
              <p
                className="block scroll-mt-8 font-display text-base font-semibold text-neutral-950"
                id="work"
              >
                Our work
              </p>
              <h2 className="mt-6 block font-display text-4xl font-medium tracking-tight text-balance text-neutral-950 sm:text-5xl">
                Featured projects
              </h2>
              <p className="mt-6 text-xl text-neutral-600">
                Explore our latest projects, showcasing our design and
                development expertise. Each is crafted with attention to detail
                and a focus on user experience.
              </p>
            </div>
          </Border>
        </FadeIn>

        <FadeInStagger className="mt-14 grid flex-1 grid-cols-1 border-t border-l border-gray-200 sm:mx-0 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <FadeIn
              key={project.id}
              className="group/prd relative flex flex-col border-r border-b border-gray-200 p-4 sm:p-6"
            >
              <div className="relative aspect-2118/1984 ring-8 ring-neutral-100 ring-offset-8">
                <Image
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  priority
                  alt={project.imageAlt}
                  src={project.image}
                  className="z-0 object-cover"
                />
                <Image
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  priority
                  alt={project.imageAlt}
                  src={project.image2 || project.image}
                  className="z-0 object-cover opacity-0 transition-opacity duration-300 group-hover/prd:opacity-100"
                />
              </div>
              <div className="flex flex-1 flex-col gap-y-6 pt-10 pb-2">
                <dl className="flex flex-wrap">
                  <div className="flex w-full flex-none justify-between gap-x-6">
                    <dt>
                      <h3 className="font-display text-2xl font-semibold text-gray-900">
                        <span className="text-3xl font-light">/</span>
                        <span>{project.name}</span>
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href={project.href}
                          className="absolute inset-0 z-10"
                          aria-label="Visit site"
                        />
                      </h3>
                      <p className="mt-1 text-sm/6 font-normal text-gray-500">
                        {project.shortDescription}
                      </p>
                    </dt>
                    {project.isNew && (
                      <div className="flex-none">
                        <dt className="sr-only">type</dt>
                        <dd className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                          New
                        </dd>
                      </div>
                    )}
                  </div>

                  {project?.features?.map((feature, index) => (
                    <div
                      className={clsx(
                        'flex w-full flex-none gap-x-4',
                        index === 0
                          ? 'mt-6 border-t border-gray-900/5 pt-6'
                          : 'mt-4',
                      )}
                      key={feature.name}
                    >
                      <dt className="flex-none">
                        <span className="sr-only">{feature.name}</span>
                        <feature.icon
                          aria-hidden="true"
                          className="size-8 text-gray-400"
                        />
                      </dt>
                      <dd className="self-center text-base/none font-medium text-gray-900">
                        {feature.name}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-auto flex items-end justify-between gap-x-2 border-t border-gray-900/5 px-0 py-6 text-base/6 font-medium text-gray-900 hover:text-gray-700">
                  <p className="relative before:absolute before:top-full before:left-0 before:mt-1.5 before:block before:h-1 before:w-20 before:rounded-full before:bg-yellow-200/90">
                    Visit site
                  </p>
                  <ArrowUpRightIcon className="size-6" />
                </div>
              </div>
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </div>
  )
}
