"use client";

import { createContext, useContext } from "react";

const SiteContext = createContext(undefined);

export const SiteProvider = ({ siteSettings, children }) => {
    const value = siteSettings ?? {};
    
    return (
        <SiteContext.Provider value={value}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSiteSettings = () => {
    const context = useContext(SiteContext);
    if (context === undefined) {
        throw new Error("useSiteSettings must be used within SiteProvider");
    }
    return context;
};
