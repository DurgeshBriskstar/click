import LazyImage from "components/LazyImage";

// STYLED COMPONENT
import { StyledRoot } from "./styles";


// ==============================================================


// ==============================================================

export default function StoryItem({
  image,
  handleClick
}) {
  return <StyledRoot onClick={handleClick}>
      <LazyImage src={image} alt="Story" width={164} height={300} />
    </StyledRoot>;
}