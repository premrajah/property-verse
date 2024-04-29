import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from "react-share";

const ShareButtons = ({ property }) => {
  const shareURL = `${process.env.NEXT_PUBLIC_DOMAIN}/properties/${property.data._id}`;

  return (
    <>
      <h3 className='text-xl font-bold text-center pt-2'>Share This Property</h3>
      <div className='flex gap-3 justify-center pb-5'>
        <FacebookShareButton url={shareURL} hashtags={`#${property.data.type.replace(/\s/g, "")}ForRent`}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareURL}
          title={property.data.name}
          hashtags={[`${property.data.type.replace(/\s/g, "")}ForRent`]}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>

        <WhatsappShareButton url={shareURL} title={property.data.name} separator=':: '>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <EmailShareButton url={shareURL} subject={property.data.name} body={`Check out this property listing`}>
          <EmailIcon size={40} round />
        </EmailShareButton>
      </div>
    </>
  );
};

export default ShareButtons;
