import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { RoundedLabelTag, lightTheme, Icon } from '@deskpro/deskpro-ui';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

const CustomRoundedLabelTag = styled(RoundedLabelTag)`
  border-color: transparent;

  &:hover {
    border-color: transparent;
  };
`;

interface InternalIconLink {
  link: string;
};

export function InternalIconLink({ link }: InternalIconLink){
  const navigate = useNavigate();
  const theme = lightTheme;

  return (
    <div onClick={() => navigate(link)}>
      <CustomRoundedLabelTag
        size='small'
        withClose={false}
        backgroundColor='transparent'
        textColor={theme.colors.grey40}
        closeIcon={faArrowUpRightFromSquare}
        label={<Icon icon={faArrowUpRightFromSquare} />}
      />
    </div>
  );
};