"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { FlexBetween } from "components/flex-box";
import secureAxiosInstance from "lib/secureAxiosInstance";
import { format } from "date-fns";

export default function QuickBooksStatCard({ type = "revenue" }) {
    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const pathname = usePathname();
    const { startDate, endDate } = useSelector((state) => state.dashboardInquiry);

    useEffect(() => {
        checkConnectionAndFetchData();

        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const quickbooksSuccess = urlParams.get('quickbooks_success');

            if (quickbooksSuccess === 'connected') {
                setTimeout(() => {
                    checkConnectionAndFetchData();
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                }, 1500);
            }
        }

        const handleFocus = () => {
            checkConnectionAndFetchData();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [startDate, endDate]);

    const checkConnectionAndFetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Check connection status
            const statusResponse = await secureAxiosInstance.get("/quickbooks/status");

            if (statusResponse?.data?.success && statusResponse?.data?.data?.connected && statusResponse?.data?.data?.companies?.length > 0) {
                setIsConnected(true);
                const companies = statusResponse.data.data.companies;
                const realmId = companies[0]?.realmId;

                const params = new URLSearchParams({ minorversion: "65" });
                if (realmId) params.set("realmId", realmId);
                if (startDate && endDate) {
                    params.set("startDate", format(new Date(startDate), "yyyy-MM-dd"));
                    params.set("endDate", format(new Date(endDate), "yyyy-MM-dd"));
                }
                const reportResponse = await secureAxiosInstance.get(`/quickbooks/reports/profit-loss?${params.toString()}`);

                if (reportResponse?.data?.success && reportResponse?.data?.data?.report) {
                    const report = reportResponse.data.data.report;
                    extractValue(report, type);
                } else {
                    setError("Failed to fetch report");
                    console.error("QuickBooks Report Error:", reportResponse?.data);
                }
            } else {
                setIsConnected(false);
            }
        } catch (err) {
            console.error("QuickBooks error:", err);
            setIsConnected(false);
            setError(err.response?.data?.message || "Not connected");
        } finally {
            setIsLoading(false);
        }
    };

    const extractValue = (report, type) => {
        try {
            if (!report || typeof report !== "object") {
                setValue(null);
                return;
            }

            const parseCurrency = (val) => {
                if (val == null || val === "") return 0;
                const cleaned = String(val).replace(/[,$\s]/g, "");
                return parseFloat(cleaned) || 0;
            };

            const getLabel = (row) => {
                const s = row?.Summary?.ColData?.[0];
                const h = row?.Header?.ColData?.[0];
                const c = row?.ColData?.[0];
                const v = (x) => (x && typeof x === "object" && "value" in x ? x.value : x);
                return [s, h, c].map(v).find((x) => x != null && x !== "") ?? "";
            };

            const getValueFromColData = (colData) => {
                if (!colData?.length) return null;
                const last = colData[colData.length - 1];
                const val = last && typeof last === "object" && "value" in last ? last.value : last;
                return parseCurrency(val);
            };

            const getRowValue = (row) => {
                if (row?.Summary?.ColData?.length) return getValueFromColData(row.Summary.ColData);
                if (row?.ColData?.length) return getValueFromColData(row.ColData);
                if (row?.Header?.ColData?.length > 1) return getValueFromColData(row.Header.ColData);
                return null;
            };

            const labelMatches = (label, ...keywords) => {
                const lower = (label || "").toLowerCase();
                return keywords.some((k) => lower.includes(k));
            };

            const reportData =
                report?.QueryResponse?.Report ??
                report?.Report ??
                report?.Body ??
                report?.ProfitAndLossReport ??
                report;
            const rowsContainer = reportData?.Rows ?? reportData?.rows;
            const rowList = rowsContainer?.Row ?? rowsContainer?.row;
            const topRows = Array.isArray(rowList) ? rowList : rowList != null ? [rowList] : [];

            const collectAllRows = (rows, out = []) => {
                for (const row of rows) {
                    if (!row) continue;
                    out.push(row);
                    const nested = row?.Rows?.Row ?? row?.Rows?.row ?? row?.rows?.Row ?? row?.rows?.row;
                    const arr = Array.isArray(nested) ? nested : nested ? [nested] : [];
                    if (arr.length) collectAllRows(arr, out);
                }
                return out;
            };

            const allRows = collectAllRows(topRows);
            let extractedValue = null;

            // Revenue card shows Net Income (actual revenue / bottom line), not Total Income
            const effectiveType = type === "revenue" ? "netIncome" : type;

            for (const row of allRows) {
                const label = getLabel(row);
                if (!label) continue;
                const isMatch =
                    effectiveType === "revenue"
                        ? labelMatches(label, "total income", "total revenue") || (labelMatches(label, "income") && row?.Summary?.ColData?.length)
                        : effectiveType === "expenses"
                            ? labelMatches(label, "total expenses", "total expense") || (labelMatches(label, "expenses") && row?.Summary?.ColData?.length)
                            : labelMatches(label, "net income");
                if (isMatch) {
                    const v = getRowValue(row);
                    if (v != null) {
                        extractedValue = v;
                        break;
                    }
                }
            }

            if (extractedValue == null && effectiveType === "revenue") {
                const incomeSection = topRows.find((r) => labelMatches(getLabel(r), "income") && !labelMatches(getLabel(r), "total"));
                if (incomeSection?.Summary?.ColData?.length) extractedValue = getValueFromColData(incomeSection.Summary.ColData);
                else if (incomeSection?.Rows?.Row) {
                    const inner = Array.isArray(incomeSection.Rows.Row) ? incomeSection.Rows.Row : [incomeSection.Rows.Row];
                    const totalRow = inner.find((r) => labelMatches(getLabel(r), "total"));
                    if (totalRow) extractedValue = getRowValue(totalRow);
                }
            }
            if (extractedValue == null && effectiveType === "expenses") {
                const expSection = topRows.find((r) => labelMatches(getLabel(r), "expenses") && !labelMatches(getLabel(r), "total"));
                if (expSection?.Summary?.ColData?.length) extractedValue = getValueFromColData(expSection.Summary.ColData);
                else if (expSection?.Rows?.Row) {
                    const inner = Array.isArray(expSection.Rows.Row) ? expSection.Rows.Row : [expSection.Rows.Row];
                    const totalRow = inner.find((r) => labelMatches(getLabel(r), "total"));
                    if (totalRow) extractedValue = getRowValue(totalRow);
                }
            }

            setValue(extractedValue);
        } catch (err) {
            console.error("Error extracting QuickBooks value:", err);
            setValue(null);
        }
    };

    const formatCurrency = (amount) => {
        if (amount === null || amount === undefined) return "-";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    const getTitle = () => {
        switch (type) {
            case "revenue":
                return "Net Income";
            case "expenses":
                return "Total Expenses";
            case "netIncome":
                return "Net Income";
            default:
                return "QuickBooks";
        }
    };

    const getColor = () => {
        switch (type) {
            case "revenue":
                return "success.main";
            case "expenses":
                return "error.main";
            case "netIncome":
                return value >= 0 ? "success.main" : "error.main";
            default:
                return "text.primary";
        }
    };

    const handleConnect = () => {
        window.location.href = "/api/quickbooks/oauth";
    };

    return (
        <Card className="p-1">
            <Typography variant="h6" sx={{ mb: 1, color: "grey.600" }}>
                {getTitle()}
            </Typography>

            {isLoading ? (
                <Skeleton animation="wave" height={50} width={120} />
            ) : (
                <>
                    {isConnected ? (
                        <>
                            <Typography variant="h3" sx={{ mb: 0.3, color: getColor() }}>
                                {formatCurrency(value)}
                            </Typography>
                            <FlexBetween>
                                <Typography variant="h6" sx={{ color: "grey.500" }}>
                                    {value !== null ? "From QuickBooks" : "No data"}
                                </Typography>
                                <Image
                                    src="/backend-assets/sso-logins/Intuit.png"
                                    alt="QuickBooks"
                                    width={80}
                                    height={24}
                                    style={{ objectFit: "contain" }}
                                />
                            </FlexBetween>
                        </>
                    ) : (
                        <>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ color: "grey.500", mb: 2 }}>
                                    Connect QuickBooks to view statistics
                                </Typography>
                                <Button variant="contained" size="small" onClick={handleConnect} sx={{ bgcolor: "#F58027", "&:hover": { bgcolor: "#d96e1f", }, }}>
                                    Connect QuickBooks
                                </Button>
                            </Box>
                            <Image
                                src="/backend-assets/sso-logins/Intuit.png"
                                alt="QuickBooks"
                                width={80}
                                height={24}
                                style={{ objectFit: "contain", opacity: 0.5 }}
                            />
                        </>
                    )}
                </>
            )}
        </Card>
    );
}

