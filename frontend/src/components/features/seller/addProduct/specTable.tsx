import React, { useState } from "react";
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
import { Button, Field, FieldGroup, FieldLabel, Icon, Input } from "@components/ui/NebulaUI";

import s from "@styles/layouts/seller/addProduct.module.scss"

type Specification = {
    id: string;
    key: string;
    value: string;
};

type Props = {
    onChange?: (specs: Specification[]) => void;
};

const createEmptySpec = (): Specification => ({
    id: crypto.randomUUID(),
    key: "",
    value: "",
});

/* ---------- Sortable Row ---------- */

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
    };

    return (
        <tr ref={setNodeRef} style={style}>
            <td {...attributes} {...listeners} style={{ cursor: "grab" }}>
                <Icon></Icon>
            </td>

            <td>
                <Input
                    value={spec.key}
                    placeholder="Specification key"
                    onChange={(e) => onChange(index, "key", e.target.value)}
                />
            </td>

            <td>
                <Input
                    value={spec.value}
                    placeholder="Specification value"
                    onChange={(e) => onChange(index, "value", e.target.value)}
                />
            </td>

            <td style={{height: 32, alignItems: "center", justifyContent: "end", display:"flex", width: "100%"}}>
                <Button disabled={!canRemove} variant={"outline"} size={"icon-sm"} type="button" onClick={onRemove}>
                    <Icon value="" />
                </Button>
            </td>
        </tr>
    );
};

const ProductSpecificationTable: React.FC<Props> = ({ onChange }) => {
    const [specs, setSpecs] = useState<Specification[]>([
        createEmptySpec(),
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const updateSpecs = (newSpecs: Specification[]) => {
        setSpecs(newSpecs);
        onChange?.(newSpecs);
    };

    const handleChange = (
        index: number,
        field: "key" | "value",
        value: string
    ) => {
        const updated = [...specs];
        updated[index][field] = value;
        updateSpecs(updated);
    };

    const addRow = () => {
        updateSpecs([
            ...specs,
            createEmptySpec(),
        ]);
    };

    const removeRow = (index: number) => {
        updateSpecs(
            specs.filter((_, i) => i !== index)
        );
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = specs.findIndex(
            (s) => s.id === active.id
        );
        const newIndex = specs.findIndex(
            (s) => s.id === over.id
        );

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
                    <table style={{ width: "100%", tableLayout: "auto" }}>
                        <colgroup>
                            <col style={{ width: 32 }} />   {/* drag handle */}
                            <col style={{ width: 200 }} />  {/* key */}
                            <col />                         {/* value (flex) */}
                            <col style={{ width: 48 }} />   {/* remove button */}
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
                            items={specs.map((s) => s.id)}
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

                <Button variant={"outline"} size={"sm"} type="button" onClick={addRow}>
                    Add specification
                </Button>
            </Field>
        </FieldGroup>
    );
};

export default ProductSpecificationTable;