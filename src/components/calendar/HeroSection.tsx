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
  name: string
  skyTop: string
  skyBottom: string
  layerOne: string
  layerTwo: string
  layerThree: string
  accent: string
  detail: string
  celestial: string
  foreground: string
  detailLayer: string
}

const monthThemes: MonthTheme[] = [
  { name: 'Snow Ridge', skyTop: '#DDEAF7', skyBottom: '#F6FBFF', layerOne: '#365A7C', layerTwo: '#5E7D99', layerThree: '#D8E3EE', accent: '#E85D3F', detail: '#11253E', celestial: '<circle cx="1280" cy="160" r="54" fill="#FFF7D6"/><g opacity="0.85"><circle cx="1175" cy="120" r="4" fill="white"/><circle cx="1238" cy="82" r="3" fill="white"/><circle cx="1338" cy="92" r="3" fill="white"/></g>', foreground: '<path d="M0 690L160 620L255 690L420 560L560 690H0Z" fill="#3A5574"/><path d="M1110 678L1280 530L1418 658L1600 590V900H1110V678Z" fill="#506E8C"/>', detailLayer: '<path d="M820 290L892 170L952 298L902 330L820 290Z" fill="#263A57"/><path d="M866 246L772 360" stroke="#263A57" stroke-width="11" stroke-linecap="round"/>' },
  { name: 'Winter Lake', skyTop: '#E3ECF7', skyBottom: '#FBFDFF', layerOne: '#405D7A', layerTwo: '#7592AC', layerThree: '#E2EAF2', accent: '#DA6B48', detail: '#1B314C', celestial: '<circle cx="1260" cy="150" r="44" fill="#FFF8E3"/><path d="M1020 610H1600V690C1480 714 1340 724 1204 718C1110 713 1060 700 1020 688V610Z" fill="#D8E8F1" opacity="0.7"/>', foreground: '<path d="M0 710L180 646L332 710L520 586L692 710H0Z" fill="#4D6C87"/><path d="M1160 654L1334 550L1458 632L1600 590V900H1160V654Z" fill="#6584A0"/>', detailLayer: '<path d="M770 334L850 258L910 350L862 378L770 334Z" fill="#28415D"/><path d="M838 286L760 392" stroke="#28415D" stroke-width="10" stroke-linecap="round"/>' },
  { name: 'Spring Meadow', skyTop: '#E2F1EB', skyBottom: '#FCFFFD', layerOne: '#3F6D5C', layerTwo: '#79A98F', layerThree: '#DCEDE4', accent: '#F07B56', detail: '#1E4237', celestial: '<circle cx="1240" cy="154" r="46" fill="#FFF4C9"/><g opacity="0.9"><circle cx="250" cy="120" r="18" fill="#F8D3DF"/><circle cx="282" cy="108" r="14" fill="#F7CBD8"/><circle cx="266" cy="144" r="16" fill="#F5C2D2"/></g>', foreground: '<path d="M0 724L220 660L420 724L610 620L770 724H0Z" fill="#5E8A72"/><path d="M1120 694L1260 610L1410 690L1600 640V900H1120V694Z" fill="#8BB096"/><rect x="220" y="154" width="10" height="120" fill="#705947"/>', detailLayer: '<path d="M840 360C840 321 871 290 910 290C949 290 980 321 980 360C980 399 949 430 910 430C871 430 840 399 840 360Z" fill="#F07B56"/><path d="M910 430V514" stroke="#315844" stroke-width="12" stroke-linecap="round"/><path d="M880 470C880 450 900 440 918 448" stroke="#315844" stroke-width="8" stroke-linecap="round"/><path d="M940 462C930 444 952 438 967 446" stroke="#315844" stroke-width="8" stroke-linecap="round"/>' },
  { name: 'April Bloom', skyTop: '#E9F5F0', skyBottom: '#FFFFFF', layerOne: '#497565', layerTwo: '#86B29B', layerThree: '#E5F1EA', accent: '#F48A62', detail: '#25453D', celestial: '<g opacity="0.9"><circle cx="1248" cy="142" r="42" fill="#FFF3D8"/><circle cx="300" cy="126" r="14" fill="#F9D6DE"/><circle cx="328" cy="114" r="12" fill="#F9D6DE"/><circle cx="342" cy="144" r="13" fill="#F6C8D3"/><circle cx="314" cy="152" r="10" fill="#F4BFCB"/></g>', foreground: '<path d="M0 726L240 648L456 726L676 602L840 726H0Z" fill="#648E78"/><path d="M1100 706L1288 592L1468 706L1600 660V900H1100V706Z" fill="#99BBA6"/><rect x="314" y="150" width="10" height="132" fill="#795D49"/>', detailLayer: '<path d="M820 378L898 300L954 360L902 404L820 378Z" fill="#35564A"/><path d="M870 330L818 398" stroke="#35564A" stroke-width="10" stroke-linecap="round"/><path d="M748 538C760 500 824 492 844 530C822 553 786 560 748 538Z" fill="#72A687"/>' },
  { name: 'May Hills', skyTop: '#EFF6E5', skyBottom: '#FFFFFF', layerOne: '#5A7641', layerTwo: '#8EAE69', layerThree: '#E8F0DD', accent: '#F59C54', detail: '#304521', celestial: '<circle cx="1265" cy="148" r="48" fill="#FFF1BF"/><g opacity="0.9"><circle cx="260" cy="120" r="5" fill="white"/><circle cx="300" cy="138" r="6" fill="white"/><circle cx="338" cy="118" r="5" fill="white"/></g>', foreground: '<path d="M0 734L220 680L422 734L642 620L840 734H0Z" fill="#708E53"/><path d="M1120 716L1308 610L1482 710L1600 668V900H1120V716Z" fill="#9DB97B"/>', detailLayer: '<path d="M818 362L922 286L986 350L884 418L818 362Z" fill="#445C30"/><path d="M700 540C734 500 794 494 842 524C806 560 752 568 700 540Z" fill="#8DAE69"/>' },
  { name: 'June Dunes', skyTop: '#FFF0D9', skyBottom: '#FFFDF8', layerOne: '#8B6D3F', layerTwo: '#D0AA63', layerThree: '#F6E6C2', accent: '#F1773D', detail: '#4A3518', celestial: '<circle cx="1275" cy="154" r="54" fill="#FFD27A"/><path d="M1040 250C1080 220 1140 220 1188 248" stroke="#E8C78A" stroke-width="8" stroke-linecap="round"/>', foreground: '<path d="M0 740L196 700L422 740L680 640L912 740H0Z" fill="#BE9654"/><path d="M1040 748L1268 646L1490 732L1600 702V900H1040V748Z" fill="#E0BD7D"/>', detailLayer: '<path d="M820 360L920 286L978 348L876 420L820 360Z" fill="#6A4A23"/><path d="M750 542C800 500 876 506 934 548C874 580 798 576 750 542Z" fill="#E6C687"/>' },
  { name: 'July Coast', skyTop: '#FDE3B9', skyBottom: '#FFF9EE', layerOne: '#A86A32', layerTwo: '#E49A4C', layerThree: '#F9E0B4', accent: '#EF5B2B', detail: '#5A2F14', celestial: '<circle cx="1270" cy="152" r="56" fill="#FFC85F"/><path d="M1030 602H1600V712C1512 726 1440 734 1354 736C1230 738 1138 722 1030 694V602Z" fill="#7FC4D8" opacity="0.9"/>', foreground: '<path d="M0 728L188 676L404 728L634 618L838 728H0Z" fill="#C47E3C"/><path d="M1160 716L1362 614L1490 686L1600 652V900H1160V716Z" fill="#E7A555"/>', detailLayer: '<path d="M836 360L918 294L970 356L888 416L836 360Z" fill="#71401A"/><path d="M688 548C726 512 778 506 834 536C800 566 748 572 688 548Z" fill="#8ED0DB"/><path d="M720 566C778 542 832 546 884 578" stroke="#5A2F14" stroke-width="7" stroke-linecap="round"/>' },
  { name: 'August Sunset', skyTop: '#FCE0C9', skyBottom: '#FFF7F1', layerOne: '#98634B', layerTwo: '#D7936E', layerThree: '#F7D9C8', accent: '#E9653D', detail: '#5A2B1A', celestial: '<circle cx="1262" cy="166" r="48" fill="#FF9E62"/><path d="M0 580H1600V650C1484 668 1380 676 1260 676C1080 676 888 650 740 610C552 560 346 562 0 640V580Z" fill="#E9BAA7" opacity="0.65"/>', foreground: '<path d="M0 734L202 678L410 734L620 618L822 734H0Z" fill="#B2775A"/><path d="M1100 720L1302 612L1496 714L1600 674V900H1100V720Z" fill="#DF9D7A"/>', detailLayer: '<path d="M834 364L920 294L980 356L892 426L834 364Z" fill="#6E3923"/><path d="M724 548C768 510 824 508 882 538C838 570 782 576 724 548Z" fill="#E6A07A"/>' },
  { name: 'September Fields', skyTop: '#F9E2BF', skyBottom: '#FFF9F1', layerOne: '#8D5D31', layerTwo: '#C98A4B', layerThree: '#F5DEBA', accent: '#DD6238', detail: '#523016', celestial: '<circle cx="1272" cy="152" r="50" fill="#FFD487"/><path d="M1040 600H1600V658L1470 676L1336 682L1208 676L1106 662L1040 646V600Z" fill="#E9C784" opacity="0.72"/>', foreground: '<path d="M0 740L190 688L420 740L640 640L850 740H0Z" fill="#B77A3E"/><path d="M1100 724L1280 630L1494 722L1600 688V900H1100V724Z" fill="#D99A58"/><rect x="1180" y="558" width="14" height="112" fill="#6A4720"/><ellipse cx="1187" cy="548" rx="40" ry="26" fill="#C97D4A"/>', detailLayer: '<path d="M826 362L914 296L972 354L886 422L826 362Z" fill="#673C1A"/><path d="M700 546C750 508 830 508 886 542C832 574 752 578 700 546Z" fill="#E2C06F"/>' },
  { name: 'October Orchard', skyTop: '#E8D8C8', skyBottom: '#FFF8F5', layerOne: '#6D4E43', layerTwo: '#A57865', layerThree: '#ECDACF', accent: '#D55F3A', detail: '#43271F', celestial: '<circle cx="1268" cy="156" r="46" fill="#F8C271"/><rect x="244" y="188" width="12" height="118" fill="#6A4A38"/><circle cx="234" cy="202" r="18" fill="#D55F3A"/><circle cx="264" cy="196" r="16" fill="#D06D48"/><circle cx="252" cy="224" r="18" fill="#C84C35"/>', foreground: '<path d="M0 738L196 686L402 738L618 632L832 738H0Z" fill="#865E4D"/><path d="M1130 720L1300 624L1486 714L1600 678V900H1130V720Z" fill="#B88A74"/>', detailLayer: '<path d="M838 364L922 298L978 352L894 422L838 364Z" fill="#5D352A"/><path d="M714 548C760 510 816 506 872 536C832 568 774 578 714 548Z" fill="#D78A58"/>' },
  { name: 'November Twilight', skyTop: '#DCE6F4', skyBottom: '#FBFDFF', layerOne: '#415B79', layerTwo: '#7289A6', layerThree: '#DEE7F0', accent: '#D06B42', detail: '#1D2F45', celestial: '<circle cx="1274" cy="154" r="42" fill="#FFE4AF"/><g opacity="0.55"><path d="M0 0H1600V150C1420 178 1180 198 942 180C690 160 438 102 0 146V0Z" fill="#F3F1EC"/></g>', foreground: '<path d="M0 730L180 670L394 730L608 618L822 730H0Z" fill="#5A748F"/><path d="M1120 710L1296 612L1490 706L1600 672V900H1120V710Z" fill="#879CB7"/><rect x="248" y="234" width="10" height="108" fill="#61483E"/><circle cx="252" cy="230" r="34" fill="#D1875E" opacity="0.85"/>', detailLayer: '<path d="M836 364L920 294L980 356L892 428L836 364Z" fill="#2B425C"/><path d="M714 548C760 508 824 510 884 544C832 570 770 576 714 548Z" fill="#A6B7C8"/>' },
  { name: 'December Peak', skyTop: '#D8E6F5', skyBottom: '#FFFFFF', layerOne: '#35516F', layerTwo: '#6987A2', layerThree: '#E3EBF4', accent: '#C94F43', detail: '#1A2C42', celestial: '<circle cx="1260" cy="146" r="48" fill="#FFF3D3"/><g opacity="0.85"><circle cx="1162" cy="112" r="3" fill="white"/><circle cx="1218" cy="88" r="4" fill="white"/><circle cx="1328" cy="102" r="3" fill="white"/></g>', foreground: '<path d="M0 692L172 620L252 692L432 558L570 692H0Z" fill="#3B5C7E"/><path d="M1132 690L1290 542L1418 678L1600 602V900H1132V690Z" fill="#5E80A1"/>', detailLayer: '<path d="M824 282L892 166L948 290L900 320L824 282Z" fill="#263A57"/><path d="M868 238L780 350" stroke="#263A57" stroke-width="11" stroke-linecap="round"/><path d="M740 540C782 502 838 502 886 536C846 566 790 574 740 540Z" fill="#E1EBF4"/>' },
]

