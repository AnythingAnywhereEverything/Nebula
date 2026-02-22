import { Checkbox } from "@components/ui/NebulaUI";
import React, { useState } from "react";

const MassPrintOptions: React.FC = () => {
  const [selected, setSelected] = useState<string>("label");

  const Item = ({ id, label }: { id: string; label: string }) => (
    <div
      onClick={() => setSelected(id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 12px",
        cursor: "pointer",
        userSelect: "none",
        fontSize: "12px"
      }}
    >
      <Checkbox checked={selected === id} />
      <p>{label}</p>
    </div>
  );

  return (
    <>
      <Item id="label" label="Shipping label" />
      <Item id="packing" label="Packing list" />
      <Item id="picklist" label="Picklist" />
    </>
  );
};

export default MassPrintOptions