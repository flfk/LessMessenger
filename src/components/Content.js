import styled from 'styled-components';

import Colors from '../utils/Colors';
import Media from '../utils/Media';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 600px;
  margin: auto;
  padding-left: 16px;
  padding-right: 16px;

  align-items: ${props => (props.alignCenter ? 'centered' : '')};

  ${Media.tablet} {
    width: auto;
    margin: 0;
  }
`;

const NoPadding = styled(Content)`
  padding: 0;
`;

const Centered = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CenteredBothAxis = styled(Content)`
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  justify-content: ${props => (props.justifySpaceAround ? 'space-around' : '')};
  justify-content: ${props => (props.justifyCenter ? 'center' : '')};
  justify-content: ${props => (props.justifyEnd ? 'flex-end' : '')};
  justify-content: ${props => (props.justifyStart ? 'flex-start' : '')};
  align-items: flex-end;
  align-items: ${props => (props.alignCenter ? 'center' : '')};
  align-items: ${props => (props.alignTop ? 'flex-start' : '')};

  > divp:first-child {
    margin-right: 8px;
  }
`;

const Seperator = styled.div`
  height: 1px;
  width: 100%;
  margin: 16px 0;
  background-color: ${Colors.greys.light};
`;

const Gap = styled.div`
  width: 4px;
  height: 100%;
`;

const Spacing = styled.div`
  width: 100%;
  height: 32px;
`;

const Spacing8px = styled.div`
  width: 100%;
  height: 8px;
`;

const Spacing16px = styled.div`
  width: 100%;
  height: 16px;
`;

Content.Centered = Centered;
Content.CenteredBothAxis = CenteredBothAxis;
Content.Gap = Gap;
Content.NoPadding = NoPadding;
Content.Row = Row;
Content.Seperator = Seperator;
Content.Spacing = Spacing;
Content.Spacing8px = Spacing8px;
Content.Spacing16px = Spacing16px;

export default Content;
