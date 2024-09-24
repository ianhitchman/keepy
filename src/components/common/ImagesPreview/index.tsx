import "./ImagesPreview.scss";

const ImagesPreview: React.FC<{
  path: string;
  images?: string[] | null;
}> = ({ images, path }) => {
  if (!images) return null;
  // do we have an odd or even number of images
  const hasOdd = images.length % 2 !== 0;
  return (
    <div className="images-preview" data-has-odd={hasOdd}>
      {images.map((image, index) => {
        return <img key={index} src={`${path}${image}?thumb=238x238`} />;
      })}
    </div>
  );
};

export default ImagesPreview;
