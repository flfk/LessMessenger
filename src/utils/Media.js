// Media Templates

const SIZES = {
  desktop: 992,
  tablet: 768,
  phone: 425,
};

const MEDIA = {
  desktop: `@media only screen and (max-width: ${SIZES.desktop}px)`,
  tablet: `@media only screen and (max-width: ${SIZES.tablet}px)`,
  phone: `@media only screen and (max-width: ${SIZES.phone}px)`,
};

export default MEDIA;
