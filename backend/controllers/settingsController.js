import Settings from "../models/Settings.js";

export const getSettings = async (req, res) => {
    try {
        const settings = await Settings.findAll();

        // Convert array of settings into structured object
        const structuredSettings = settings.reduce((acc, setting) => {
            const { group, key, value } = setting;

            if (!acc[group]) {
                acc[group] = {};
            }

            try {
                // Try to parse JSON values
                acc[group][key] = JSON.parse(value);
            } catch (e) {
                // If not JSON, use the raw value
                acc[group][key] = value;
            }

            return acc;
        }, {});

        res.json(structuredSettings);
    } catch (error) {
        console.error("Get Settings Error:", error);
        res.status(500).json({ message: "Failed to retrieve settings" });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const settings = req.body;

        // Flatten the settings object for storage
        const flatSettings = [];
        for (const [group, groupSettings] of Object.entries(settings)) {
            if (typeof groupSettings === 'object') {
                for (const [key, value] of Object.entries(groupSettings)) {
                    flatSettings.push({
                        group,
                        key,
                        value: typeof value === 'object' ? JSON.stringify(value) : String(value)
                    });
                }
            }
        }

        // Update each setting
        for (const setting of flatSettings) {
            await Settings.upsert({
                group: setting.group,
                key: setting.key,
                value: setting.value
            }, {
                where: {
                    group: setting.group,
                    key: setting.key
                }
            });
        }

        res.json({ message: "Settings updated successfully" });
    } catch (error) {
        console.error("Update Settings Error:", error);
        res.status(500).json({ message: "Failed to update settings" });
    }
};