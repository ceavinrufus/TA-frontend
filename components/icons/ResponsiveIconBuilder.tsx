import React from "react";
import IconAdd from "./IconAdd";
import IconAddCircle from "./IconAddCircle";
import IconAlertCircle from "./IconAlertCircle";
import IconArrowDown from "./IconArrowDown";
import IconArrowForward from "./IconArrowForward";
import IconCheck from "./IconCheck";
import IconCheckCircle from "./IconCheckCircle";
import IconGift from "./IconGift";
import IconMap from "./IconMap";
import IconMenu from "./IconMenu";
import IconMinus from "./IconMinus";
import IconMinusCircle from "./IconMinusCircle";
import IconSearch from "./IconSearch";
import IconBed from "./IconBed";
import IconLocation from "./IconLocation";
import IconPerson from "./IconPerson";
import IconCalendar from "./IconCalendar";
import IconSort from "./IconSort";
import IconCar from "./IconCar";
import IconArrowBack from "./IconArrowBack";
import IconCopy from "./IconCopy";
import IconNoMeals from "./IconNoMeals";
import IconFastFood from "./IconFastFood";
import IconClose from "./IconClose";
import IconWiFi from "./IconWiFi";
import IconRepeat from "./IconRepeat";
import IconNoRepeat from "./IconNoRepeat";
import IconMeal from "./IconMeal";
import IconPet from "./IconPets";
import IconHeating from "./IconHeating";
import IconTV from "./IconTV";
import IconSnow from "./IconSnow";
import IconAccessibility from "./IconAccessibility";
import IconGaming from "./IconGaming";
import IconRoomService from "./IconRoomService";
import IconHealthAndSafety from "./IconHealthAndSafety";
import IconChildCarriage from "./IconChildCot";
import IconHome from "./IconHome";
import IconGlobe from "./IconGlobe";
import IconFlower from "./IconFlower";
import IconBusiness from "./IconBusiness";
import IconCheckIn from "./IconCheckIn";
import IconCheckout from "./IconCheckout";
import IconMail from "./IconMail";
import IconParking from "./IconParking";
import IconInfoCircle from "./IconInfoCircle";
import IconClock from "./IconClock";
import IconDownload from "./IconDownload";
import IconBan from "./IconBan";
import IconPhone from "./IconPhone";
import IconCoffee from "./IconMiniBar";
import IconCard from "./IconCard";
import IconChevronRight from "./IconChevronRight";
import { BathIcon } from "lucide-react";
import IconIronBox from "./IconIronBox";
import IconMirror from "./IconMirror";
import IconBathRobe from "./IconBathrobe";
import IconMailUnread from "./IconMailUnread";
import IconBinoculars from "./IconBinoculars";
import IconMedal from "./IconMedal";
import IconChevronLeft from "./IconChevronLeft";
import IconLock from "./IconLock";
import IconPhoto from "./IconPhoto";
import IconTrash from "./IconTrash";
import IconFilter from "./IconFilter";
import IconList from "./IconList";
import IconOptions from "./IconOptions";
import IconRoom from "./IconRoom";
import IconPeople from "./IconPeople";
import IconBus from "./IconBus";
import IconPool from "./IconPool";
import IconEnter from "./IconEnter";
import IconExit from "./IconExit";
import IconLoading from "./IconLoading";
import { cn } from "@/lib/utils";
import IconNoElderly from "./IconNoElderly";
import IconNoPet from "./IconNoPet";
import IconNoParty from "./IconNoParty";
import IconNoSmoking from "./IconNoSmoking";
import IconNoBaby from "./IconNoBaby";
import IconBaby from "./IconBaby";
import IconParty from "./IconParty";
import IconElderly from "./IconElderly";
import IconSmoking from "./IconSmoking";
import IconWarning from "./IconWarning";
import IconFlash from "./IconFlash";
import IconBeta from "./IconBeta";
import IconEdit from "./IconEdit";
import IconCloudUpload from "./IconCloudUpload";

