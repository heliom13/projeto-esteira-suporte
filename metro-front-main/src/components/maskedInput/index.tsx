import { useMemo } from "react";
import { MaskedInput } from "antd-mask-input";

const DynamicMask = (props: any) => {
  const cpfMask = "000.000.000-00";
  const cnpjMask = "00.000.000/0000-00";

  const mask = useMemo(
    () => [
      {
        mask: cpfMask,
        lazy: false,
      },
      {
        mask: cnpjMask,
        lazy: false,
      },
    ],
    []
  );

  return (
    <MaskedInput
      {...props}
      mask={mask}
      maskOptions={{
        dispatch: function (appended, dynamicMasked) {
          return dynamicMasked.unmaskedValue.length === 12
            ? dynamicMasked.compiledMasks[0]
            : dynamicMasked.compiledMasks[1];
        },
      }}
    />
  );
};

export default DynamicMask;
