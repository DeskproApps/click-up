import styled from "styled-components";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import Flatpickr from 'react-flatpickr';
import { Input } from "@deskpro/deskpro-ui";
import { useDeskproAppTheme } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { AnyIcon } from "@deskpro/deskpro-ui";
import type { DateTimePickerProps } from "react-flatpickr";
import "./DateInput.css";

export type Props = DateTimePickerProps & {
  id: string;
  error: boolean,
  required?: boolean,
  placeholder?: string,
  enableTime?: boolean,
  onChange: (date: [Date]) => void,
}

const StyledInput = styled(Input)`
  :read-only {
    cursor: pointer;
  }
`;

const DateInput: FC<Props> = ({
  id,
  error,
  value,
  onChange,
  enableTime,
  placeholder,
}) => {
  const { theme } = useDeskproAppTheme();

  return (
    <Flatpickr
      options={{
        position: "auto",
        dateFormat: "j F Y",
        ...(!enableTime ? {} : {
          dateFormat: "j F Y H:i",
          minuteIncrement: 5,
          enableTime: true,
          time_24hr: true,
        }),
      }}
      value={value}
      defaultValue=""
      onChange={onChange}
      render={({ defaultValue, ...props }, ref) => (
        <StyledInput
          {...props}
          id={id}
          ref={ref}
          variant="inline"
          inputsize="small"
          placeholder={placeholder}
          defaultValue={defaultValue || ''}
          error={error}
          style={{paddingRight: 0}}
          rightIcon={{
            icon: faCalendarDays as AnyIcon,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            style: {
              color: theme.colors.grey40,
            }
          }}
        />
      )}
    />
  )
};

export { DateInput };