/**
 * Union type defining all available predefined icon options.
 * When adding new icons:
 * 1. Add the icon name here
 * 2. Add the corresponding import above
 * 3. Add the icon component to iconMap below
 */
export type IconType =
  | "icon-search"
  | "icon-arrow-down"
  | "icon-map"
  | "icon-check"
  | "icon-gift"
  | "icon-arrow-forward"
  | "icon-check-circle"
  | "icon-add"
  | "icon-add-circle"
  | "icon-minus"
  | "icon-alert-circle"
  | "icon-warning"
  | "icon-menu"
  | "icon-bed"
  | "icon-location"
  | "icon-person"
  | "icon-people"
  | "icon-car"
  | "icon-calendar"
  | "icon-sort"
  | "icon-filter"
  | "icon-arrow-back"
  | "icon-copy"
  | "icon-fast-food"
  | "icon-no-meals"
  | "icon-no-pet"
  | "icon-party"
  | "icon-no-party"
  | "icon-smoking"
  | "icon-no-smoking"
  | "icon-baby"
  | "icon-no-baby"
  | "icon-elderly"
  | "icon-no-elderly"
  | "icon-close"
  | "icon-wifi"
  | "icon-meal"
  | "icon-heating"
  | "icon-repeat"
  | "icon-no-repeat"
  | "icon-pet"
  | "icon-tv"
  | "icon-trash"
  | "icon-snow"
  | "icon-accessibility"
  | "icon-gaming"
  | "icon-room"
  | "icon-room-service"
  | "icon-health-and-safety"
  | "icon-child-carriage"
  | "icon-home"
  | "icon-globe"
  | "icon-flower"
  | "icon-bus"
  | "icon-business"
  | "icon-checkin"
  | "icon-checkout"
  | "icon-mail"
  | "icon-info-circle"
  | "icon-medal"
  | "icon-parking"
  | "icon-clock"
  | "icon-ban"
  | "icon-bath-robe"
  | "icon-download"
  | "icon-loading"
  | "icon-binoculars"
  | "icon-phone"
  | "icon-photo"
  | "icon-sun"
  | "icon-child"
  | "icon-mail-unread"
  | "icon-coffee"
  | "icon-chevron-left"
  | "icon-card"
  | "icon-mirror"
  | "icon-iron-box"
  | "icon-bathroom"
  | "icon-chevron-right"
  | "icon-minus-circle"
  | "icon-lock"
  | "icon-list"
  | "icon-options"
  | "icon-pool"
  | "icon-enter"
  | "icon-exit"
  | "icon-flash"
  | "icon-beta"
  | "icon-edit"
  | "icon-cloud-upload";

/**
 * Mapping of icon types to their corresponding React components.
 * Each predefined icon component receives 'color' and 'size' props automatically.
 */
