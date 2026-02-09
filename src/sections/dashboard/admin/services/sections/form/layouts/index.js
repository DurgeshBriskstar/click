import LayoutOne from "./layout-one";
import LayoutTwo from "./layout-two";
import LayoutThree from "./layout-three";
import layoutOneSample from "/public/backend-assets/services/service-layout1.png";
import layoutTwoSample from "/public/backend-assets/services/service-layout2.png";
import layoutThreeSample from "/public/backend-assets/services/service-layout3.png";

export const LAYOUT_OPTIONS = [
    {
        key: "layoutOne",
        code: "LAYOUT_1",
        label: "Full Width Layout",
        sample: layoutOneSample?.src || "",
    },
    {
        key: "layoutTwo",
        code: "LAYOUT_2",
        label: "Split Content Layout",
        sample: layoutTwoSample?.src || "",
    },
    {
        key: "layoutThree",
        code: "LAYOUT_3",
        label: "Card Based Layout",
        sample: layoutThreeSample?.src || "",
    },
];

export const LAYOUT_COMPONENTS = {
    layoutOne: LayoutOne,
    layoutTwo: LayoutTwo,
    layoutThree: LayoutThree,
};

export const LAYOUT_KEY_TO_CODE = {
    layoutOne: "LAYOUT_1",
    layoutTwo: "LAYOUT_2",
    layoutThree: "LAYOUT_3",
};

export const LAYOUT_CODE_TO_KEY = {
    LAYOUT_1: "layoutOne",
    LAYOUT_2: "layoutTwo",
    LAYOUT_3: "layoutThree",
};

