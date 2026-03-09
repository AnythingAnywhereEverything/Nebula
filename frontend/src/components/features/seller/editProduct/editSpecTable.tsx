import React, { CSSProperties } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";

import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import {
    Button,
    Field,
    FieldGroup,
    FieldLabel,
    Icon,
    Input
} from "@components/ui/NebulaUI";

import s from "@styles/layouts/seller/addProduct.module.scss";

export type Specification = {
    id: string;
    key: string;
    value: string;
};

type Props = {
    value: Specification[];
    onChange?: (specs: Specification[]) => void;
};

const createEmptySpec = (): Specification => ({
    id: crypto.randomUUID(),
    key: "",
    value: "",
});

/* =========================================
    Sortable Row
========================================= */

const SortableRow: React.FC<{
    spec: Specification;
    index: number;
    onChange: (index: number, field: "key" | "value", value: string) => void;
    onRemove: () => void;
    canRemove: boolean;
}> = ({ spec, index, onChange, onRemove, canRemove }) => {

    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: spec.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    } as CSSProperties;

    return (
        <tr ref={setNodeRef} style={style}>
            <td {...attributes} {...listeners} style={{ cursor: "grab" }}>
                <Icon></Icon>
            </td>

            <td>
                <Input
                    id={`spec-key-${index}`}
                    value={spec.key}
                    placeholder="Specification key"
                    onChange={(e) =>
                        onChange(index, "key", e.target.value)
                    }
                />
            </td>

            <td>
                <Input
                    id={`spec-value-${index}`}
                    value={spec.value}
                    placeholder="Specification value"
                    onChange={(e) =>
                        onChange(index, "value", e.target.value)
                    }
                />
            </td>

            <td
                style={{
                    height: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "end",
                    width: "100%"
                }}
            >
                <Button
                    disabled={!canRemove}
                    variant="outline"
                    size="icon-sm"
                    type="button"
                    onClick={onRemove}
                >
                    <Icon value="" />
                </Button>
            </td>
        </tr>
    );
};

/* =========================================
    Main Table
========================================= */

const EditProductSpecificationTable: React.FC<Props> = React.memo(({
    value,
    onChange
}) => {

    const specs = value.length ? value : [createEmptySpec()];
    const sensors = useSensors(useSensor(PointerSensor));

    const updateSpecs = (newSpecs: Specification[]) => {
        onChange?.(newSpecs);
    };

    const handleChange = (
        index: number,
        field: "key" | "value",
        val: string
    ) => {

        const updated = [...specs];
        updated[index] = {
            ...updated[index],
            [field]: val
        };

        updateSpecs(updated);
    };

    const addRow = () => {
        updateSpecs([
            ...specs,
            createEmptySpec()
        ]);
    };

    const removeRow = (index: number) => {

        const filtered = specs.filter((_, i) => i !== index);

        // * ensure at least 1 row exists visually
        updateSpecs(filtered.length ? filtered : []);
    };

    const handleDragEnd = (event: any) => {

        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = specs.findIndex(s => s.id === active.id);
        const newIndex = specs.findIndex(s => s.id === over.id);

        updateSpecs(
            arrayMove(specs, oldIndex, newIndex)
        );
    };

    return (
        <FieldGroup>
            <Field>

                <FieldLabel>
                    Product Specification
                </FieldLabel>

                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <table
                        style={{
                            width: "100%",
                            tableLayout: "auto",
                            borderSpacing: "calc(var(--spacing) * 2)"
                        }}
                    >
                        <colgroup>
                            <col style={{ width: 16 }} />
                            <col style={{ width: 200 }} />
                            <col />
                            <col style={{ width: 32 }} />
                        </colgroup>

                        <thead className={s.visuallyHidden}>
                            <tr>
                                <th />
                                <th>Key</th>
                                <th>Value</th>
                                <th />
                            </tr>
                        </thead>

                        <SortableContext
                            items={specs.map(s => s.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <tbody>
                                {specs.map((spec, index) => (
                                    <SortableRow
                                        key={spec.id}
                                        spec={spec}
                                        index={index}
                                        onChange={handleChange}
                                        onRemove={() => removeRow(index)}
                                        canRemove={specs.length > 1}
                                    />
                                ))}
                            </tbody>
                        </SortableContext>

                    </table>
                </DndContext>

                <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={addRow}
                >
                    Add specification
                </Button>

            </Field>
        </FieldGroup>
    );
});

export default React.memo(EditProductSpecificationTable);