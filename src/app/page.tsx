import { type Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ContactSection } from '@/components/ContactSection'
import { Container } from '@/components/Container'
import { FadeIn, FadeInStagger } from '@/components/FadeIn'
import { RootLayout } from '@/components/RootLayout'
import productImage from '@/images/meeting.jpg'
import { Border } from '@/components/Border'

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
    className={classNames(
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
    className={classNames(
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
        <stop offset=".24" stop-color="currentColor"></stop>
        <stop offset="1" stop-color="currentColor" stop-opacity="0"></stop>
      </linearGradient>
      <linearGradient
        id="next-icon-gradient-b"
        x1="20.5"
        y1="11.25"
        x2="20.5"
        y2="18.25"
        gradientUnits="userSpaceOnUse"
      >
        <stop stop-color="currentColor"></stop>
        <stop offset="1" stop-color="currentColor" stop-opacity="0"></stop>
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
      stroke-width="0"
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
      strokeWidth="0.75"
      strokeLinejoin="round"
    ></path>
    <path
      d="M18 12.0001H16.2C15.5373 12.0001 15 12.5374 15 13.2001V13.8001C15 14.4629 15.5373 15.0001 16.2 15.0001H16.8C17.4627 15.0001 18 15.5374 18 16.2001V16.8001C18 17.4629 17.4627 18.0001 16.8 18.0001H15"
      stroke="currentColor"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M8.5 12.0001H10.5M12.5 12.0001H10.5M10.5 12.0001V18.0001"
      stroke="currentColor"
      strokeWidth="0.75"
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
    strokeWidth={1}
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
      <Grid />
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
    image: productImage,
    imageAlt: 'Bitpan - Multi-purpose E-commerce Next.js template',
    description:
      'Bitpan is a modern and responsive Next.js template designed for multi-purpose e-commerce websites. It features a clean and user-friendly interface, making it easy for users to browse and purchase products online.',
    href: '#',
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
    shortDescription: 'Booking online Next.js template',
    price: '$29',
    rating: 5,
    reviewCount: 380,
    image: productImage,
    imageAlt: 'Chisfis - Booking online Next.js template',
    href: '#',
    isNew: true,
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
    image: productImage,
    imageAlt: 'Ciseco - E-commerce Next.js template',
    href: '#',
    isNew: true,
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
    image: productImage,
    imageAlt: 'Ncmaz - Blog, News and Magazine Next.js template',
    description:
      'Ncmaz is a modern and responsive Next.js template designed for blogs, news, and magazine websites. It features a clean and user-friendly interface, making it easy for users to read and share articles.',
    href: '#',
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
    id: 8,
    name: 'Ciscryp',
    shortDescription: 'NFT Marketplace NextJs React Template',
    price: '$29',
    rating: 5,
    reviewCount: 14,
    image: productImage,
    imageAlt: 'Ciscryp - NFT Marketplace NextJs React Template',
    description:
      'Ciscryp is a modern and responsive Next.js template designed for NFT marketplaces. It features a clean and user-friendly interface, making it easy for users to browse, buy, and sell NFTs online.',
    href: '#',
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
    id: 5,
    name: 'Ciseco Hydrogen',
    shortDescription: "Hydrogen Shopify's Headless Store theme",
    price: '$29',
    rating: 5,
    reviewCount: 14,
    image: productImage,
    imageAlt: "Ciseco - Hydrogen Shopify's Headless Store theme",
    description:
      "Ciseco Hydrogen is a modern and responsive Next.js template designed for Shopify's headless store. It features a clean and user-friendly interface, making it easy for users to browse and purchase products online.",
    href: '#',
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
    id: 6,
    name: 'Ncmaz Headless WP',
    shortDescription: 'Next.js Headless WordPress Blog Magazine template',
    price: '$29',
    rating: 5,
    reviewCount: 14,
    image: productImage,
    imageAlt: 'Ncmaz - NextJs Headless WordPress Blog Magazine template',
    description:
      'Ncmaz Headless WordPress is a modern and responsive Next.js template designed for headless WordPress blogs and magazines. It features a clean and user-friendly interface, making it easy for users to read and share articles.',
    href: '#',
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
    id: 7,
    name: 'Ncmaz WordPress FSE',
    shortDescription: 'Ncmaz WordPress Full Site Editing Block Theme',
    price: '$29',
    rating: 5,
    reviewCount: 14,
    image: productImage,
    imageAlt: 'Ncmaz - News Magazine Full Site Editing WordPress Block Theme',
    description:
      'Ncmaz WordPress FSE is a modern and responsive WordPress block theme designed for news and magazine websites. It features a clean and user-friendly interface, making it easy for users to read and share articles.',
    href: '#',
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
]

function classNames(...classes: (string | boolean | undefined)[]) {
  // Filter out falsy values and join the remaining classes with a space
  if (!classes.length) return ''
  return classes.filter(Boolean).join(' ')
}

function Grid() {
  return (
    <div className="mt-24 sm:mt-32 lg:mt-40">
      <Container>
        <FadeIn>
          <Border className="pt-16">
            <div className="max-w-3xl">
              <p className="block font-display text-base font-semibold text-neutral-950">
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
              className="group relative flex flex-col border-r border-b border-gray-200 p-4 sm:p-6"
            >
              <div className="relative aspect-square">
                <Image
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 33vw"
                  priority
                  alt={project.imageAlt}
                  src={project.image}
                  className="rounded-xs object-cover brightness-100 transition-[filter] duration-300 ease-in-out group-hover:brightness-75"
                />
              </div>
              <div className="flex flex-1 flex-col gap-y-6 pt-8 pb-2">
                <dl className="flex flex-wrap">
                  <div className="flex w-full flex-none justify-between gap-x-6">
                    <dt>
                      <h3 className="font-display text-2xl font-semibold text-gray-900">
                        <span className="text-3xl font-light">/</span>
                        <span>{project.name}</span>
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
                      className={classNames(
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
                  {/* <Link
                      target="_blank"
                      rel="noopener noreferrer"
                      href="#"
                      className="absolute inset-0"
                      aria-label="Visit site"
                    /> */}
                  <p className="relative before:absolute before:top-full before:left-0 before:mt-2 before:block before:h-1 before:w-20 before:rounded-full before:bg-yellow-100">
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
