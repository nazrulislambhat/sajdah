import React from 'react';
import { Switch } from '@nextui-org/react';

export default function RamadanSwitch() {
  const [isSelected, setIsSelected] = React.useState(true);

  return (
    <div className="flex flex-col items-center gap-2">
      <h2 className="text-Primarysajdah text-xl font-semibold">Ramadan mode</h2>
      <Switch
        isSelected={isSelected}
        onValueChange={setIsSelected}
        color="success"
      ></Switch>
    </div>
  );
}
