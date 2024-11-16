import { RiSwordFill } from "react-icons/ri";
import { BsShieldFillPlus } from "react-icons/bs";
import { BsLightningFill } from "react-icons/bs";
import { TbPointerFilled } from "react-icons/tb";
import { ImExit } from "react-icons/im";
import { CSSProperties, FC } from "react";
import { HiArrowCircleUp } from "react-icons/hi";
import { FaHandFist } from "react-icons/fa6";

const IconsIndex = {
  exit: ImExit,
  attack: RiSwordFill,
  defense: BsShieldFillPlus,
  power: BsLightningFill,
  pointer: TbPointerFilled,
  join: HiArrowCircleUp,
  pledge: FaHandFist,
};


const Index = {
  ...IconsIndex,
}

export type IconName = keyof typeof Index | "none";

type Props = {
  icon: IconName
  className?: string
  style?: CSSProperties
  onClick?: () => void;
}

export const Icon: FC<Props> = ({ icon, className, style, onClick }) => {
  if (icon == "none") {
    return null;
  }

  const Icon = Index[icon];
  return (
    <Icon className={className} style={style} onClick={onClick} />
  )
}