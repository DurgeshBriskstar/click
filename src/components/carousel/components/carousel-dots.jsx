
// STYLED COMPONENTS
import { Dot, DotList } from "../styles";


// ==============================================================


// ==============================================================

export default function CarouselDots({
  dotColor,
  sx
}) {
  return {
    appendDots: dots => <DotList sx={sx}>{dots}</DotList>,
    customPaging: () => <Dot dotColor={dotColor} />
  };
}