import styled from 'styled-components';
import 'typeface-roboto';

import Colors from './Colors';
import Media from './Media';

const FONT_FAMILY = {
  logo: 'LeckerliOne, sans-serif',
  header: 'Roboto, sans-serif',
  body: 'Roboto, sans-serif',
};

const FONT_SIZES = {
  logo: '32px',
  xl: '40px',
  h1: '32px',
  h2: '24px',
  h3: '20px',
  p: '16px',
  finePrint: '12px',
};

const FONT_OPACITY = {
  primary: 100,
  secondary: 0.8,
  tertiary: 0.54,
};

const LOGO = styled.span`
  font-size: ${FONT_SIZES.logo};
  font-family: ${FONT_FAMILY.logo};
  font-weight: 400;
`;

const H1 = styled.h1`
  font-size: ${FONT_SIZES.h1};
  font-size: ${props => (props.extraLarge ? FONT_SIZES.xl : '')};
  font-family: ${FONT_FAMILY.header};
  color: white;
  opacity: ${props => (props.isSecondary ? FONT_OPACITY.secondary : '')};
  opacity: ${props => (props.isSupporting ? FONT_OPACITY.supporting : '')};
  font-weight: 600;
  text-align: ${props => (props.centered ? 'center' : '')};
  margin: ${props => (props.noMargin ? '0px' : '')};
  margin-bottom: ${props => (props.noMarginBottom ? '0px' : '')};
  margin-bottom: ${props => (props.marginBottom8px ? '8px' : '')};
`;

const H2 = styled.h2`
  font-size: ${FONT_SIZES.h2};
  font-family: ${FONT_FAMILY.header};
  color: white;
  opacity: ${props => (props.isSecondary ? FONT_OPACITY.secondary : '')};
  opacity: ${props => (props.isSupporting ? FONT_OPACITY.supporting : '')};
  font-weight: 600;
  text-align: ${props => (props.centered ? 'center' : '')};
  margin: ${props => (props.noMargin ? '0px' : '')};
  margin-bottom: ${props => (props.noMarginBottom ? '0px' : '')};
`;

const H3 = styled.h3`
  font-size: ${FONT_SIZES.h3};
  font-family: ${FONT_FAMILY.header};
  color: white;
  opacity: ${props => (props.isSecondary ? FONT_OPACITY.secondary : '')};
  opacity: ${props => (props.isSupporting ? FONT_OPACITY.supporting : '')};
  font-weight: 400;
  text-align: ${props => (props.centered ? 'center' : '')};
  margin: ${props => (props.noMargin ? '0px' : '')};
  margin-bottom: ${props => (props.noMarginBottom ? '0px' : '')};
  margin-bottom: ${props => (props.marginBottom4px ? '4px' : '')};
  margin-bottom: ${props => (props.marginBottom8px ? '8px' : '')};
  margin-top: ${props => (props.noMarginTop ? '0px' : '')};
`;

const P = styled.p`
  font-size: ${FONT_SIZES.p};
  font-family: ${FONT_FAMILY.body};
  font-weight: 400;
  color: white;
  opacity: ${props => (props.isSecondary ? FONT_OPACITY.secondary : '')};
  opacity: ${props => (props.isSupporting ? FONT_OPACITY.supporting : '')};
  ${props => (props.isSupporting ? `color: ${Colors.greys.supporting};` : '')}
  ${props => (props.isSecondary ? `color: ${Colors.greys.secondary};` : '')}
  margin: 0;
  text-align: ${props => (props.centered ? 'center' : '')};
`;

const FinePrint = styled.span`
  font-size: ${FONT_SIZES.finePrint};
  font-family: ${FONT_FAMILY.body};
  font-weight: 300;
  color: white;
  opacity: ${props => (props.isSecondary ? FONT_OPACITY.secondary : '')};
  opacity: ${props => (props.isSupporting ? FONT_OPACITY.supporting : '')};
  text-align: center;
`;

const ERROR = styled.p`
  font-size: ${FONT_SIZES.p};
  font-family: ${FONT_FAMILY.body};
  font-weight: bold;
  color: ${Colors.error.primary};
  margin: 8px 0;
  margin: ${props => (props.noMargin ? '0px' : '')};
  text-align: ${props => (props.centered ? 'center' : '')};
`;

const A = styled.a`
  text-decoration: none;
  color: ${Colors.primary.red};
  font-weight: bold;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
  text-align: ${props => (props.centered ? 'center' : '')};
`;

const Link = styled.span`
  text-decoration: none;
  color: ${Colors.primary.red};
  font-weight: bold;
  cursor: pointer;
  :hover {
    text-decoration: underline;
  }
  text-align: ${props => (props.centered ? 'center' : '')};
`;

const Fonts = {};
Fonts.family = FONT_FAMILY;
Fonts.sizes = FONT_SIZES;
Fonts.LOGO = LOGO;
Fonts.H1 = H1;
Fonts.H2 = H2;
Fonts.H3 = H3;
Fonts.P = P;
Fonts.Link = Link;
Fonts.FinePrint = FinePrint;
Fonts.ERROR = ERROR;
Fonts.A = A;

export default Fonts;
