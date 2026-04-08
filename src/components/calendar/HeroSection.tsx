'use client'

import { ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import { ImagePlus } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { months } from '@/lib/utils'

interface HeroSectionProps {
  currentDate: Date
  customImage: string | null
  onImageChange: (image: string | null) => void
}

type MonthTheme = {
  skyTop: string
  skyBottom: string
  layerOne: string
  layerTwo: string
  layerThree: string
  accent: string
  detail: string
}

const monthThemes: MonthTheme[] = [
  { skyTop: '#DDEAF7', skyBottom: '#F6FBFF', layerOne: '#365A7C', layerTwo: '#5E7D99', layerThree: '#D8E3EE', accent: '#E85D3F', detail: '#11253E' },
  { skyTop: '#E3ECF7', skyBottom: '#FBFDFF', layerOne: '#405D7A', layerTwo: '#7592AC', layerThree: '#E2EAF2', accent: '#DA6B48', detail: '#1B314C' },
  { skyTop: '#E2F1EB', skyBottom: '#FCFFFD', layerOne: '#3F6D5C', layerTwo: '#79A98F', layerThree: '#DCEDE4', accent: '#F07B56', detail: '#1E4237' },
  { skyTop: '#E9F5F0', skyBottom: '#FFFFFF', layerOne: '#497565', layerTwo: '#86B29B', layerThree: '#E5F1EA', accent: '#F48A62', detail: '#25453D' },
  { skyTop: '#EFF6E5', skyBottom: '#FFFFFF', layerOne: '#5A7641', layerTwo: '#8EAE69', layerThree: '#E8F0DD', accent: '#F59C54', detail: '#304521' },
  { skyTop: '#FFF0D9', skyBottom: '#FFFDF8', layerOne: '#8B6D3F', layerTwo: '#D0AA63', layerThree: '#F6E6C2', accent: '#F1773D', detail: '#4A3518' },
  { skyTop: '#FDE3B9', skyBottom: '#FFF9EE', layerOne: '#A86A32', layerTwo: '#E49A4C', layerThree: '#F9E0B4', accent: '#EF5B2B', detail: '#5A2F14' },
  { skyTop: '#FCE0C9', skyBottom: '#FFF7F1', layerOne: '#98634B', layerTwo: '#D7936E', layerThree: '#F7D9C8', accent: '#E9653D', detail: '#5A2B1A' },
  { skyTop: '#F9E2BF', skyBottom: '#FFF9F1', layerOne: '#8D5D31', layerTwo: '#C98A4B', layerThree: '#F5DEBA', accent: '#DD6238', detail: '#523016' },
  { skyTop: '#E8D8C8', skyBottom: '#FFF8F5', layerOne: '#6D4E43', layerTwo: '#A57865', layerThree: '#ECDACF', accent: '#D55F3A', detail: '#43271F' },
  { skyTop: '#DCE6F4', skyBottom: '#FBFDFF', layerOne: '#415B79', layerTwo: '#7289A6', layerThree: '#DEE7F0', accent: '#D06B42', detail: '#1D2F45' },
  { skyTop: '#D8E6F5', skyBottom: '#FFFFFF', layerOne: '#35516F', layerTwo: '#6987A2', layerThree: '#E3EBF4', accent: '#C94F43', detail: '#1A2C42' },
]

function getMonthArtwork(month: number) {
  const theme = monthThemes[month]

  const svg = `
    <svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1600" height="900" fill="${theme.skyBottom}"/>
      <rect width="1600" height="900" fill="url(#sky)"/>
      <path d="M0 655L220 510L410 620L625 408L920 620L1198 370L1455 562L1600 475V900H0V655Z" fill="${theme.layerOne}"/>
      <path d="M0 720L215 630L470 742L725 518L1008 716L1298 544L1600 650V900H0V720Z" fill="${theme.layerTwo}"/>
      <path d="M160 724L790 430L1065 535L1325 332L1495 447L1495 900H160V724Z" fill="${theme.layerThree}"/>
      <path d="M708 315C741.689 315 769 287.689 769 254C769 220.311 741.689 193 708 193C674.311 193 647 220.311 647 254C647 287.689 674.311 315 708 315Z" fill="${theme.accent}"/>
      <path d="M694 305L744 419L694 453L652 390L694 305Z" fill="${theme.detail}"/>
      <path d="M667 460L730 425L756 478L693 513L667 460Z" fill="${theme.detail}"/>
      <path d="M751 223L809 154" stroke="${theme.detail}" stroke-width="11" stroke-linecap="round"/>
      <path d="M796 160L831 159" stroke="${theme.detail}" stroke-width="8" stroke-linecap="round"/>
      <path d="M691 351L625 434" stroke="${theme.detail}" stroke-width="11" stroke-linecap="round"/>
      <path d="M625 434L588 480" stroke="${theme.detail}" stroke-width="7" stroke-linecap="round"/>
      <defs>
        <linearGradient id="sky" x1="800" y1="0" x2="800" y2="900" gradientUnits="userSpaceOnUse">
          <stop stop-color="${theme.skyTop}"/>
          <stop offset="1" stop-color="${theme.skyBottom}"/>
        </linearGradient>
      </defs>
    </svg>
  `

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export default function HeroSection({ currentDate, customImage, onImageChange }: HeroSectionProps) {
  const month = currentDate.getMonth()
  const imageSrc = customImage || getMonthArtwork(month)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageChange(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-t-[1.6rem] border border-b-0 border-[#e6ddd0] bg-[#fffdfa]"
    >
      <div className="spiral-binding h-7 border-b border-[#ddd4c8] bg-[linear-gradient(180deg,#f4ede3_0%,#e6ddd1_100%)]" />

      <div className="relative">
        <div className="relative h-[220px] overflow-hidden md:h-[280px] lg:h-[320px]">
          <Image
            src={imageSrc}
            alt={`${months[month]} hero`}
            fill
            unoptimized
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-white/14" />
          <div className="absolute bottom-0 left-0 right-0 h-22 bg-[linear-gradient(180deg,transparent_0%,transparent_35%,white_35%,white_100%)] md:h-24" />
          <div className="absolute bottom-0 left-0 h-22 w-28 bg-[linear-gradient(38deg,transparent_0%,transparent_48%,var(--accent)_49%,var(--accent)_100%)] md:h-24 md:w-40" />
          <div className="absolute bottom-0 right-0 flex h-26 w-[13.5rem] flex-col justify-end rounded-tl-[2.2rem] bg-[linear-gradient(180deg,var(--accent)_0%,var(--accent-deep)_100%)] px-4 pb-4 text-right text-white md:h-28 md:w-[16.5rem] md:px-5 md:pb-5">
            <p className="text-sm tracking-[0.3em] opacity-85 md:text-base">{currentDate.getFullYear()}</p>
            <p className="font-display text-[1.7rem] leading-none font-semibold uppercase tracking-[0.08em] md:text-[2.35rem]">
              {months[month]}
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#e7dfd3] bg-[#fffdfa] px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            {customImage ? (
              <Button variant="outline" onClick={() => onImageChange(null)}>
                Use default photo
              </Button>
            ) : null}

            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800">
                <ImagePlus className="h-4 w-4" />
                Swap image
              </span>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
