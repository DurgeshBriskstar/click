"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { FlexBetween } from "components/flex-box";
import secureAxiosInstance from "lib/secureAxiosInstance";

export default function QuickBooksStatCard({ type = "revenue" }) {
    const [isLoading, setIsLoading] = useState(true);
    const [value, setValue] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        checkConnectionAndFetchData();

        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const quickbooksSuccess = urlParams.get('quickbooks_success');

            if (quickbooksSuccess === 'connected') {
                // Refresh connection status after a short delay
                setTimeout(() => {
                    checkConnectionAndFetchData();
                    // Remove query param from URL
                    const newUrl = window.location.pathname;
                    window.history.replaceState({}, '', newUrl);
                }, 1500);
            }
        }

        // Also refresh when window gains focus (user might have logged in in another tab)
        const handleFocus = () => {
            checkConnectionAndFetchData();
        };

        window.addEventListener('focus', handleFocus);

        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

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

                // Fetch Profit and Loss report for first company
                const reportResponse = await secureAxiosInstance.get(`/quickbooks/reports/profit-loss?minorversion=65${realmId ? `&realmId=${encodeURIComponent(realmId)}` : ""}`);

                if (reportResponse?.data?.success && reportResponse?.data?.data?.report) {
                    const report = reportResponse.data.data.report;
                    extractValue(report, type);
                } else {
                    setError("Failed to fetch report");
                    console.error("QuickBooks Report Error:", reportResponse?.data);
                }
            } else {
                setIsConnected(false);
                console.log("QuickBooks not connected:", statusResponse?.data);
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
            if (!report?.QueryResponse?.Report) {
                return;
            }

            const reportData = report.QueryResponse.Report;

            // QuickBooks P&L report structure can have different formats
            // Handle both array and single object formats for Rows.Row
            const rows = Array.isArray(reportData.Rows?.Row)
                ? reportData.Rows.Row
                : reportData.Rows?.Row
                    ? [reportData.Rows.Row]
                    : [];

            let extractedValue = null;

            // Helper function to parse currency value
            const parseCurrency = (value) => {
                if (!value) return 0;
                const cleaned = String(value).replace(/[,$]/g, '');
                return parseFloat(cleaned) || 0;
            };

            // Helper function to find value in row
            const getRowValue = (row) => {
                if (row?.Summary?.ColData) {
                    // Summary row - get last column (usually the total)
                    const lastCol = row.Summary.ColData[row.Summary.ColData.length - 1];
                    return parseCurrency(lastCol?.value);
                }
                if (row?.ColData) {
                    // Regular row - get last column
                    const lastCol = row.ColData[row.ColData.length - 1];
                    return parseCurrency(lastCol?.value);
                }
                return null;
            };

            if (type === "revenue") {
                // Look for Income section or Total Income
                const incomeRow = rows.find(row => {
                    const label = row?.ColData?.[0]?.value || '';
                    const group = row?.group || '';
                    return label.toLowerCase().includes('total income') ||
                        label.toLowerCase().includes('total revenue') ||
                        group === 'Income';
                });

                if (incomeRow) {
                    extractedValue = getRowValue(incomeRow);
                }

                // If not found, try to find in nested rows
                if (extractedValue === null) {
                    for (const row of rows) {
                        if (row?.group === 'Income' && row?.Rows?.Row) {
                            const incomeRows = Array.isArray(row.Rows.Row) ? row.Rows.Row : [row.Rows.Row];
                            const totalRow = incomeRows.find(r => {
                                const label = r?.ColData?.[0]?.value || '';
                                return label.toLowerCase().includes('total');
                            });
                            if (totalRow) {
                                extractedValue = getRowValue(totalRow);
                                break;
                            }
                        }
                    }
                }
            } else if (type === "expenses") {
                // Look for Expenses section or Total Expenses
                const expenseRow = rows.find(row => {
                    const label = row?.ColData?.[0]?.value || '';
                    const group = row?.group || '';
                    return label.toLowerCase().includes('total expenses') ||
                        group === 'Expenses';
                });

                if (expenseRow) {
                    extractedValue = getRowValue(expenseRow);
                }

                // If not found, try to find in nested rows
                if (extractedValue === null) {
                    for (const row of rows) {
                        if (row?.group === 'Expenses' && row?.Rows?.Row) {
                            const expenseRows = Array.isArray(row.Rows.Row) ? row.Rows.Row : [row.Rows.Row];
                            const totalRow = expenseRows.find(r => {
                                const label = r?.ColData?.[0]?.value || '';
                                return label.toLowerCase().includes('total');
                            });
                            if (totalRow) {
                                extractedValue = getRowValue(totalRow);
                                break;
                            }
                        }
                    }
                }
            } else if (type === "netIncome") {
                // Look for Net Income
                const netIncomeRow = rows.find(row => {
                    const label = row?.ColData?.[0]?.value || '';
                    return label.toLowerCase().includes('net income');
                });

                if (netIncomeRow) {
                    extractedValue = getRowValue(netIncomeRow);
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
                return "Total Revenue";
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