const iconMap: Record<IconType, React.ReactNode> = {
  "icon-cloud-upload": <IconCloudUpload />,
  "icon-beta": <IconBeta />,
  "icon-flash": <IconFlash />,
  "icon-pool": <IconPool />,
  "icon-copy": <IconCopy />,
  "icon-no-meals": <IconNoMeals />,
  "icon-no-pet": <IconNoPet />,
  "icon-party": <IconParty />,
  "icon-no-party": <IconNoParty />,
  "icon-smoking": <IconSmoking />,
  "icon-no-smoking": <IconNoSmoking />,
  "icon-baby": <IconBaby />,
  "icon-no-baby": <IconNoBaby />,
  "icon-elderly": <IconElderly />,
  "icon-no-elderly": <IconNoElderly />,
  "icon-fast-food": <IconFastFood />,
  "icon-search": <IconSearch />,
  "icon-arrow-down": <IconArrowDown />,
  "icon-arrow-back": <IconArrowBack />,
  "icon-check": <IconCheck />,
  "icon-map": <IconMap />,
  "icon-add-circle": <IconAddCircle />,
  "icon-mirror": <IconMirror />,
  "icon-bathroom": <BathIcon />,
  "icon-add": <IconAdd />,
  "icon-minus": <IconMinus />,
  "icon-minus-circle": <IconMinusCircle />,
  "icon-check-circle": <IconCheckCircle />,
  "icon-menu": <IconMenu />,
  "icon-gift": <IconGift />,
  "icon-arrow-forward": <IconArrowForward />,
  "icon-alert-circle": <IconAlertCircle />,
  "icon-bed": <IconBed />,
  "icon-location": <IconLocation />,
  "icon-person": <IconPerson />,
  "icon-people": <IconPeople />,
  "icon-calendar": <IconCalendar />,
  "icon-sort": <IconSort />,
  "icon-filter": <IconFilter />,
  "icon-car": <IconCar />,
  "icon-close": <IconClose />,
  "icon-wifi": <IconWiFi />,
  "icon-chevron-left": <IconChevronLeft />,
  "icon-repeat": <IconRepeat />,
  "icon-iron-box": <IconIronBox />,
  "icon-no-repeat": <IconNoRepeat />,
  "icon-mail-unread": <IconMailUnread />,
  "icon-meal": <IconMeal />,
  "icon-pet": <IconPet />,
  "icon-heating": <IconHeating />,
  "icon-tv": <IconTV />,
  "icon-trash": <IconTrash />,
  "icon-accessibility": <IconAccessibility />,
  "icon-gaming": <IconGaming />,
  "icon-snow": <IconSnow />,
  "icon-room": <IconRoom />,
  "icon-room-service": <IconRoomService />,
  "icon-health-and-safety": <IconHealthAndSafety />,
  "icon-child-carriage": <IconChildCarriage />,
  "icon-home": <IconHome />,
  "icon-flower": <IconFlower />,
  "icon-globe": <IconGlobe />,
  "icon-bus": <IconBus />,
  "icon-business": <IconBusiness />,
  "icon-checkin": <IconCheckIn />,
  "icon-checkout": <IconCheckout />,
  "icon-mail": <IconMail />,
  "icon-parking": <IconParking />,
  "icon-info-circle": <IconInfoCircle />,
  "icon-download": <IconDownload />,
  "icon-loading": <IconLoading />,
  "icon-ban": <IconBan />,
  "icon-clock": <IconClock />,
  "icon-medal": <IconMedal />,
  "icon-phone": <IconPhone />,
  "icon-photo": <IconPhoto />,
  "icon-sun": <IconHeating />,
  "icon-coffee": <IconCoffee />,
  "icon-card": <IconCard />,
  "icon-child": <IconChildCarriage />,
  "icon-chevron-right": <IconChevronRight />,
  "icon-bath-robe": <IconBathRobe />,
  "icon-binoculars": <IconBinoculars />,
  "icon-lock": <IconLock />,
  "icon-warning": <IconWarning />,
  "icon-list": <IconList />,
  "icon-options": <IconOptions />,
  "icon-enter": <IconEnter />,
  "icon-exit": <IconExit />,
  "icon-edit": <IconEdit />,
};

interface Props {
  icon: IconType;
  color?: string;
  sizeMobile?: number;
  sizeDesktop?: number;
  className?: string;
}

const ResponsiveIcon = ({
  icon,
  sizeDesktop,
  sizeMobile,
  color,
  className,
}: Props) => (
  <>
    <div className={cn(`hidden md:block`, className)}>
      {React.cloneElement(iconMap[icon] as React.ReactElement, {
        color,
        size: sizeDesktop,
      })}
    </div>
    <div className={cn(`inline-block md:hidden`, className)}>
      {React.cloneElement(iconMap[icon] as React.ReactElement, {
        color,
        size: sizeMobile,
      })}
    </div>
  </>
);

export default ResponsiveIcon;
