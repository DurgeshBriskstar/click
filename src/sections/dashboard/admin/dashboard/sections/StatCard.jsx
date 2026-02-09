import Image from "next/image";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { FlexBetween } from "components/flex-box";

export default function StatCard(props) {
    const { title, amount1, amount2 } = props;

    return (
        <Card className="p-1">
            <Typography variant="h6" sx={{ mb: 1, color: "grey.600" }}>
                {title}
            </Typography>

            <Typography variant="h3" sx={{ mb: 0.3 }}>
                {amount1}
            </Typography>

            <FlexBetween>
                <Typography variant="h6" sx={{ color: "grey.500" }}>
                    {amount2}
                </Typography>

                <Image
                    src="/backend-assets/sso-logins/Intuit.png"
                    alt="Intuit"
                    width={80}
                    height={24}
                    style={{ objectFit: "contain" }}
                />
            </FlexBetween>
        </Card>
    );
}