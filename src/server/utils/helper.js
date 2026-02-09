import { saveBase64File } from "server/utils/saveBase64File";

export async function processSiteSettings(body) {
    const { source, ...updatedPayload } = body;
    let processedBody = { ...updatedPayload };

    async function handleImage(fieldName, folder, type) {
        const item = body[fieldName];

        if (item?.base64) {
            const fileName = await saveBase64File(item.base64, folder, type);
            processedBody[fieldName] = `/backend-assets/site/${fileName}`;
        } else if (item === null || item === "") {
            processedBody[fieldName] = null;
        }
    }

    await Promise.all([
        handleImage("site_logo", "site", "logo"),
        handleImage("site_favicon", "site", "favicon")
    ]);

    return processedBody;
}

export async function processCMSSections(sections, folder) {
    const updatedSections = {};

    for (const key of Object.keys(sections)) {
        const section = sections[key];
        const updatedSection = JSON.parse(JSON.stringify(section));

        if (Array.isArray(updatedSection.highlights)) {
            updatedSection.highlights = await Promise.all(
                updatedSection.highlights.map(async (highlight) => {
                    if (highlight.image?.base64) {
                        const fileName = await saveBase64File(
                            highlight.image.base64,
                            folder,
                            "highlight"
                        );

                        highlight.image = `/backend-assets/${folder}/${fileName}`;
                    }
                    return highlight;
                })
            );
        }

        if (Array.isArray(updatedSection.teams)) {
            updatedSection.teams = await Promise.all(
                updatedSection.teams.map(async (team) => {
                    if (team.image?.base64) {
                        const fileName = await saveBase64File(
                            team.image.base64,
                            folder,
                            "team"
                        );

                        team.image = `/backend-assets/${folder}/${fileName}`;
                    }
                    return team;
                })
            );
        }

        if (updatedSection.image?.base64) {
            const fileName = await saveBase64File(
                updatedSection.image.base64,
                folder,
                "img"
            );

            updatedSection.image = `/backend-assets/${folder}/${fileName}`;
        }

        if (updatedSection.image1?.base64) {
            const fileName = await saveBase64File(
                updatedSection.image1.base64,
                folder,
                "img1"
            );

            updatedSection.image1 = `/backend-assets/${folder}/${fileName}`;
        }

        if (updatedSection.image2?.base64) {
            const fileName = await saveBase64File(
                updatedSection.image2.base64,
                folder,
                "img2"
            );

            updatedSection.image2 = `/backend-assets/${folder}/${fileName}`;
        }

        if (updatedSection.background_image?.base64) {
            const fileName = await saveBase64File(
                updatedSection.background_image.base64,
                folder,
                "bg"
            );

            updatedSection.background_image = `/backend-assets/${folder}/${fileName}`;
        }

        if (updatedSection.banner_image?.base64) {
            const fileName = await saveBase64File(
                updatedSection.banner_image.base64,
                folder,
                "banner"
            );

            updatedSection.banner_image = `/backend-assets/${folder}/${fileName}`;
        }

        updatedSections[key] = updatedSection;
    }

    return updatedSections;
}

