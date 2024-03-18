import Image from "next/image";

const PropertyHeaderImage = ({ image }) => {
  return (
    <section>
      <div className='container-xl m-auto'>
        <div className='grid grid-cols-1'>
          <Image
            className='object-cover.h-[400px] w-full'
            src={`/images/properties/${image}`}
            alt=''
            height={0}
            width={0}
            sizes='100vw'
            priority={true}
          />
        </div>
      </div>
    </section>
  );
};

export default PropertyHeaderImage;
