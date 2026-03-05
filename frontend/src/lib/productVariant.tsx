type VariantGroup = {
    id: string;
    name: string;
    options: string[];
};

export type VariantCombination = {
    id: string;
    values: {
        [variantName: string]: string;
    };
};

export function generateVariantMatrix(
    variants: VariantGroup[]
): VariantCombination[] {

    const validVariants = variants.filter(
        v => v.name.trim() && v.options.length > 0
    );

    if (validVariants.length === 0) return [];

    const buildKey = (values: Record<string, string>) => {
        return Object.entries(values)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([k, v]) => `${k}:${v}`)
            .join("|");
        // * deterministic id based on variant values
    };

    return validVariants.reduce<VariantCombination[]>(
        (acc, variant) => {

            const next: VariantCombination[] = [];

            acc.forEach(existing => {

                variant.options.forEach(option => {

                    const values = {
                        ...existing.values,
                        [variant.name]: option
                    };

                    next.push({
                        id: buildKey(values),
                        values
                    });

                });

            });

            return next;

        },
        [
            {
                id: "",
                values: {}
            }
        ]
    );
}