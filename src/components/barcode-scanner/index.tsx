import { useZxing } from "react-zxing";

export const BarcodeScanner = (props) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      props.onDecodeResult(result.getText());
    },
    onError(error) {
      console.error(error);
    },
  });

  return (
    <>
      <video ref={ref} />
    </>
  );
};