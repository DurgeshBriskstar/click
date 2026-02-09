"use client";

import MenuItem from "@mui/material/MenuItem";
import TouchRipple from "@mui/material/ButtonBase";

// MUI ICON COMPONENTS
import ExpandMore from "@mui/icons-material/ExpandMore";

// TRANSLATION
import { useTranslation } from "react-i18next";

// GLOBAL CUSTOM COMPONENTS
import ClickITCoMenu from "components/ClickITCoMenu";


// ==============================================================


// ==============================================================

export default function LanguageSelector({
  languages
}) {
  const {
    i18n
  } = useTranslation();
  const handleChangeLanguage = lang => {
    i18n.changeLanguage(lang);
  };
  const selectedLanguage = languages[i18n.language];
  return <ClickITCoMenu handler={e => <TouchRipple className="handler marginRight" onClick={e}>
    <span className="menuTitle">{selectedLanguage.title}</span>
    <ExpandMore fontSize="inherit" />
  </TouchRipple>} options={onClose => {
    return Object.keys(languages).map(lang => <MenuItem className="menuItem" key={languages[lang].title} onClick={() => {
      handleChangeLanguage(lang);
      onClose();
    }}>
      <span className="menuTitle">{languages[lang].title}</span>
    </MenuItem>);
  }} />;
}