function getMonthArtwork(month: number) {
  const theme = monthThemes[month]

  const svg = `
    <svg width="1600" height="900" viewBox="0 0 1600 900" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="1600" height="900" fill="${theme.skyBottom}"/>
      <rect width="1600" height="900" fill="url(#sky)"/>
      ${theme.celestial}
      <path d="M0 655L220 510L410 620L625 408L920 620L1198 370L1455 562L1600 475V900H0V655Z" fill="${theme.layerOne}"/>
      <path d="M0 720L215 630L470 742L725 518L1008 716L1298 544L1600 650V900H0V720Z" fill="${theme.layerTwo}"/>
      <path d="M160 724L790 430L1065 535L1325 332L1495 447L1495 900H160V724Z" fill="${theme.layerThree}"/>
      ${theme.foreground}
      ${theme.detailLayer}
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
  const theme = monthThemes[month]
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
      className="overflow-hidden rounded-t-[1.6rem] border border-b-0 border-[#cdbca3] bg-[#f8f0e4]"
    >
      <div className="spiral-binding h-7 border-b border-[#d2c2ab] bg-[linear-gradient(180deg,#f5eee4_0%,#e7dccd_100%)]" />

      <div className="relative">
        <div className="relative h-[220px] overflow-hidden md:h-[280px] lg:h-[320px]">
          <Image
            src={imageSrc}
            alt={`${months[month]} hero`}
            fill
            unoptimized
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#1f2430]/12 via-transparent to-white/18" />
          <div className="absolute inset-x-6 top-5 h-px bg-white/45" />
          <div className="absolute bottom-0 left-0 right-0 h-22 bg-[linear-gradient(180deg,transparent_0%,transparent_35%,#f8f0e4_35%,#f8f0e4_100%)] md:h-24" />
          <div className="absolute bottom-0 left-0 h-22 w-28 bg-[linear-gradient(38deg,transparent_0%,transparent_48%,var(--accent)_49%,var(--accent)_100%)] md:h-24 md:w-40" />
          <div className="absolute bottom-0 right-0 flex h-28 w-[14.5rem] flex-col justify-end rounded-tl-[2.4rem] border border-white/20 bg-[linear-gradient(180deg,var(--accent)_0%,var(--accent-deep)_100%)] px-5 pb-4 text-right text-white shadow-[0_0.8rem_1.8rem_rgba(16,120,189,0.22)] backdrop-blur-sm md:h-30 md:w-[17.5rem] md:px-6 md:pb-5">
            <p className="text-[10px] uppercase tracking-[0.34em] text-white/80 md:text-xs">{theme.name}</p>
            <p className="mt-1 text-sm tracking-[0.3em] opacity-85 md:text-base">{currentDate.getFullYear()}</p>
            <p className="font-display text-[1.7rem] leading-none font-semibold uppercase tracking-[0.08em] md:text-[2.35rem]">
              {months[month]}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#d6c6ae] bg-[#f8f0e4] px-4 py-3 md:px-6">
          <div className="hidden md:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#7a8592]">
              Featured artwork
            </p>
            <p className="mt-1 text-sm text-[#43515f]">
              {theme.name}
            </p>
          </div>

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
              <span className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-[#263243] bg-[#1b2432] px-4 text-sm font-medium text-[#f7f1e8] shadow-[0_0.35rem_0.8rem_rgba(27,36,50,0.16)] transition-colors hover:bg-[#141c28]">
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
